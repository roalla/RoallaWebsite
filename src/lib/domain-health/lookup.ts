import { Resolver } from "node:dns/promises";
import { evaluateDomainHealth, type DomainDnsRecords, type DomainHealthSnapshot } from "@/lib/domain-health/evaluate";

const DKIM_SELECTORS = ["google", "selector1", "selector2", "k1", "s1", "s2", "dkim", "default"] as const;
const QUERY_TIMEOUT_MS = 6_000;

type DnsClient = {
  resolveMx(hostname: string): Promise<Array<{ exchange: string; priority: number }>>;
  resolveTxt(hostname: string): Promise<string[][]>;
  resolve4(hostname: string): Promise<string[]>;
  resolve6(hostname: string): Promise<string[]>;
  resolveCname(hostname: string): Promise<string[]>;
};

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
    quiet(client.resolveMx(domain), [] as Array<{ exchange: string; priority: number }>),
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

function publicResolver(): DnsClient {
  const resolver = new Resolver();
  resolver.setServers(["1.1.1.1", "8.8.8.8"]);
  return resolver;
}

async function joinedTxt(client: DnsClient, hostname: string) {
  const rows = await quiet(client.resolveTxt(hostname), [] as string[][]);
  return rows.map((parts) => parts.join(""));
}

async function dkim(client: DnsClient, domain: string) {
  const found = await Promise.all(
    DKIM_SELECTORS.map(async (selector) => {
      const rows = await quiet(client.resolveTxt(`${selector}._domainkey.${domain}`), [] as string[][]);
      const record = rows.map((parts) => parts.join("")).find((value) => /v=DKIM1|p=/i.test(value));
      return record ? selector : "";
    }),
  );
  return found.filter(Boolean);
}

async function addresses(client: DnsClient, hostname: string) {
  const [v4, v6] = await Promise.all([
    quiet(client.resolve4(hostname), [] as string[]),
    quiet(client.resolve6(hostname), [] as string[]),
  ]);
  return [...v4, ...v6];
}

async function cname(client: DnsClient, hostname: string) {
  const names = await quiet(client.resolveCname(hostname), [] as string[]);
  return names[0] ?? null;
}

async function quiet<T>(work: Promise<T>, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      work.catch(() => fallback),
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), QUERY_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
