export const INSIGHT_SLUGS = ['fractional-coo', 'strategic-planning', 'process-optimization'] as const

export type InsightSlug = (typeof INSIGHT_SLUGS)[number]

export function isInsightSlug(value: string): value is InsightSlug {
  return (INSIGHT_SLUGS as readonly string[]).includes(value)
}

export const INSIGHT_PUBLISHED_DATES: Record<InsightSlug, string> = {
  'fractional-coo': '2025-11-01',
  'strategic-planning': '2025-12-01',
  'process-optimization': '2026-01-15',
}
