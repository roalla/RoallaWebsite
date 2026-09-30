import {
  PageSpeedProviderError,
  normalizePageSpeedResponse,
} from "@/lib/website-visibility/pagespeed";

describe("normalizePageSpeedResponse", () => {
  it("returns a compact snapshot with scores, metrics, and ordered opportunities", () => {
    const result = normalizePageSpeedResponse(
      {
        lighthouseResult: {
          finalUrl: "https://www.example.com/",
          fetchTime: "2026-09-30T12:00:00.000Z",
          lighthouseVersion: "12.0.0",
          categories: {
            performance: { score: 0.72 },
            accessibility: { score: 0.95 },
            "best-practices": { score: 0.88 },
            seo: { score: 1 },
          },
          audits: {
            "largest-contentful-paint": { displayValue: "2.8 s" },
            "unused-javascript": {
              score: 0.4,
              title: "Reduce unused JavaScript",
              displayValue: "Potential savings of 300 KiB",
              details: { type: "opportunity", overallSavingsMs: 1200 },
            },
            "render-blocking-resources": {
              score: 0.5,
              title: "Eliminate render-blocking resources",
              details: { type: "opportunity", overallSavingsMs: 400 },
            },
          },
        },
        loadingExperience: {
          metrics: {
            LARGEST_CONTENTFUL_PAINT_MS: { percentile: 2400, category: "FAST" },
            CUMULATIVE_LAYOUT_SHIFT_SCORE: { percentile: 8, category: "FAST" },
          },
        },
      },
      "https://example.com/",
      "mobile",
    );

    expect(result.scores).toEqual({
      performance: 72,
      accessibility: 95,
      bestPractices: 88,
      seo: 100,
    });
    expect(result.labMetrics).toEqual([
      {
        key: "largest-contentful-paint",
        label: "Largest Contentful Paint",
        displayValue: "2.8 s",
      },
    ]);
    expect(result.fieldScope).toBe("page");
    expect(result.fieldMetrics).toHaveLength(2);
    expect(result.opportunities.map((item) => item.id)).toEqual([
      "unused-javascript",
      "render-blocking-resources",
    ]);
  });

  it("rejects responses without a Lighthouse report", () => {
    expect(() => normalizePageSpeedResponse({}, "https://example.com/", "desktop")).toThrow(
      PageSpeedProviderError,
    );
  });
});
