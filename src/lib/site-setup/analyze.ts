import type { PublicPageHeaders } from "@/lib/social-presence/safe-html-fetch";

export const SITE_SETUP_IDS = [
  "cloudflare",
  "vercel",
  "netlify",
  "shopify",
  "wordpress",
  "webflow",
  "wix",
  "squarespace",
  "next",
  "github-pages",
  "amazon",
  "fastly",
  "akamai",
  "sucuri",
  "wp-engine",
  "framer",
  "ghost",
  "drupal",
  "nuxt",
  "gatsby",
  "google-analytics",
  "google-tag-manager",
  "plausible",
  "fathom",
  "matomo",
  "meta-pixel",
  "hotjar",
  "clarity",
  "hubspot",
] as const;

export type SiteSetupId = (typeof SITE_SETUP_IDS)[number];

export type SiteSetup = {
  edge: SiteSetupId[];
  edgeHidden: boolean;
  platform: SiteSetupId[];
  analytics: SiteSetupId[];
  protection: SiteSetupId[];
  protectionDnsOnly: SiteSetupId[];
};

const HOSTS: Array<{ id: SiteSetupId; test: RegExp }> = [
  { id: "vercel", test: /vercel\.app|vercel-dns|x-vercel|\bvercel\b/i },
  { id: "netlify", test: /netlify\.app|\bnetlify\b/i },
  { id: "shopify", test: /myshopify\.com|cdn\.shopify\.com|\bshopify\b/i },
  { id: "wp-engine", test: /wpengine\.com|wpenginepowered/i },
  { id: "github-pages", test: /github\.io|github pages/i },
  { id: "webflow", test: /webflow\.io|website-files\.com|\bwebflow\b/i },
  { id: "wix", test: /wixsite\.com|wixstatic\.com|\bwix\b/i },
  { id: "squarespace", test: /squarespace\.com|sqspcdn/i },
  { id: "framer", test: /framer\.app|framerusercontent/i },
];

const PLATFORMS: Array<{ id: SiteSetupId; test: RegExp }> = [
  { id: "next", test: /\/_next\/|__NEXT_DATA__|next\.js/i },
  { id: "nuxt", test: /\/_nuxt\/|\bnuxt\b/i },
  { id: "gatsby", test: /___gatsby|\bgatsby\b/i },
  { id: "wordpress", test: /wp-content\/|wp-includes\/|wordpress/i },
  { id: "shopify", test: /cdn\.shopify\.com|shopify\.theme|myshopify/i },
  { id: "webflow", test: /data-wf-|webflow\.js|website-files\.com/i },
  { id: "wix", test: /wixstatic\.com|x-wix-|wix\.com/i },
  { id: "squarespace", test: /squarespace\.com|static\.squarespace/i },
  { id: "framer", test: /data-framer|framerusercontent/i },
  { id: "ghost", test: /ghost\.org|content="ghost/i },
  { id: "drupal", test: /drupal\.settings|content="drupal/i },
  { id: "hubspot", test: /hs-scripts\.com|hubspot\.com/i },
];

const ANALYTICS: Array<{ id: SiteSetupId; test: RegExp }> = [
  { id: "google-tag-manager", test: /googletagmanager\.com\/gtm\.js|gtm\.js\?id=GTM-/i },
  { id: "google-analytics", test: /googletagmanager\.com\/gtag\/js|google-analytics\.com\/analytics\.js|gtag\(/i },
  { id: "plausible", test: /plausible\.io\/js/i },
  { id: "fathom", test: /cdn\.usefathom\.com/i },
  { id: "matomo", test: /matomo\.js|piwik\.js/i },
  { id: "meta-pixel", test: /connect\.facebook\.net\/[^"']*fbevents\.js|fbq\(/i },
  { id: "hotjar", test: /static\.hotjar\.com/i },
  { id: "clarity", test: /clarity\.ms\/tag/i },
  { id: "hubspot", test: /js\.hs-scripts\.com|js\.hs-analytics\.net/i },
];

function matches(value: string, rules: Array<{ id: SiteSetupId; test: RegExp }>) {
  const found: SiteSetupId[] = [];
  for (const rule of rules) {
    if (rule.test.test(value) && !found.includes(rule.id)) found.push(rule.id);
  }
  return found;
}

function headerText(headers: PublicPageHeaders) {
  return Object.entries(headers)
    .map(([name, value]) => `${name}: ${value ?? ""}`)
    .join("\n");
}

function cloudflareProxy(headers: PublicPageHeaders, html: string) {
  return Boolean(headers["cf-ray"] || /cloudflare/i.test(headers.server ?? "") || /\/cdn-cgi\//i.test(html));
}

export function analyzeSiteSetup(input: {
  html: string;
  headers?: PublicPageHeaders;
  nameservers?: string[];
  cname?: string | null;
}): SiteSetup {
  const headers = input.headers ?? {};
  const nameservers = (input.nameservers ?? []).join(" ");
  const cname = input.cname ?? "";
  const html = input.html;
  const combined = `${headerText(headers)}\n${cname}\n${html.slice(0, 200_000)}`;
  const proxy = cloudflareProxy(headers, html);
  const dnsCloudflare = /ns\.cloudflare\.com/i.test(nameservers);

  const protection: SiteSetupId[] = [];
  const protectionDnsOnly: SiteSetupId[] = [];
  if (proxy) protection.push("cloudflare");
  else if (dnsCloudflare) protectionDnsOnly.push("cloudflare");
  if (headers["x-fastly-request-id"] || /fastly/i.test(`${headers.via ?? ""} ${headers["x-served-by"] ?? ""}`)) protection.push("fastly");
  if (headers["x-akamai-transformed"]) protection.push("akamai");
  if (headers["x-amz-cf-id"]) protection.push("amazon");
  if (headers["x-sucuri-id"]) protection.push("sucuri");

  const hosts = matches(`${headerText(headers)}\n${cname}`, HOSTS);
  const edge = hosts.filter((id) => !protection.includes(id));
  const edgeHidden = edge.length === 0 && protection.some((id) => id === "cloudflare" || id === "fastly" || id === "akamai" || id === "sucuri");
  if (edgeHidden && protection.includes("cloudflare")) edge.push("cloudflare");
  else if (edge.length === 0 && protection.includes("amazon")) edge.push("amazon");

  const platform = matches(html.slice(0, 200_000), PLATFORMS).slice(0, 3);
  const analytics = matches(html, ANALYTICS);

  return {
    edge: edge.slice(0, 2),
    edgeHidden,
    platform,
    analytics,
    protection,
    protectionDnsOnly,
  };
}
