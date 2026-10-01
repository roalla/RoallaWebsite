import { buildSnapshotNarrative } from "@/lib/digital-presence/narrative";
import type { SocialPresenceSnapshot } from "@/lib/social-presence/analyzer";
import type { WebsiteVisibilitySnapshot } from "@/lib/website-visibility/pagespeed";

function technical(
  strategy: "mobile" | "desktop",
  scores: WebsiteVisibilitySnapshot["scores"],
  opportunities: WebsiteVisibilitySnapshot["opportunities"] = [],
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
    opportunities,
    warnings: [],
  };
}

describe("buildSnapshotNarrative", () => {
  it("opens the offer with the weakest triggering result", () => {
    const narrative = buildSnapshotNarrative([
      technical("mobile", { performance: 80, accessibility: 58, bestPractices: 95, seo: 92 }),
      technical("desktop", { performance: 84, accessibility: 72, bestPractices: 96, seo: 94 }),
    ]);

    expect(narrative.offer).toEqual({ kind: "accessibility", score: 65 });
  });

  it("prefers a search or sharing gap over a conversion gap", () => {
    const social = { score: 42, checks: [] } as unknown as SocialPresenceSnapshot;
    const narrative = buildSnapshotNarrative([
      technical("mobile", { performance: 40, accessibility: 50, bestPractices: 90, seo: 88 }),
    ], social);

    expect(narrative.offer).toEqual({ kind: "social", score: 42 });
  });

  it("calls out a phone result that is clearly lower", () => {
    const narrative = buildSnapshotNarrative([
      technical("mobile", { performance: 48, accessibility: 58, bestPractices: 90, seo: 91 }),
      technical("desktop", { performance: 90, accessibility: 96, bestPractices: 95, seo: 96 }),
    ]);

    expect(narrative.phoneGap).toEqual({ mobile: 72, desktop: 94 });
  });

  it("keeps a small phone difference out of the summary", () => {
    const narrative = buildSnapshotNarrative([
      technical("mobile", { performance: 80, accessibility: 90, bestPractices: 90, seo: 90 }),
      technical("desktop", { performance: 88, accessibility: 94, bestPractices: 92, seo: 91 }),
    ]);

    expect(narrative.phoneGap).toBeNull();
    expect(narrative.offer.kind).toBe("strong");
  });

  it("surfaces the largest measured slowdown, preferring the phone when savings match", () => {
    const narrative = buildSnapshotNarrative([
      technical("desktop", { performance: 80, accessibility: 90, bestPractices: 90, seo: 90 }, [
        { id: "desktop-image", title: "Desktop image", displayValue: "Est savings of 1 s", savingsMs: 1000 },
      ]),
      technical("mobile", { performance: 70, accessibility: 90, bestPractices: 90, seo: 90 }, [
        { id: "mobile-image", title: "Properly size images", displayValue: "Est savings of 1 s", savingsMs: 1000 },
      ]),
    ]);

    expect(narrative.finding).toEqual({
      kind: "opportunity",
      strategy: "mobile",
      title: "Properly size images",
      detail: "Est savings of 1 s",
    });
  });

  it("uses the weakest sharing check when no speed finding exists", () => {
    const social = {
      score: 40,
      checks: [
        { id: "openGraph", status: "partial", points: 10, maxPoints: 25, evidence: [] },
        { id: "socialCards", status: "fail", points: 0, maxPoints: 15, evidence: [] },
      ],
    } as unknown as SocialPresenceSnapshot;

    expect(buildSnapshotNarrative([], social).finding).toEqual({ kind: "social", key: "socialCards" });
  });
});
