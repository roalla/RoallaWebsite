export const INSIGHT_SLUGS = [
  'fractional-coo',
  'strategic-planning',
  'process-optimization',
  'smb-digitization-benefits',
  'smb-digital-efficiency',
  'smb-digital-growth',
  'search-and-ai-visibility',
] as const

export type InsightSlug = (typeof INSIGHT_SLUGS)[number]

export function isInsightSlug(value: string): value is InsightSlug {
  return (INSIGHT_SLUGS as readonly string[]).includes(value)
}

/** Optional per-article social preview images (defaults to site OG image). */
export const INSIGHT_OG_IMAGES: Partial<Record<InsightSlug, string>> = {
  'search-and-ai-visibility': '/og-image.jpg',
  'smb-digitization-benefits': '/roalla-snapshot.jpg',
  'smb-digital-efficiency': '/roalla-snapshot.jpg',
  'smb-digital-growth': '/roalla-snapshot.jpg',
}

/** Insights rooted in delivery work — shown with an engagement chip on the homepage */
export const INSIGHT_ENGAGEMENT_SLUGS: readonly InsightSlug[] = [
  'smb-digitization-benefits',
  'smb-digital-efficiency',
  'smb-digital-growth',
  'search-and-ai-visibility',
  'process-optimization',
]

export function insightCoverImage(slug: InsightSlug): string {
  return INSIGHT_OG_IMAGES[slug] ?? '/og-image.jpg'
}

export function insightFromEngagement(slug: InsightSlug): boolean {
  return INSIGHT_ENGAGEMENT_SLUGS.includes(slug)
}

export const INSIGHT_PUBLISHED_DATES: Record<InsightSlug, string> = {
  'fractional-coo': '2025-11-01',
  'strategic-planning': '2025-12-01',
  'process-optimization': '2026-01-15',
  'smb-digitization-benefits': '2026-02-01',
  'smb-digital-efficiency': '2026-03-01',
  'smb-digital-growth': '2026-04-01',
  'search-and-ai-visibility': '2026-05-01',
}
