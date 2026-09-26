import { OG_IMAGE } from '@/lib/site'

export const INSIGHT_SLUGS = [
  "fractional-coo",
  "strategic-planning",
  "process-optimization",
  "smb-digitization-benefits",
  "smb-digital-efficiency",
  "smb-digital-growth",
  "search-and-ai-visibility",
  "how-ai-systems-understand-websites",
  "structured-data-for-small-business",
  "professional-email-avoid-spam-phishing",
  "authentic-professional-portrait-selection",
  "is-your-website-builder-limiting-growth",
] as const;

export type InsightSlug = (typeof INSIGHT_SLUGS)[number];

export type InsightGroup = "digital" | "advisory";

/** Articles grouped for the header and insights index. Order is the reading order in each group. */
export const INSIGHT_GROUPS: Record<InsightGroup, readonly InsightSlug[]> = {
  digital: [
    "smb-digitization-benefits",
    "smb-digital-efficiency",
    "smb-digital-growth",
    "search-and-ai-visibility",
    "how-ai-systems-understand-websites",
    "structured-data-for-small-business",
    "professional-email-avoid-spam-phishing",
    "authentic-professional-portrait-selection",
    "is-your-website-builder-limiting-growth",
  ],
  advisory: ["fractional-coo", "strategic-planning", "process-optimization"],
};

/**
 * The five articles featured in the header Insights menu, in priority order.
 * Replace this list to change the menu. The insights index still lists every article.
 */
export const HEADER_INSIGHT_SLUGS = [
  "is-your-website-builder-limiting-growth",
  "professional-email-avoid-spam-phishing",
  "search-and-ai-visibility",
  "fractional-coo",
  "strategic-planning",
] as const satisfies readonly InsightSlug[];

export function headerInsightsForGroup(group: InsightGroup): InsightSlug[] {
  const inGroup = new Set(INSIGHT_GROUPS[group]);
  return HEADER_INSIGHT_SLUGS.filter((slug) => inGroup.has(slug));
}

export function isInsightSlug(value: string): value is InsightSlug {
  return (INSIGHT_SLUGS as readonly string[]).includes(value);
}

/** Optional per-article social preview images (defaults to site OG image). */
export const INSIGHT_OG_IMAGES: Partial<Record<InsightSlug, string>> = {
  "fractional-coo": "/images/insights/library/fractional-coo.webp",
  "strategic-planning": "/images/insights/library/strategic-planning.webp",
  "process-optimization": "/images/insights/library/process-optimization.webp",
  "smb-digitization-benefits": "/images/insights/library/smb-digitization-benefits.webp",
  "smb-digital-efficiency": "/images/insights/library/smb-digital-efficiency.webp",
  "smb-digital-growth": "/images/insights/library/smb-digital-growth.webp",
  "search-and-ai-visibility": "/images/insights/library/search-and-ai-visibility.webp",
  "how-ai-systems-understand-websites": "/images/insights/library/how-ai-systems-understand-websites.webp",
  "structured-data-for-small-business": "/images/insights/library/structured-data-for-small-business.webp",
  "professional-email-avoid-spam-phishing": "/images/insights/library/professional-email-avoid-spam-phishing.webp",
  "authentic-professional-portrait-selection": "/images/insights/library/authentic-professional-portrait-selection.webp",
};

/** Insights rooted in delivery work — shown with an engagement chip on the homepage */
export const INSIGHT_ENGAGEMENT_SLUGS: readonly InsightSlug[] = [
  "smb-digitization-benefits",
  "smb-digital-efficiency",
  "smb-digital-growth",
  "search-and-ai-visibility",
  "process-optimization",
];

export function insightCoverImage(slug: InsightSlug): string {
  return INSIGHT_OG_IMAGES[slug] ?? OG_IMAGE;
}

export function insightFromEngagement(slug: InsightSlug): boolean {
  return INSIGHT_ENGAGEMENT_SLUGS.includes(slug);
}

export const INSIGHT_PUBLISHED_DATES: Record<InsightSlug, string> = {
  "fractional-coo": "2025-11-01",
  "strategic-planning": "2025-12-01",
  "process-optimization": "2026-01-15",
  "smb-digitization-benefits": "2026-02-01",
  "smb-digital-efficiency": "2026-03-01",
  "smb-digital-growth": "2026-04-01",
  "search-and-ai-visibility": "2026-05-01",
  "how-ai-systems-understand-websites": "2026-07-15",
  "structured-data-for-small-business": "2026-07-22",
  "professional-email-avoid-spam-phishing": "2026-09-26",
  "authentic-professional-portrait-selection": "2026-09-26",
  "is-your-website-builder-limiting-growth": "2026-09-26",
};
