import { evaluateDomainHealth, type DomainDnsRecords, type DomainHealthSnapshot } from "@/lib/domain-health/evaluate";

const DKIM_SELECTORS = ["google", "selector1", "selector2", "k1", "s1", "s2", "dkim", "default"] as const;
const QUERY_TIMEOUT_MS = 6_000;
const DNS_PROVIDERS = ["https://cloudflare-dns.com/dns-query", "https://dns.google/resolve"] as const;

const DNS_TYPE = {
  A: 1,
  NS: 2,
  CNAME: 5,
  MX: 15,
  TXT: 16,
  AAAA: 28,
} as const;

type DnsType = (typeof DNS_TYPE)[keyof typeof DNS_TYPE];

type DnsJsonAnswer = {
  type?: number;
  data?: string;
};

type DnsJsonResponse = {
  Status?: number;
  Answer?: DnsJsonAnswer[];
};

type DnsClient = {
  resolveMx(hostname: string): Promise<Array<{ exchange: string; priority: number }>>;
  resolveTxt(hostname: string): Promise<string[][]>;
  resolve4(hostname: string): Promise<string[]>;
  resolve6(hostname: string): Promise<string[]>;
  resolveCname(hostname: string): Promise<string[]>;
  resolveNs(hostname: string): Promise<string[]>;
};

export class DomainLookupError extends Error {
  constructor() {
    super("We could not read the domain records.");
    this.name = "DomainLookupError";
  }
}

export async function inspectDomain(
  domain: string,
  client: DnsClient = publicResolver(),
  now = () => new Date().toISOString(),
): Promise<DomainHealthSnapshot> {
  const records = await lookupDomainRecords(domain, client);
  return evaluateDomainHealth(records, now());
}

export async function lookupDomainRecords(domain: string, client: DnsClient): Promise<DomainDnsRecords> {
  const [mx, txt, dmarc, dkimSelectors, apexAddresses, wwwAddresses, apexCname, wwwCname] = await Promise.all([
    client.resolveMx(domain),
    joinedTxt(client, domain),
    joinedTxt(client, `_dmarc.${domain}`),
    dkim(client, domain),
    addresses(client, domain),
    addresses(client, `www.${domain}`),
    cname(client, domain),
    cname(client, `www.${domain}`),
  ]);

  return {
    domain,
    mx,
    txt,
    dmarc,
    dkimSelectors,
    apexAddresses,
    wwwAddresses,
    apexCname,
    wwwCname,
  };
}

export function createDnsJsonClient(fetchImpl: typeof fetch = fetch): DnsClient {
  return {
    async resolveMx(hostname) {
      const rows = await queryDns(fetchImpl, hostname, DNS_TYPE.MX);
      return rows.flatMap((data) => {
        const record = decodeMxRdata(data);
        return record ? [record] : [];
      });
    },
    async resolveTxt(hostname) {
      const rows = await queryDns(fetchImpl, hostname, DNS_TYPE.TXT);
      return rows.map((data) => [decodeTxtRdata(data)]);
    },
    async resolve4(hostname) {
      return queryDns(fetchImpl, hostname, DNS_TYPE.A);
    },
    async resolve6(hostname) {
      return queryDns(fetchImpl, hostname, DNS_TYPE.AAAA);
    },
    async resolveCname(hostname) {
      const rows = await queryDns(fetchImpl, hostname, DNS_TYPE.CNAME);
      return rows.map((data) => data.replace(/\.$/, ""));
    },
    async resolveNs(hostname) {
      const rows = await queryDns(fetchImpl, hostname, DNS_TYPE.NS);
      return rows.map((data) => data.replace(/\.$/, "").toLowerCase()).filter(Boolean);
    },
  };
}

/** Name servers and the public alias for a domain. A failed lookup returns empty clues. */
export async function lookupPublicEdgeHints(hostname: string): Promise<{ nameservers: string[]; cname: string | null }> {
  try {
    const client = publicResolver();
    const domain = hostname.trim().toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
    const [nameservers, apexCname, wwwCname] = await Promise.all([
      client.resolveNs(domain),
      cname(client, domain).catch(() => null),
      cname(client, `www.${domain}`).catch(() => null),
    ]);
    return { nameservers, cname: wwwCname || apexCname };
  } catch {
    return { nameservers: [], cname: null };
  }
}

export function decodeTxtRdata(data: string) {
  const parts: string[] = [];
  const pattern = /"((?:\\.|[^"\\])*)"/g;
  for (let match = pattern.exec(data); match; match = pattern.exec(data)) {
    parts.push(match[1].replace(/\\(.)/g, "$1"));
  }
  return parts.length > 0 ? parts.join("") : data;
}

export function decodeMxRdata(data: string) {
  const match = /^(\d+)\s+(\S+)$/.exec(data.trim());
  if (!match) return null;
  const exchange = match[2].replace(/\.$/, "");
  if (!exchange || exchange === ".") return null;
  return { priority: Number(match[1]), exchange };
}

function publicResolver(): DnsClient {
  // Hosting blocks direct UDP queries to public resolvers, and those failures were stored as missing records.
  return createDnsJsonClient();
}

async function joinedTxt(client: DnsClient, hostname: string) {
  const rows = await client.resolveTxt(hostname);
  return rows.map((parts) => parts.join(""));
}

async function dkim(client: DnsClient, domain: string) {
  const found = await Promise.all(
    DKIM_SELECTORS.map(async (selector) => {
      const rows = await client.resolveTxt(`${selector}._domainkey.${domain}`);
      const record = rows.map((parts) => parts.join("")).find((value) => /v=DKIM1|p=/i.test(value));
      return record ? selector : "";
    }),
  );
  return found.filter(Boolean);
}

async function addresses(client: DnsClient, hostname: string) {
  const [v4, v6] = await Promise.all([client.resolve4(hostname), client.resolve6(hostname)]);
  return [...v4, ...v6];
}

async function cname(client: DnsClient, hostname: string) {
  const names = await client.resolveCname(hostname);
  return names[0] ?? null;
}

async function queryDns(fetchImpl: typeof fetch, name: string, type: DnsType) {
  let failure: unknown;
  for (const endpoint of DNS_PROVIDERS) {
    try {
      const url = new URL(endpoint);
      url.searchParams.set("name", name);
      url.searchParams.set("type", String(type));
      const response = await requestDns(fetchImpl, url);
      if (!response.ok) throw new Error(`DNS lookup failed (${response.status})`);
      const body = (await response.json()) as DnsJsonResponse;
      if (body.Status !== 0 && body.Status !== 3) throw new Error(`DNS lookup failed (${body.Status ?? "unknown"})`);
      return (body.Answer ?? [])
        .filter((record): record is { type: number; data: string } => typeof record.type === "number" && typeof record.data === "string")
        .filter((record) => record.type === type)
        .map((record) => record.data);
    } catch (error) {
      failure = error;
    }
  }
  if (failure instanceof DomainLookupError) throw failure;
  throw new DomainLookupError();
}

async function requestDns(fetchImpl: typeof fetch, url: URL) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), QUERY_TIMEOUT_MS);
  const headers = { accept: "application/dns-json" };
  try {
    return await fetchImpl(url, { headers, signal: controller.signal, cache: "no-store" });
  } catch (error) {
    if (error instanceof TypeError && /cache/i.test(error.message)) {
      return await fetchImpl(url, { headers, signal: controller.signal });
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
