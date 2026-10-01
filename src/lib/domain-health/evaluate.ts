export const DOMAIN_CHECK_IDS = ["mx", "spf", "dkim", "dmarc", "names"] as const;

export type DomainCheckId = (typeof DOMAIN_CHECK_IDS)[number];
export type DomainCheckStatus = "pass" | "review" | "gap";

export type DomainHealthCheck = {
  id: DomainCheckId;
  status: DomainCheckStatus;
  evidence: string[];
};

export type DomainHealthSnapshot = {
  domain: string;
  checkedAt: string;
  checks: DomainHealthCheck[];
};

export type DomainDnsRecords = {
  domain: string;
  mx: Array<{ exchange: string; priority: number }>;
  txt: string[];
  dmarc: string[];
  dkimSelectors: string[];
  apexAddresses: string[];
  wwwAddresses: string[];
  apexCname?: string | null;
  wwwCname?: string | null;
};

const EVIDENCE_LIMIT = 160;

export function mailDomain(hostname: string) {
  const host = hostname.trim().toLowerCase().replace(/\.$/, "");
  return host.startsWith("www.") ? host.slice(4) : host;
}

export function evaluateDomainHealth(
  records: DomainDnsRecords,
  checkedAt = new Date().toISOString(),
): DomainHealthSnapshot {
  return {
    domain: records.domain,
    checkedAt,
    checks: [
      evaluateMx(records),
      evaluateSpf(records),
      evaluateDkim(records),
      evaluateDmarc(records),
      evaluateNames(records),
    ],
  };
}

function evaluateMx(records: DomainDnsRecords): DomainHealthCheck {
  const destinations = records.mx
    .map((record) => record.exchange.replace(/\.$/, "").toLowerCase())
    .filter((exchange) => exchange && exchange !== ".");
  if (!destinations.length) {
    return { id: "mx", status: "gap", evidence: [] };
  }
  return { id: "mx", status: "pass", evidence: unique(destinations).slice(0, 3).map(clip) };
}

function evaluateSpf(records: DomainDnsRecords): DomainHealthCheck {
  const policies = records.txt.filter((record) => /^v=spf1(\s|$)/i.test(record.trim()));
  if (!policies.length) return { id: "spf", status: "gap", evidence: [] };
  if (policies.length > 1) {
    return { id: "spf", status: "review", evidence: policies.slice(0, 2).map(clip) };
  }
  const policy = policies[0]?.trim() ?? "";
  const qualifier = policy.match(/(?:^|\s)([+\-~?])all\b/i)?.[1] ?? (/\sall\b/i.test(policy) ? "+" : "");
  const status: DomainCheckStatus = qualifier === "-" || qualifier === "~" ? "pass" : "review";
  if (qualifier === "+") return { id: "spf", status: "gap", evidence: [clip(policy)] };
  return { id: "spf", status, evidence: [clip(policy)] };
}

function evaluateDkim(records: DomainDnsRecords): DomainHealthCheck {
  const selectors = unique(records.dkimSelectors.map((selector) => selector.toLowerCase()));
  if (!selectors.length) return { id: "dkim", status: "gap", evidence: [] };
  return { id: "dkim", status: "pass", evidence: selectors.slice(0, 4) };
}

function evaluateDmarc(records: DomainDnsRecords): DomainHealthCheck {
  const policy = records.dmarc.find((record) => /^v=DMARC1(\s|;|$)/i.test(record.trim()));
  if (!policy) return { id: "dmarc", status: "gap", evidence: [] };
  const disposition = policy.match(/(?:^|;)\s*p\s*=\s*(none|quarantine|reject)\b/i)?.[1]?.toLowerCase();
  if (disposition === "quarantine" || disposition === "reject") {
    return { id: "dmarc", status: "pass", evidence: [clip(policy)] };
  }
  return { id: "dmarc", status: "review", evidence: [clip(policy)] };
}

function evaluateNames(records: DomainDnsRecords): DomainHealthCheck {
  const apex = records.apexAddresses.map(normalizeAddress);
  const www = records.wwwAddresses.map(normalizeAddress);
  const apexName = normalizeHost(records.apexCname);
  const wwwName = normalizeHost(records.wwwCname);
  const apexReady = apex.length > 0 || Boolean(apexName);
  const wwwReady = www.length > 0 || Boolean(wwwName);
  const linked =
    (wwwName && wwwName === records.domain) ||
    (apexName && apexName === `www.${records.domain}`) ||
    apex.some((address) => www.includes(address));

  if (apexReady && wwwReady && linked) {
    return { id: "names", status: "pass", evidence: [records.domain, `www.${records.domain}`] };
  }
  if (!apexReady || !wwwReady) {
    return {
      id: "names",
      status: "gap",
      evidence: [!apexReady ? records.domain : `www.${records.domain}`],
    };
  }
  return { id: "names", status: "review", evidence: [records.domain, `www.${records.domain}`] };
}

function normalizeHost(value?: string | null) {
  const host = value?.trim().toLowerCase().replace(/\.$/, "");
  return host || null;
}

function normalizeAddress(value: string) {
  return value.trim().toLowerCase();
}

function unique(values: string[]) {
  return values.filter((value, index) => values.indexOf(value) === index);
}

function clip(value: string) {
  const clean = value.replace(/[\u0000-\u001f]+/g, " ").replace(/\s+/g, " ").trim();
  return clean.length > EVIDENCE_LIMIT ? `${clean.slice(0, EVIDENCE_LIMIT - 1)}…` : clean;
}
