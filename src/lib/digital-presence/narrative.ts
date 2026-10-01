import type { SocialPresenceCheckId, SocialPresenceSnapshot } from "@/lib/social-presence/analyzer";
import type {
  PageSpeedStrategy,
  ScoreName,
  WebsiteVisibilitySnapshot,
} from "@/lib/website-visibility/pagespeed";

const SCORE_NAMES: ScoreName[] = ["performance", "accessibility", "bestPractices", "seo"];
const PHONE_GAP = 15;

export type SnapshotOffer =
  | { kind: "seo" | "social" | "performance" | "accessibility"; score: number }
  | { kind: "strong" };

export type SnapshotFinding =
  | {
      kind: "opportunity";
      strategy: PageSpeedStrategy;
      title: string;
      detail: string;
    }
  | {
      kind: "social";
      key: SocialPresenceCheckId;
    };

export type SnapshotNarrative = {
  offer: SnapshotOffer;
  phoneGap: { mobile: number; desktop: number } | null;
  finding: SnapshotFinding | null;
};

function average(values: Array<number | null | undefined>) {
  const scored = values.filter((value): value is number => value != null);
  if (!scored.length) return null;
  return Math.round(scored.reduce((sum, value) => sum + value, 0) / scored.length);
}

function pickOffer(
  seo: number | null,
  socialScore: number | null,
  performance: number | null,
  accessibility: number | null,
): SnapshotOffer {
  const visibility: SnapshotOffer[] = [];
  if (seo != null && seo < 70) visibility.push({ kind: "seo", score: seo });
  if (socialScore != null && socialScore < 70) visibility.push({ kind: "social", score: socialScore });
  if (visibility.length) {
    return visibility.sort((a, b) => ("score" in a && "score" in b ? a.score - b.score : 0))[0];
  }

  const conversion: SnapshotOffer[] = [];
  if (performance != null && performance < 60) conversion.push({ kind: "performance", score: performance });
  if (accessibility != null && accessibility < 70) conversion.push({ kind: "accessibility", score: accessibility });
  if (conversion.length) {
    return conversion.sort((a, b) => ("score" in a && "score" in b ? a.score - b.score : 0))[0];
  }

  return { kind: "strong" };
}

export function buildSnapshotNarrative(
  technical: WebsiteVisibilitySnapshot[],
  social?: SocialPresenceSnapshot,
): SnapshotNarrative {
  const mobile = technical.find((snapshot) => snapshot.strategy === "mobile");
  const desktop = technical.find((snapshot) => snapshot.strategy === "desktop");
  const mobileAverage = mobile ? average(SCORE_NAMES.map((name) => mobile.scores[name])) : null;
  const desktopAverage = desktop ? average(SCORE_NAMES.map((name) => desktop.scores[name])) : null;
  const phoneGap = mobileAverage != null && desktopAverage != null && desktopAverage - mobileAverage >= PHONE_GAP
    ? { mobile: mobileAverage, desktop: desktopAverage }
    : null;

  const opportunities = technical
    .flatMap((snapshot) => snapshot.opportunities.map((opportunity) => ({
      strategy: snapshot.strategy,
      title: opportunity.title,
      detail: opportunity.displayValue?.trim() ?? "",
      savingsMs: opportunity.savingsMs ?? 0,
    })))
    .sort((a, b) => {
      if (b.savingsMs !== a.savingsMs) return b.savingsMs - a.savingsMs;
      if (a.strategy === b.strategy) return 0;
      return a.strategy === "mobile" ? -1 : 1;
    });

  const failedSocial = [...(social?.checks ?? [])]
    .filter((check) => check.status !== "pass" && check.maxPoints > 0)
    .sort((a, b) => a.points / a.maxPoints - b.points / b.maxPoints);

  const finding: SnapshotFinding | null = opportunities[0]
    ? {
        kind: "opportunity",
        strategy: opportunities[0].strategy,
        title: opportunities[0].title,
        detail: opportunities[0].detail,
      }
    : failedSocial[0]
      ? { kind: "social", key: failedSocial[0].id }
      : null;

  return {
    offer: pickOffer(
      average(technical.map((snapshot) => snapshot.scores.seo)),
      social?.score ?? null,
      average(technical.map((snapshot) => snapshot.scores.performance)),
      average(technical.map((snapshot) => snapshot.scores.accessibility)),
    ),
    phoneGap,
    finding,
  };
}
