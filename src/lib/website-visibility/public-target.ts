import { isIP } from "node:net";

export { isSamePublicPage } from "@/lib/website-visibility/page-url";

const BLOCKED_HOST_SUFFIXES = [
  ".localhost",
  ".local",
  ".internal",
  ".test",
  ".invalid",
  ".example",
  ".onion",
] as const;

export class PublicTargetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicTargetError";
  }
}

/** Normalize a public page URL without retaining query parameters or credentials. */
export function normalizePublicTarget(input: unknown): URL {
  if (typeof input !== "string" || !input.trim()) {
    throw new PublicTargetError("Enter a website URL to continue.");
  }

  const trimmed = input.trim();
  if (trimmed.length > 2048) {
    throw new PublicTargetError("The website URL is too long.");
  }

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let target: URL;
  try {
    target = new URL(candidate);
  } catch {
    throw new PublicTargetError("Enter a valid public website URL.");
  }

  if (target.protocol !== "https:") {
    throw new PublicTargetError("Use an HTTPS website URL.");
  }
  if (target.username || target.password) {
    throw new PublicTargetError("Website URLs cannot include credentials.");
  }
  if (target.port && target.port !== "443") {
    throw new PublicTargetError("Website URLs cannot use a custom port.");
  }

  const hostname = target.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  const blockedHostname =
    hostname === "localhost" ||
    !hostname.includes(".") ||
    isIP(hostname) !== 0 ||
    BLOCKED_HOST_SUFFIXES.some(
      (suffix) => hostname === suffix.slice(1) || hostname.endsWith(suffix),
    );

  if (blockedHostname) {
    throw new PublicTargetError("Enter a public website domain.");
  }

  target.hostname = hostname;
  target.port = "";
  target.username = "";
  target.password = "";
  target.search = "";
  target.hash = "";

  return target;
}

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

/**
 * Follow public HTTP redirects to the page a visitor lands on.
 * Stops at the first hop that is not a public HTTPS page.
 */
export async function resolvePublicFinalUrl(
  target: URL,
  options?: { userAgent?: string; fetcher?: typeof fetch },
): Promise<URL> {
  const fetcher = options?.fetcher ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  const seen = new Set<string>([target.toString()]);
  let current = target;

  try {
    for (let hop = 0; hop < 8; hop += 1) {
      let response: Response;
      try {
        response = await fetcher(current, {
          method: "GET",
          redirect: "manual",
          signal: controller.signal,
          headers: {
            Accept: "text/html,application/xhtml+xml",
            ...(options?.userAgent ? { "User-Agent": options.userAgent } : {}),
          },
        });
      } catch {
        return current;
      }

      const location = response.headers.get("location");
      await response.body?.cancel().catch(() => undefined);
      if (!REDIRECT_STATUSES.has(response.status) || !location) return current;

      let next: URL;
      try {
        next = normalizePublicTarget(new URL(location, current).toString());
      } catch {
        return current;
      }
      if (seen.has(next.toString())) return current;
      seen.add(next.toString());
      current = next;
    }
    return current;
  } finally {
    clearTimeout(timer);
  }
}
