import { fetchPublicHtml } from "@/lib/social-presence/safe-html-fetch";

export type DomainRegistration = {
  domain: string;
  registrar: string | null;
  nameservers: string[];
  registeredOn: string | null;
  expiresOn: string | null;
  updatedOn: string | null;
  registrantName: string | null;
  registrantOrganization: string | null;
};

const WHOIS_LOOKUP = "https://www.whois.com/whois/";

/** Read the public Whois.com record. A failed or empty page returns null and does not include street, phone, or email. */
export async function lookupWhoisRegistration(hostname: string): Promise<DomainRegistration | null> {
  const domain = hostname.trim().toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
  if (!/^[a-z0-9.-]+$/.test(domain) || domain.includes("..") || domain.startsWith(".") || domain.endsWith(".")) {
    return null;
  }
  try {
    const page = await fetchPublicHtml(new URL(`${WHOIS_LOOKUP}${encodeURIComponent(domain)}`));
    const parsed = parseWhoisComPage(page.html);
    return parsed ? { ...parsed, domain } : null;
  } catch {
    return null;
  }
}

export function parseWhoisComPage(html: string): Omit<DomainRegistration, "domain"> | null {
  const registeredOn = field(html, "Registered On");
  const registrar = field(html, "Registrar");
  if (!registeredOn && !registrar) return null;
  const registrant = block(html, "Registrant Contact");
  const nameservers = (field(html, "Name Servers") ?? "")
    .split("\n")
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);
  return {
    registrar,
    nameservers,
    registeredOn,
    expiresOn: field(html, "Expires On"),
    updatedOn: field(html, "Updated On"),
    registrantName: field(registrant, "Name"),
    registrantOrganization: field(registrant, "Organization"),
  };
}

function block(html: string, heading: string) {
  const start = html.indexOf(heading);
  if (start < 0) return "";
  const next = html.indexOf('class="df-block"', start + heading.length);
  return html.slice(start, next < 0 ? start + 5000 : next);
}

function field(html: string, label: string) {
  const pattern = new RegExp(
    `<div class="df-label">\\s*${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:?\\s*</div>\\s*<div class="df-value">([\\s\\S]*?)</div>`,
    "i",
  );
  const match = pattern.exec(html);
  if (!match) return null;
  const value = decodeHtml(match[1]);
  return value || null;
}

function decodeHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
