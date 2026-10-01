import { lookup } from "node:dns/promises";
import type { IncomingHttpHeaders } from "node:http";
import { request } from "node:https";
import { isIP, type LookupFunction } from "node:net";
import { normalizePublicTarget } from "@/lib/website-visibility/public-target";

const MAX_HTML_BYTES = 750_000;
const MAX_REDIRECTS = 3;
const DEFAULT_USER_AGENT = "ROALLA-Social-Presence-Snapshot/1.0 (+https://www.roalla.com)";

export class WebsiteFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WebsiteFetchError";
  }
}

function isPublicIpv4(address: string) {
  const octets = address.split(".").map(Number);
  if (octets.length !== 4 || octets.some((value) => !Number.isInteger(value))) return false;
  const [a, b, c] = octets;
  return !(
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0 && c === 0) ||
    (a === 192 && b === 0 && c === 2) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113) ||
    a >= 224
  );
}

export function isPublicIpAddress(address: string) {
  const version = isIP(address);
  if (version === 4) return isPublicIpv4(address);
  if (version !== 6) return false;

  const lower = address.toLowerCase();
  const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPublicIpv4(mapped[1]);
  return !(
    lower === "::" ||
    lower === "::1" ||
    lower.startsWith("fc") ||
    lower.startsWith("fd") ||
    /^fe[89ab]/.test(lower) ||
    lower.startsWith("ff") ||
    lower.startsWith("2001:db8:")
  );
}

async function resolvePublicAddress(hostname: string) {
  let addresses: Array<{ address: string; family: number }>;
  try {
    addresses = await lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new WebsiteFetchError("The website domain could not be resolved.");
  }
  if (!addresses.length || addresses.some(({ address }) => !isPublicIpAddress(address))) {
    throw new WebsiteFetchError("The website must resolve only to public internet addresses.");
  }
  // Prefer IPv4 when both families are available; many production hosts publish
  // IPv6 even when the application runtime has no outbound IPv6 route.
  return addresses.find(({ family }) => family === 4) ?? addresses[0];
}

const PUBLIC_HEADER_NAMES = [
  "server",
  "x-powered-by",
  "via",
  "cf-ray",
  "cf-cache-status",
  "x-vercel-id",
  "x-vercel-cache",
  "x-nf-request-id",
  "x-shopid",
  "x-amz-cf-id",
  "x-fastly-request-id",
  "x-served-by",
  "x-akamai-transformed",
  "x-sucuri-id",
  "x-github-request-id",
] as const;

export type PublicPageHeaderName = (typeof PUBLIC_HEADER_NAMES)[number];
export type PublicPageHeaders = Partial<Record<PublicPageHeaderName, string>>;

function publicHeaders(headers: IncomingHttpHeaders): PublicPageHeaders {
  const result: PublicPageHeaders = {};
  for (const name of PUBLIC_HEADER_NAMES) {
    const raw = headers[name];
    const value = Array.isArray(raw) ? raw.join(", ") : raw;
    if (typeof value === "string" && value.trim()) result[name] = value.trim().slice(0, 180);
  }
  return result;
}

function download(target: URL, address: string, family: number, userAgent = DEFAULT_USER_AGENT) {
  return new Promise<{
    status: number;
    location?: string;
    contentType?: string;
    contentEncoding?: string;
    headers: PublicPageHeaders;
    html: string;
  }>((resolve, reject) => {
    const pinnedLookup = ((_hostname, options, callback) => {
      if (typeof options === "object" && options.all) {
        callback(null, [{ address, family }]);
        return;
      }
      callback(null, address, family);
    }) as LookupFunction;
    const req = request(
      {
        protocol: "https:",
        hostname: target.hostname,
        port: 443,
        path: `${target.pathname}${target.search}`,
        method: "GET",
        servername: target.hostname,
        lookup: pinnedLookup,
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "Accept-Encoding": "identity",
          "User-Agent": userAgent,
        },
      },
      (response) => {
        const chunks: Buffer[] = [];
        let size = 0;
        response.on("data", (chunk: Buffer) => {
          size += chunk.length;
          if (size > MAX_HTML_BYTES) {
            req.destroy(new WebsiteFetchError("The website page is too large to analyze."));
            return;
          }
          chunks.push(chunk);
        });
        response.on("end", () => {
          resolve({
            status: response.statusCode ?? 500,
            location: response.headers.location,
            contentType: response.headers["content-type"],
            contentEncoding: response.headers["content-encoding"],
            headers: publicHeaders(response.headers),
            html: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );
    req.setTimeout(12_000, () => {
      req.destroy(new WebsiteFetchError("The website did not respond in time."));
    });
    req.on("error", (error) => {
      reject(
        error instanceof WebsiteFetchError
          ? error
          : new WebsiteFetchError("The website page could not be downloaded."),
      );
    });
    req.end();
  });
}

/** Download public HTML with DNS pinning so redirects and DNS cannot reach private networks. */
export async function fetchPublicHtml(
  target: URL,
  redirects = 0,
  userAgent = DEFAULT_USER_AGENT,
): Promise<{ html: string; finalUrl: URL; headers: PublicPageHeaders }> {
  const resolved = await resolvePublicAddress(target.hostname);
  const result = await download(target, resolved.address, resolved.family, userAgent);

  if ([301, 302, 303, 307, 308].includes(result.status) && result.location) {
    if (redirects >= MAX_REDIRECTS) {
      throw new WebsiteFetchError("The website redirected too many times.");
    }
    const redirected = normalizePublicTarget(new URL(result.location, target).toString());
    return fetchPublicHtml(redirected, redirects + 1, userAgent);
  }
  if (result.status < 200 || result.status >= 300) {
    throw new WebsiteFetchError(`The website returned HTTP ${result.status}.`);
  }
  if (result.contentEncoding && result.contentEncoding !== "identity") {
    throw new WebsiteFetchError("The website returned an unsupported compressed response.");
  }
  if (result.contentType && !/text\/html|application\/xhtml\+xml/i.test(result.contentType)) {
    throw new WebsiteFetchError("The submitted URL did not return an HTML page.");
  }
  return { html: result.html, finalUrl: target, headers: result.headers };
}

/** Best-effort text file such as robots.txt or llms.txt. Missing or failed fetches do not fail the snapshot. */
export async function fetchOptionalPublicText(
  target: URL,
  redirects = 0,
  userAgent = DEFAULT_USER_AGENT,
): Promise<string | null> {
  try {
    const resolved = await resolvePublicAddress(target.hostname);
    const result = await download(target, resolved.address, resolved.family, userAgent);
    if ([301, 302, 303, 307, 308].includes(result.status) && result.location) {
      if (redirects >= MAX_REDIRECTS) return null;
      const redirected = normalizePublicTarget(new URL(result.location, target).toString());
      return fetchOptionalPublicText(redirected, redirects + 1, userAgent);
    }
    if (result.status < 200 || result.status >= 300) return null;
    if (result.contentEncoding && result.contentEncoding !== "identity") return null;
    const body = result.html.trim();
    if (!body || /<html[\s>]/i.test(body)) return null;
    return body;
  } catch {
    return null;
  }
}
