import { detectMixedContent, type MixedContentSignal } from "@/lib/page-security/mixed-content";
import {
  analyzeRedirectPath,
  redirectPathStatus,
  type RedirectHop,
  type RedirectPathAnalysis,
} from "@/lib/page-security/redirect-path";

export const PAGE_SECURITY_CHECK_IDS = [
  "https",
  "redirect",
  "redirectPath",
  "hsts",
  "framing",
  "mixedContent",
  "contentType",
  "referrerPolicy",
] as const;

export type PageSecurityCheckId = (typeof PAGE_SECURITY_CHECK_IDS)[number];
export type PageSecurityStatus = "pass" | "review" | "gap";

export type PageSecuritySignals = {
  https: boolean;
  certificateExpiresOn: string | null;
  certificateDaysRemaining: number | null;
  redirect: "https" | "http" | "unknown";
  strictTransportSecurity: string | null;
  xFrameOptions: string | null;
  contentSecurityPolicy: string | null;
  xContentTypeOptions?: string | null;
  referrerPolicy?: string | null;
  /** Landing-page HTML used only to detect mixed content; never stored in results. */
  html?: string;
  mixedContent?: MixedContentSignal;
  redirectHops?: RedirectHop[];
  redirectLoop?: boolean;
};

export type PageSecurityCheck = {
  id: PageSecurityCheckId;
  status: PageSecurityStatus;
  evidence: string | null;
};

export type PageSecurity = {
  checks: PageSecurityCheck[];
  redirectPath?: RedirectPathAnalysis;
};

const EXPIRING_WITHIN_DAYS = 30;

export function analyzePageSecurity(signals: PageSecuritySignals): PageSecurity {
  const redirectPath = analyzeRedirectPath(signals.redirectHops ?? [], {
    loop: signals.redirectLoop,
  });

  return {
    checks: [
      httpsCheck(signals),
      redirectCheck(signals),
      redirectPathCheck(redirectPath),
      hstsCheck(signals),
      framingCheck(signals),
      mixedContentCheck(signals),
      contentTypeCheck(signals),
      referrerPolicyCheck(signals),
    ],
    redirectPath,
  };
}

function httpsCheck(signals: PageSecuritySignals): PageSecurityCheck {
  const evidence = signals.certificateExpiresOn;
  if (!signals.https) return { id: "https", status: "gap", evidence };
  const days = signals.certificateDaysRemaining;
  if (days != null && days < 0) return { id: "https", status: "gap", evidence };
  if (days != null && days <= EXPIRING_WITHIN_DAYS) return { id: "https", status: "review", evidence };
  return { id: "https", status: "pass", evidence };
}

function redirectCheck(signals: PageSecuritySignals): PageSecurityCheck {
  const status = signals.redirect === "https" ? "pass" : signals.redirect === "http" ? "gap" : "review";
  return { id: "redirect", status, evidence: null };
}

function redirectPathCheck(analysis: RedirectPathAnalysis): PageSecurityCheck {
  const evidence =
    analysis.hops.length > 0
      ? analysis.hops.map((hop) => `${hop.status}`).join(" → ")
      : null;
  return { id: "redirectPath", status: redirectPathStatus(analysis), evidence };
}

function hstsCheck(signals: PageSecuritySignals): PageSecurityCheck {
  const maxAge = /(?:^|;)\s*max-age\s*=\s*(\d+)/i.exec(signals.strictTransportSecurity ?? "");
  const seconds = maxAge ? Number(maxAge[1]) : 0;
  return { id: "hsts", status: seconds > 0 ? "pass" : "review", evidence: null };
}

function framingCheck(signals: PageSecuritySignals): PageSecurityCheck {
  const ancestors = frameAncestors(signals.contentSecurityPolicy);
  if (ancestors) {
    const tokens = ancestors.split(/\s+/);
    const open = tokens.some((token) => token === "*");
    const limited = tokens.some((token) => token === "'none'" || token === "'self'" || token.startsWith("https:"));
    return { id: "framing", status: open ? "gap" : limited ? "pass" : "review", evidence: null };
  }
  const framing = (signals.xFrameOptions ?? "").split(",")[0]?.trim().toUpperCase();
  if (framing === "DENY" || framing === "SAMEORIGIN") return { id: "framing", status: "pass", evidence: null };
  if (framing === "ALLOWALL") return { id: "framing", status: "gap", evidence: null };
  return { id: "framing", status: "review", evidence: null };
}

function mixedContentCheck(signals: PageSecuritySignals): PageSecurityCheck {
  const signal =
    signals.mixedContent ??
    (signals.html != null ? detectMixedContent(signals.html, signals.https) : "unknown");
  if (signal === "found") return { id: "mixedContent", status: "gap", evidence: null };
  if (signal === "unknown") return { id: "mixedContent", status: "review", evidence: null };
  return { id: "mixedContent", status: "pass", evidence: null };
}

function contentTypeCheck(signals: PageSecuritySignals): PageSecurityCheck {
  const value = (signals.xContentTypeOptions ?? "").trim().toLowerCase();
  if (value.split(/[,\s]+/).includes("nosniff")) {
    return { id: "contentType", status: "pass", evidence: null };
  }
  return { id: "contentType", status: "review", evidence: null };
}

function referrerPolicyCheck(signals: PageSecuritySignals): PageSecurityCheck {
  const raw = (signals.referrerPolicy ?? "").trim().toLowerCase();
  if (!raw) return { id: "referrerPolicy", status: "review", evidence: null };
  const tokens = raw.split(/[,\s]+/).filter(Boolean);
  if (tokens.includes("unsafe-url")) return { id: "referrerPolicy", status: "gap", evidence: null };
  return { id: "referrerPolicy", status: "pass", evidence: null };
}

function frameAncestors(policy: string | null) {
  const match = /(?:^|;)\s*frame-ancestors\s+([^;]+)/i.exec(policy ?? "");
  return match?.[1]?.trim().toLowerCase() ?? null;
}

export { detectMixedContent, analyzeRedirectPath, redirectPathStatus, clipRedirectUrl };
export type { MixedContentSignal, RedirectHop, RedirectPathAnalysis };
