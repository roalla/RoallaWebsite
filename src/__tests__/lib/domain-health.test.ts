import { evaluateDomainHealth, mailDomain, type DomainDnsRecords } from "@/lib/domain-health/evaluate";
import { createDnsJsonClient, decodeMxRdata, decodeTxtRdata, DomainLookupError, inspectDomain } from "@/lib/domain-health/lookup";

function records(overrides: Partial<DomainDnsRecords> = {}): DomainDnsRecords {
  return {
    domain: "example.com",
    mx: [{ exchange: "aspmx.l.google.com", priority: 1 }],
    txt: ["v=spf1 include:_spf.google.com -all"],
    dmarc: ["v=DMARC1; p=reject; rua=mailto:dmarc@example.com"],
    dkimSelectors: ["google"],
    apexAddresses: ["192.0.2.10"],
    wwwAddresses: ["192.0.2.10"],
    ...overrides,
  };
}

describe("mailDomain", () => {
  it("reads mail records on the name without a leading www", () => {
    expect(mailDomain("www.roalla.com")).toBe("roalla.com");
    expect(mailDomain("roalla.com")).toBe("roalla.com");
  });
});

describe("evaluateDomainHealth", () => {
  it("passes a domain whose mail is authenticated and whose names agree", () => {
    const snapshot = evaluateDomainHealth(records());
    expect(snapshot.checks.map((check) => [check.id, check.status])).toEqual([
      ["mx", "pass"],
      ["spf", "pass"],
      ["dkim", "pass"],
      ["dmarc", "pass"],
      ["names", "pass"],
    ]);
  });

  it("flags missing mail authentication that lets messages be discarded or forged", () => {
    const snapshot = evaluateDomainHealth(records({
      mx: [],
      txt: [],
      dmarc: [],
      dkimSelectors: [],
    }));
    expect(snapshot.checks.find((check) => check.id === "mx")?.status).toBe("gap");
    expect(snapshot.checks.find((check) => check.id === "spf")?.status).toBe("gap");
    expect(snapshot.checks.find((check) => check.id === "dkim")?.status).toBe("gap");
    expect(snapshot.checks.find((check) => check.id === "dmarc")?.status).toBe("gap");
  });

  it("treats a monitor-only DMARC policy and an allow-all SPF as unfinished", () => {
    const snapshot = evaluateDomainHealth(records({
      txt: ["v=spf1 +all"],
      dmarc: ["v=DMARC1; p=none"],
    }));
    expect(snapshot.checks.find((check) => check.id === "spf")?.status).toBe("gap");
    expect(snapshot.checks.find((check) => check.id === "dmarc")?.status).toBe("review");
  });

  it("accepts a soft-fail SPF and a www name that points at the bare domain", () => {
    const snapshot = evaluateDomainHealth(records({
      txt: ["v=spf1 include:_spf.google.com ~all"],
      apexAddresses: ["192.0.2.10"],
      wwwAddresses: [],
      wwwCname: "example.com",
    }));
    expect(snapshot.checks.find((check) => check.id === "spf")?.status).toBe("pass");
    expect(snapshot.checks.find((check) => check.id === "names")?.status).toBe("pass");
  });

  it("marks the bare name and www for review when they resolve apart", () => {
    const snapshot = evaluateDomainHealth(records({
      apexAddresses: ["192.0.2.10"],
      wwwAddresses: ["192.0.2.20"],
    }));
    expect(snapshot.checks.find((check) => check.id === "names")?.status).toBe("review");
  });
});

function dnsResponse(type: number, data: string[], status = 0) {
  return {
    Status: status,
    Answer: data.map((value) => ({ type, data: value })),
  };
}

function mockDns(answers: Record<string, { Status?: number; Answer?: Array<{ type: number; data: string }> } | Error>): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input : input.url);
    const key = `${url.searchParams.get("type")}:${url.searchParams.get("name")}`;
    const body = answers[key] ?? { Status: 3, Answer: [] };
    if (body instanceof Error) throw body;
    return { ok: true, status: 200, json: async () => body };
  }) as typeof fetch;
}

describe("DNS-over-HTTPS lookup", () => {
  it("joins split text records and reads a mail exchanger", () => {
    expect(decodeTxtRdata("\"v=DKIM1; p=AAAA\" \"BBBB;\"")).toBe("v=DKIM1; p=AAAABBBB;");
    expect(decodeMxRdata("0 roalla-com.mail.protection.outlook.com.")).toEqual({
      priority: 0,
      exchange: "roalla-com.mail.protection.outlook.com",
    });
  });

  it("passes roalla.com when the public records are present, including a signed key behind a name alias", async () => {
    const client = createDnsJsonClient(mockDns({
      "15:roalla.com": dnsResponse(15, ["0 roalla-com.mail.protection.outlook.com."]),
      "16:roalla.com": dnsResponse(16, ["\"v=spf1 include:spf.protection.outlook.com include:mailgun.org include:spf.brevo.com ~all\""]),
      "16:_dmarc.roalla.com": dnsResponse(16, ["\"v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@roalla.com\""]),
      "16:selector1._domainkey.roalla.com": {
        Status: 0,
        Answer: [
          { type: 5, data: "selector1-roalla-com._domainkey.roalla.y-v1.dkim.mail.microsoft." },
          { type: 16, data: "\"v=DKIM1; k=rsa; p=AAAA\" \"BBBB;\"" },
        ],
      },
      "1:roalla.com": dnsResponse(1, ["172.64.80.1"]),
      "28:roalla.com": dnsResponse(28, ["2606:4700:130:436c:6f75:6466:6c61:7265"]),
      "1:www.roalla.com": dnsResponse(1, ["172.64.80.1"]),
      "28:www.roalla.com": dnsResponse(28, ["2606:4700:130:436c:6f75:6466:6c61:7265"]),
    }));

    const snapshot = await inspectDomain("roalla.com", client, () => "2026-10-01T00:00:00.000Z");
    expect(snapshot.checks.map((check) => [check.id, check.status])).toEqual([
      ["mx", "pass"],
      ["spf", "pass"],
      ["dkim", "pass"],
      ["dmarc", "pass"],
      ["names", "pass"],
    ]);
  });

  it("reports a failed lookup instead of claiming the records are missing", async () => {
    const client = createDnsJsonClient(mockDns({
      "15:roalla.com": new Error("network down"),
    }));
    await expect(inspectDomain("roalla.com", client)).rejects.toBeInstanceOf(DomainLookupError);
  });

  it("tries the second public resolver when the first one fails", async () => {
    const fetchImpl = (async (input: RequestInfo | URL) => {
      const url = new URL(typeof input === "string" ? input : input instanceof URL ? input : input.url);
      if (url.hostname === "cloudflare-dns.com") {
        return { ok: false, status: 500, json: async () => ({}) };
      }
      const type = Number(url.searchParams.get("type"));
      const name = url.searchParams.get("name") ?? "";
      if (type === 15 && name === "example.com") {
        return { ok: true, status: 200, json: async () => dnsResponse(15, ["1 aspmx.l.google.com."]) };
      }
      if (type === 16 && name === "example.com") {
        return { ok: true, status: 200, json: async () => dnsResponse(16, ["\"v=spf1 -all\""]) };
      }
      if (type === 16 && name === "_dmarc.example.com") {
        return { ok: true, status: 200, json: async () => dnsResponse(16, ["\"v=DMARC1; p=reject\""]) };
      }
      if (type === 16 && name === "google._domainkey.example.com") {
        return { ok: true, status: 200, json: async () => dnsResponse(16, ["\"v=DKIM1; p=abc\""]) };
      }
      if (type === 1) return { ok: true, status: 200, json: async () => dnsResponse(1, ["192.0.2.10"]) };
      return { ok: true, status: 200, json: async () => ({ Status: 3, Answer: [] }) };
    }) as typeof fetch;

    const snapshot = await inspectDomain("example.com", createDnsJsonClient(fetchImpl), () => "2026-10-01T00:00:00.000Z");
    expect(snapshot.checks.every((check) => check.status === "pass")).toBe(true);
  });
});
