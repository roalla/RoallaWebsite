export type RedirectHop = {
  status: number;
  /** Clipped public URL for display; never includes credentials. */
  url: string;
};

export type RedirectPathAnalysis = {
  hops: RedirectHop[];
  loop: boolean;
  longChain: boolean;
  temporaryRedirect: boolean;
  endsOnHttp: boolean;
};

const LONG_CHAIN_REDIRECTS = 2;
const TEMPORARY = new Set([302, 303, 307]);
const CLIP = 96;

/** Clip a URL for display without query credentials (already stripped upstream). */
export function clipRedirectUrl(value: string, max = CLIP) {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, Math.max(0, max - 1))}…`;
}

/**
 * Summarize an HTTPS redirect path for the snapshot.
 * `hops` should include each redirect response and the final landing response.
 */
export function analyzeRedirectPath(
  hops: RedirectHop[],
  options?: { loop?: boolean; endsOnHttp?: boolean },
): RedirectPathAnalysis {
  const loop = Boolean(options?.loop);
  const redirectHops = hops.filter((hop) => hop.status >= 300 && hop.status < 400);
  const finalHop = hops[hops.length - 1];
  const endsOnHttp = Boolean(
    options?.endsOnHttp || (finalHop && /^http:\/\//i.test(finalHop.url)),
  );
  const temporaryRedirect = redirectHops.some((hop) => TEMPORARY.has(hop.status));
  const longChain = redirectHops.length > LONG_CHAIN_REDIRECTS;

  return {
    hops: hops.map((hop) => ({ status: hop.status, url: clipRedirectUrl(hop.url) })),
    loop,
    longChain,
    temporaryRedirect,
    endsOnHttp,
  };
}

/**
 * A single same-host temporary hop (common for locale prefixes, e.g. `/` → `/en`) is fine.
 * Review only for long chains or temporary hops that change host / stack up.
 */
export function redirectPathStatus(analysis: RedirectPathAnalysis): "pass" | "review" | "gap" {
  if (analysis.loop || analysis.endsOnHttp) return "gap";
  if (analysis.longChain) return "review";
  if (hasRiskyTemporaryRedirects(analysis.hops)) return "review";
  return "pass";
}

function hasRiskyTemporaryRedirects(hops: RedirectHop[]) {
  const temporary = hops.filter((hop) => TEMPORARY.has(hop.status));
  if (temporary.length === 0) return false;
  if (temporary.length > 1) return true;

  const hosts = hops
    .map((hop) => {
      try {
        return new URL(hop.url).hostname.replace(/^www\./i, "").toLowerCase();
      } catch {
        return null;
      }
    })
    .filter((host): host is string => Boolean(host));

  if (hosts.length < 2) return false;
  return new Set(hosts).size > 1;
}
