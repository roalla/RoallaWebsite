export const PAGE_SECURITY_CHECK_IDS = ["https", "redirect", "hsts", "framing"] as const;

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
};

export type PageSecurityCheck = {
  id: PageSecurityCheckId;
  status: PageSecurityStatus;
  evidence: string | null;
};

export type PageSecurity = {
  checks: PageSecurityCheck[];
};

const EXPIRING_WITHIN_DAYS = 30;

export function analyzePageSecurity(signals: PageSecuritySignals): PageSecurity {
  return {
    checks: [
      httpsCheck(signals),
      redirectCheck(signals),
      hstsCheck(signals),
      framingCheck(signals),
    ],
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

function frameAncestors(policy: string | null) {
  const match = /(?:^|;)\s*frame-ancestors\s+([^;]+)/i.exec(policy ?? "");
  return match?.[1]?.trim().toLowerCase() ?? null;
}
