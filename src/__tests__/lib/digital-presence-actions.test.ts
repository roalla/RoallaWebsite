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

  it("uses the weaker phone or computer agentic score from the Lighthouse page", () => {
    const social = {
      checks: [],
      agentic: { score: 88, signals: [] },
    } as unknown as SocialPresenceSnapshot;
    const mobile = technical("mobile", { performance: 95, accessibility: 95, bestPractices: 95, seo: 95 });
    const desktop = technical("desktop", { performance: 95, accessibility: 95, bestPractices: 95, seo: 95 });
    mobile.agentic = { score: 32, signals: [] };
    desktop.agentic = { score: 74, signals: [] };

    expect(buildDigitalPresenceActions([mobile, desktop], social)).toEqual([
      expect.objectContaining({ source: "agentic", score: 32, priority: "fixNow" }),
    ]);
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
