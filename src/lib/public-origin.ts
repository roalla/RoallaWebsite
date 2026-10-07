import { SITE_URL } from "@/lib/site";

const UNROUTABLE_HOSTS = new Set(["0.0.0.0", "::"]);

type OriginInput = {
  forwardedHost?: string | null;
  forwardedProto?: string | null;
  host?: string | null;
  origin?: string | null;
};

function hostnameOf(host: string) {
  if (host.startsWith("[")) {
    const end = host.indexOf("]");
    return end > 1 ? host.slice(1, end).toLowerCase() : "";
  }
  return (host.split(":")[0] ?? "").toLowerCase();
}

function routableHost(value: string | null | undefined) {
  const host = value?.split(",")[0]?.trim() ?? "";
  const hostname = host ? hostnameOf(host) : "";
  if (!host || UNROUTABLE_HOSTS.has(hostname)) return "";
  return host;
}

/** A browser-reachable origin. Container bind addresses such as 0.0.0.0 are not. */
export function publicSiteOrigin(input: OriginInput) {
  const host = routableHost(input.forwardedHost) || routableHost(input.host);
  if (host) {
    const forwardedProto = input.forwardedProto?.split(",")[0]?.trim();
    let scheme = forwardedProto === "http" || forwardedProto === "https" ? forwardedProto : "";
    if (!scheme && input.origin) {
      try {
        const url = new URL(input.origin);
        if (url.hostname.toLowerCase() === hostnameOf(host)) scheme = url.protocol.replace(":", "");
      } catch {
        scheme = "";
      }
    }
    return `${scheme || "https"}://${host}`;
  }

  if (input.origin) {
    try {
      const url = new URL(input.origin);
      if (!UNROUTABLE_HOSTS.has(url.hostname.toLowerCase())) return url.origin;
    } catch {
      // Fall through to the public site.
    }
  }

  return SITE_URL;
}
