import { buildDigitalPresenceActions } from "@/lib/digital-presence/actions";
import type { SocialPresenceSnapshot } from "@/lib/social-presence/analyzer";
import type { WebsiteVisibilitySnapshot } from "@/lib/website-visibility/pagespeed";

function technical(
  strategy: "mobile" | "desktop",
  scores: WebsiteVisibilitySnapshot["scores"],
): WebsiteVisibilitySnapshot {
  return {
    provider: "Google PageSpeed Insights",
    strategy,
    requestedUrl: "https://example.com/",
    finalUrl: "https://example.com/",
    analyzedAt: "2026-09-30T12:00:00.000Z",
    scores,
    labMetrics: [],
    fieldMetrics: [],
    opportunities: [],
    warnings: [],
  };
}

describe("buildDigitalPresenceActions", () => {
  it("prioritizes severe gaps and combines mobile and desktop categories", () => {
    const social = {
      checks: [
        { id: "openGraph", status: "partial", points: 13, maxPoints: 25, evidence: [] },
        { id: "structuredProfiles", status: "fail", points: 0, maxPoints: 15, evidence: [] },
      ],
    } as unknown as SocialPresenceSnapshot;
    const actions = buildDigitalPresenceActions([
      technical("mobile", { performance: 35, accessibility: 88, bestPractices: 95, seo: 100 }),
      technical("desktop", { performance: 72, accessibility: 94, bestPractices: 96, seo: 100 }),
    ], social);

    expect(actions).toHaveLength(3);
    expect(actions[0]).toMatchObject({ source: "social", key: "structuredProfiles", priority: "fixNow", impact: "medium", effort: "low" });
    expect(actions[1]).toMatchObject({
      source: "technical",
      key: "performance",
      priority: "fixNow",
      score: 35,
      strategies: ["mobile", "desktop"],
      impact: "high",
      effort: "medium",
    });
    expect(actions[2]).toMatchObject({ source: "social", key: "openGraph", priority: "planNext" });
  });

  it("returns no automated actions when all checks are strong", () => {
    const social = {
      checks: [
        { id: "openGraph", status: "pass", points: 25, maxPoints: 25, evidence: [] },
      ],
    } as unknown as SocialPresenceSnapshot;
    expect(
      buildDigitalPresenceActions([
        technical("mobile", { performance: 90, accessibility: 100, bestPractices: 95, seo: 100 }),
      ], social),
    ).toEqual([]);
  });
});
