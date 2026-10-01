import { isSamePublicPage } from "@/lib/website-visibility/page-url";
import { normalizePublicTarget } from "@/lib/website-visibility/public-target";

export type PageSpeedStrategy = "mobile" | "desktop";
export type ScoreName =
  | "performance"
  | "accessibility"
  | "bestPractices"
  | "seo";

export type WebsiteVisibilitySnapshot = {
  provider: "Google PageSpeed Insights";
  strategy: PageSpeedStrategy;
  requestedUrl: string;
  finalUrl: string;
  analyzedAt: string;
  lighthouseVersion?: string;
  scores: Record<ScoreName, number | null>;
  labMetrics: Array<{
    key: string;
    label: string;
    displayValue: string;
  }>;
  fieldMetrics: Array<{
    key: string;
    label: string;
    displayValue: string;
    category?: string;
  }>;
  fieldScope?: "page" | "origin";
  opportunities: Array<{
    id: string;
    title: string;
    description?: string;
    displayValue?: string;
    savingsMs?: number;
  }>;
  warnings: string[];
};

type UnknownRecord = Record<string, unknown>;

export class PageSpeedProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PageSpeedProviderError";
  }
}

function record(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function number(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function categoryScore(categories: UnknownRecord, key: string): number | null {
  const score = number(record(categories[key]).score);
  return score == null ? null : Math.round(score * 100);
}

const LAB_AUDITS = [
  ["first-contentful-paint", "First Contentful Paint"],
  ["largest-contentful-paint", "Largest Contentful Paint"],
  ["cumulative-layout-shift", "Cumulative Layout Shift"],
  ["total-blocking-time", "Total Blocking Time"],
  ["speed-index", "Speed Index"],
] as const;

const FIELD_METRICS = [
  ["LARGEST_CONTENTFUL_PAINT_MS", "Largest Contentful Paint", "ms"],
  ["INTERACTION_TO_NEXT_PAINT", "Interaction to Next Paint", "ms"],
  ["CUMULATIVE_LAYOUT_SHIFT_SCORE", "Cumulative Layout Shift", "score"],
] as const;

function normalizeFieldMetrics(source: UnknownRecord) {
  const metrics = record(source.metrics);
  return FIELD_METRICS.flatMap(([key, label, unit]) => {
    const metric = record(metrics[key]);
    const percentile = number(metric.percentile);
    if (percentile == null) return [];
    const displayValue =
      unit === "score" ? (percentile / 100).toFixed(2) : `${Math.round(percentile)} ms`;
    return [
      {
        key,
        label,
        displayValue,
        category: text(metric.category),
      },
    ];
  });
}

export function normalizePageSpeedResponse(
  payload: unknown,
  requestedUrl: string,
  strategy: PageSpeedStrategy,
): WebsiteVisibilitySnapshot {
  const root = record(payload);
  const lighthouse = record(root.lighthouseResult);
  const categories = record(lighthouse.categories);
  const audits = record(lighthouse.audits);
  const pageField = record(root.loadingExperience);
  const originField = record(root.originLoadingExperience);
  const pageMetrics = normalizeFieldMetrics(pageField);
  const originMetrics = normalizeFieldMetrics(originField);
  const warnings = Array.isArray(lighthouse.runWarnings)
    ? lighthouse.runWarnings.flatMap((warning) => (text(warning) ? [text(warning)!] : []))
    : [];

  if (!Object.keys(categories).length) {
    throw new PageSpeedProviderError(
      "PageSpeed did not return a usable Lighthouse report for this page.",
    );
  }

  const opportunities = Object.entries(audits)
    .flatMap(([id, value]) => {
      const audit = record(value);
      const details = record(audit.details);
      const savingsMs = number(details.overallSavingsMs);
      const score = number(audit.score);
      if (details.type !== "opportunity" || (score != null && score >= 0.9)) return [];
      return [
        {
          id,
          title: text(audit.title) ?? id,
          description: text(audit.description),
          displayValue: text(audit.displayValue),
          savingsMs,
        },
      ];
    })
    .sort((a, b) => (b.savingsMs ?? 0) - (a.savingsMs ?? 0))
    .slice(0, 5);

  return {
    provider: "Google PageSpeed Insights",
    strategy,
    requestedUrl,
    finalUrl: text(lighthouse.finalUrl) ?? requestedUrl,
    analyzedAt: text(lighthouse.fetchTime) ?? new Date().toISOString(),
    lighthouseVersion: text(lighthouse.lighthouseVersion),
    scores: {
      performance: categoryScore(categories, "performance"),
      accessibility: categoryScore(categories, "accessibility"),
      bestPractices: categoryScore(categories, "best-practices"),
      seo: categoryScore(categories, "seo"),
    },
    labMetrics: LAB_AUDITS.flatMap(([key, label]) => {
      const displayValue = text(record(audits[key]).displayValue);
      return displayValue ? [{ key, label, displayValue }] : [];
    }),
    fieldMetrics: pageMetrics.length ? pageMetrics : originMetrics,
    fieldScope: pageMetrics.length ? "page" : originMetrics.length ? "origin" : undefined,
    opportunities,
    warnings,
  };
}

export function pageSpeedUserAgent(strategy: PageSpeedStrategy) {
  return strategy === "mobile"
    ? "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36"
    : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36";
}

function publicPage(value: string) {
  try {
    return normalizePublicTarget(value);
  } catch {
    return undefined;
  }
}

export function pageSpeedEndpoint(target: URL, strategy: PageSpeedStrategy, apiKey?: string) {
  const endpoint = new URL(
    "https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed",
  );
  endpoint.searchParams.set("url", target.toString());
  endpoint.searchParams.set("strategy", strategy);
  for (const category of ["performance", "accessibility", "best-practices", "seo"]) {
    endpoint.searchParams.append("category", category);
  }
  const key = apiKey?.trim();
  if (key) endpoint.searchParams.set("key", key);
  return endpoint;
}

export async function analyzePageSpeed(
  target: URL,
  strategy: PageSpeedStrategy,
  fetcher: typeof fetch = fetch,
  apiKey = process.env.PAGESPEED_API_KEY,
): Promise<WebsiteVisibilitySnapshot> {
  const endpoint = pageSpeedEndpoint(target, strategy, apiKey);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);
  let response: Response;
  try {
    response = await fetcher(endpoint, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch {
    throw new PageSpeedProviderError(
      "The PageSpeed service did not respond in time. Try again shortly.",
    );
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    console.error(
      `[visibility-snapshot] PageSpeed upstream status=${response.status} keyed=${Boolean(apiKey?.trim())}`,
    );
    throw new PageSpeedProviderError(
      response.status === 429
        ? "The snapshot service has reached its daily analysis limit. Please try again later."
        : "The PageSpeed service could not analyze this page right now.",
    );
  }

  return normalizePageSpeedResponse(await response.json(), target.toString(), strategy);
}

/**
 * Score the landing page when the submitted address redirects.
 * PageSpeed Insights reports that landing page, so scoring the original
 * address includes redirect time and will not match its performance result.
 */
export async function scorePublicPage(
  analyzed: URL,
  strategy: PageSpeedStrategy,
  fetcher: typeof fetch = fetch,
  apiKey = process.env.PAGESPEED_API_KEY,
): Promise<{ snapshot: WebsiteVisibilitySnapshot; cacheUrl: URL }> {
  let cacheUrl = analyzed;
  let snapshot = await analyzePageSpeed(analyzed, strategy, fetcher, apiKey);
  const landed = publicPage(snapshot.finalUrl);
  if (landed && !isSamePublicPage(landed.toString(), analyzed.toString())) {
    cacheUrl = landed;
    snapshot = await analyzePageSpeed(landed, strategy, fetcher, apiKey);
  }
  return { snapshot, cacheUrl };
}
