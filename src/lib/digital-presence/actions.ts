import type { SocialPresenceSnapshot } from "@/lib/social-presence/analyzer";
import type {
  PageSpeedStrategy,
  ScoreName,
  WebsiteVisibilitySnapshot,
} from "@/lib/website-visibility/pagespeed";

export type DigitalPresenceAction =
  | {
      source: "technical";
      priority: "fixNow" | "planNext";
      key: ScoreName;
      score: number;
      strategies: PageSpeedStrategy[];
      severity: number;
    }
  | {
      source: "social";
      priority: "fixNow" | "planNext";
      key: SocialPresenceSnapshot["checks"][number]["id"];
      score: number;
      severity: number;
    };

export function buildDigitalPresenceActions(
  technical: WebsiteVisibilitySnapshot[],
  social?: SocialPresenceSnapshot,
  limit = 3,
): DigitalPresenceAction[] {
  const actions: DigitalPresenceAction[] = [];
  const scoreNames: ScoreName[] = [
    "performance",
    "accessibility",
    "bestPractices",
    "seo",
  ];

  for (const key of scoreNames) {
    const measured = technical.flatMap((snapshot) => {
      const score = snapshot.scores[key];
      return score == null ? [] : [{ score, strategy: snapshot.strategy }];
    });
    if (!measured.length) continue;
    const worst = Math.min(...measured.map(({ score }) => score));
    if (worst >= 90) continue;
    actions.push({
      source: "technical",
      priority: worst < 50 ? "fixNow" : "planNext",
      key,
      score: worst,
      strategies: measured
        .filter(({ score }) => score < 90)
        .map(({ strategy }) => strategy),
      severity: 100 - worst,
    });
  }

  for (const check of social?.checks ?? []) {
    if (check.status === "pass") continue;
    const score = Math.round((check.points / check.maxPoints) * 100);
    actions.push({
      source: "social",
      priority: score < 50 ? "fixNow" : "planNext",
      key: check.id,
      score,
      severity: 100 - score,
    });
  }

  return actions
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority === "fixNow" ? -1 : 1;
      return b.severity - a.severity;
    })
    .slice(0, limit);
}
