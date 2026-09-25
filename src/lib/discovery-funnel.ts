import type { ConsultationIntent } from "@/lib/consultation-request";

/** Public Digital Enablement intake on app.roalla.com (commercial brief). */
export const DIGITAL_ENABLEMENT_BASE_URL =
  "https://app.roalla.com/digital-enablement";

/**
 * Website access questionnaire — never send cold marketing traffic here.
 * Kept for docs / engaged-handoff reference only.
 */
export const DIGITAL_DISCOVERY_BASE_URL =
  "https://app.roalla.com/digitaldiscovery";

/** Enablement `goal` query values (RCOS Phase B prefills). */
export type EnablementGoalParam =
  | "website"
  | "app"
  | "visibility"
  | "automation"
  | "ai"
  | "unsure";

const DIGITAL_FUNNEL_INTENTS: ConsultationIntent[] = [
  "website",
  "platform",
  "automation",
  "ai-support",
  "digital-events",
  "visibility",
  "unsure",
];

/** Intents that get the slim marketing form + enablement discovery link. */
export function shouldUseDigitalDiscoveryFunnel(
  intent: ConsultationIntent | "" | null | undefined,
): boolean {
  return !!intent && DIGITAL_FUNNEL_INTENTS.includes(intent);
}

/** Map marketing consultation intent → enablement goal query param. */
export function enablementGoalFromIntent(
  intent: ConsultationIntent,
): EnablementGoalParam {
  switch (intent) {
    case "website":
      return "website";
    case "platform":
      return "app";
    case "visibility":
      return "visibility";
    case "automation":
      return "automation";
    case "ai-support":
      return "ai";
    case "digital-events":
      // Events is a secondary enablement path; start on "not sure" / clarify.
      return "unsure";
    case "unsure":
    default:
      return "unsure";
  }
}

export type DiscoveryPrefill = {
  name?: string;
  email?: string;
  company?: string;
  /** Marketing consultation reference, e.g. CR-… */
  sourceRef?: string;
  locale?: string;
};

/**
 * Build the Digital Enablement URL with useful prefills.
 * Never returns `/digitaldiscovery` — that is for engaged website access handoff only.
 */
export function buildDigitalEnablementUrl(
  intent: ConsultationIntent,
  prefill: DiscoveryPrefill = {},
): string {
  const url = new URL(DIGITAL_ENABLEMENT_BASE_URL);
  url.searchParams.set("goal", enablementGoalFromIntent(intent));
  url.searchParams.set("source", "roalla.com");
  if (prefill.name?.trim()) url.searchParams.set("name", prefill.name.trim());
  if (prefill.email?.trim())
    url.searchParams.set("email", prefill.email.trim());
  if (prefill.company?.trim())
    url.searchParams.set("company", prefill.company.trim());
  if (prefill.sourceRef?.trim())
    url.searchParams.set("cr", prefill.sourceRef.trim());
  if (prefill.locale?.trim())
    url.searchParams.set("locale", prefill.locale.trim());
  return url.toString();
}

/** Resolve discovery URL for a consultation intent, or null when not applicable. */
export function resolveDiscoveryUrl(
  intent: ConsultationIntent,
  prefill: DiscoveryPrefill = {},
): string | null {
  if (!shouldUseDigitalDiscoveryFunnel(intent)) return null;
  return buildDigitalEnablementUrl(intent, prefill);
}
