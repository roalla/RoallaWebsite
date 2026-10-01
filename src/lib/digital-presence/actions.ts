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
      impact: "high" | "medium";
      effort: "low" | "medium";
    }
  | {
      source: "social";
      priority: "fixNow" | "planNext";
      key: SocialPresenceSnapshot["checks"][number]["id"];
      score: number;
      severity: number;
      impact: "high" | "medium";
      effort: "low" | "medium";
    }
  | {
      source: "agentic";
      priority: "fixNow" | "planNext";
      key: "agentic";
      score: number;
      severity: number;
      impact: "high";
      effort: "medium";
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
      impact: key === "bestPractices" ? "medium" : "high",
      effort: key === "seo" ? "low" : "medium",
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
      impact:
        check.id === "pageIdentity" || check.id === "organizationSchema"
          ? "high"
          : "medium",
      effort: "low",
    });
  }

  if (social?.agentic && social.agentic.score < 90) {
    actions.push({
      source: "agentic",
      priority: social.agentic.score < 50 ? "fixNow" : "planNext",
      key: "agentic",
      score: social.agentic.score,
      severity: 100 - social.agentic.score,
      impact: "high",
      effort: "medium",
    });
  }

  return actions
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority === "fixNow" ? -1 : 1;
      return b.severity - a.severity;
    })
    .slice(0, limit);
}
