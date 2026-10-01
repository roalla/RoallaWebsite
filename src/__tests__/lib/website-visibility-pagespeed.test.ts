import {
  PageSpeedProviderError,
  analyzePageSpeed,
  normalizePageSpeedResponse,
  pageSpeedEndpoint,
  scorePublicPage,
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

  it("uses the PageSpeed Agentic Browsing score and only the checks that counted", () => {
    const result = normalizePageSpeedResponse(
      {
        lighthouseResult: {
          finalUrl: "https://www.roalla.com/",
          categories: {
            performance: { score: 0.9 },
            "agentic-browsing": {
              score: 1,
              auditRefs: [
                { id: "agent-accessibility-tree", weight: 1 },
                { id: "cumulative-layout-shift", weight: 1 },
                { id: "llms-txt", weight: 1 },
                { id: "webmcp-registered-tools", weight: 0 },
              ],
            },
          },
          audits: {
            "agent-accessibility-tree": {
              title: "Accessibility tree is well formed",
              score: 1,
              scoreDisplayMode: "binary",
            },
            "cumulative-layout-shift": {
              title: "Cumulative Layout Shift",
              score: 1,
              scoreDisplayMode: "numeric",
              displayValue: "0",
            },
            "llms-txt": {
              title: "llms.txt is valid",
              score: null,
              scoreDisplayMode: "notApplicable",
            },
            "webmcp-registered-tools": {
              title: "WebMCP tools",
              score: 1,
              scoreDisplayMode: "informative",
            },
          },
        },
      },
      "https://www.roalla.com/",
      "mobile",
    );

    expect(result.agentic).toEqual({
      score: 100,
      passed: 2,
      applicable: 2,
      source: "lighthouse",
      signals: [
        { id: "agent-accessibility-tree", label: "Accessibility tree is well formed", points: 100, maxPoints: 100 },
        { id: "cumulative-layout-shift", label: "Cumulative Layout Shift", points: 100, maxPoints: 100 },
      ],
    });
  });

  it("reports the PageSpeed pass count when a partial check would average to 50", () => {
    const result = normalizePageSpeedResponse(
      {
        lighthouseResult: {
          finalUrl: "https://www.roalla.com/",
          categories: {
            "agentic-browsing": {
              score: 0.5,
              categoryScoreDisplayMode: "fraction",
              auditRefs: [
                { id: "agent-accessibility-tree", weight: 1 },
                { id: "cumulative-layout-shift", weight: 1 },
                { id: "webmcp", weight: 1 },
                { id: "llms-txt", weight: 1 },
              ],
            },
          },
          audits: {
            "agent-accessibility-tree": { title: "Accessibility tree", score: 1, scoreDisplayMode: "binary" },
            "cumulative-layout-shift": { title: "Cumulative Layout Shift", score: 0.5, scoreDisplayMode: "numeric" },
            "webmcp": { title: "WebMCP", score: 0, scoreDisplayMode: "binary" },
            "llms-txt": { title: "llms.txt", score: null, scoreDisplayMode: "notApplicable" },
          },
        },
      },
      "https://www.roalla.com/",
      "mobile",
    );

    expect(result.agentic).toEqual({
      score: 33,
      passed: 1,
      applicable: 3,
      source: "lighthouse",
      signals: [
        { id: "agent-accessibility-tree", label: "Accessibility tree", points: 100, maxPoints: 100 },
        { id: "cumulative-layout-shift", label: "Cumulative Layout Shift", points: 50, maxPoints: 100 },
        { id: "webmcp", label: "WebMCP", points: 0, maxPoints: 100 },
      ],
    });
  });

  it("rejects responses without a Lighthouse report", () => {
    expect(() => normalizePageSpeedResponse({}, "https://example.com/", "desktop")).toThrow(
      PageSpeedProviderError,
    );
  });
});

describe("pageSpeedEndpoint", () => {
  const target = new URL("https://www.roalla.com/");

  it("omits the API key when none is configured", () => {
    const endpoint = pageSpeedEndpoint(target, "mobile");
    expect(endpoint.searchParams.get("url")).toBe("https://www.roalla.com/");
    expect(endpoint.searchParams.has("key")).toBe(false);
    expect(endpoint.searchParams.getAll("category")).toEqual([
      "performance",
      "accessibility",
      "best-practices",
      "seo",
      "agentic-browsing",
    ]);
  });

  it("sends a server-side API key to PageSpeed", async () => {
    let called = "";
    const fetcher = async (input: RequestInfo | URL) => {
      called = String(input);
      return {
        ok: true,
        status: 200,
        json: async () => ({
          lighthouseResult: { categories: { performance: { score: 0.9 } } },
        }),
      } as Response;
    };

    await analyzePageSpeed(target, "desktop", fetcher as typeof fetch, "test-key");

    const endpoint = new URL(called);
    expect(endpoint.searchParams.get("key")).toBe("test-key");
    expect(endpoint.searchParams.get("strategy")).toBe("desktop");
    expect(endpoint.searchParams.get("url")).toBe("https://www.roalla.com/");
  });
});

describe("scorePublicPage", () => {
  function psiResponse(finalUrl: string, score: number) {
    return {
      ok: true,
      status: 200,
      json: async () => ({
        lighthouseResult: {
          finalUrl,
          categories: { performance: { score } },
        },
      }),
    } as Response;
  }

  it("scores the landing page when the first run followed a redirect", async () => {
    const calls: string[] = [];
    const fetcher = async (input: RequestInfo | URL) => {
      const requested = new URL(String(input)).searchParams.get("url") ?? "";
      calls.push(requested);
      if (requested === "https://www.roalla.com/") {
        return psiResponse("https://www.roalla.com/en", 0.92);
      }
      return psiResponse("https://www.roalla.com/en", 0.98);
    };

    const result = await scorePublicPage(
      new URL("https://www.roalla.com/"),
      "mobile",
      fetcher as typeof fetch,
      "test-key",
    );

    expect(calls).toEqual(["https://www.roalla.com/", "https://www.roalla.com/en"]);
    expect(result.snapshot.scores.performance).toBe(98);
    expect(result.cacheUrl.toString()).toBe("https://www.roalla.com/en");
  });

  it("keeps a single run when the landing page only adds a trailing slash", async () => {
    const calls: string[] = [];
    const fetcher = async (input: RequestInfo | URL) => {
      calls.push(new URL(String(input)).searchParams.get("url") ?? "");
      return psiResponse("https://www.roalla.com/en/", 0.98);
    };

    const result = await scorePublicPage(
      new URL("https://www.roalla.com/en"),
      "desktop",
      fetcher as typeof fetch,
      "test-key",
    );

    expect(calls).toEqual(["https://www.roalla.com/en"]);
    expect(result.snapshot.scores.performance).toBe(98);
    expect(result.cacheUrl.toString()).toBe("https://www.roalla.com/en");
  });
});
