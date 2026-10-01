import { evaluateDomainHealth, mailDomain, type DomainDnsRecords } from "@/lib/domain-health/evaluate";

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
