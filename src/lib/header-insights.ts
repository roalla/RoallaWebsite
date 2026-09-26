import {
  HEADER_INSIGHT_SLUGS,
  isInsightSlug,
  type InsightSlug,
} from '@/lib/insights'

export const HEADER_INSIGHT_COUNT = 5

/** Accepts exactly five unique published insight slugs, in menu order. */
export function normalizeHeaderInsightSlugs(input: unknown): InsightSlug[] | null {
  if (!Array.isArray(input) || input.length !== HEADER_INSIGHT_COUNT) return null
  const slugs: InsightSlug[] = []
  for (const value of input) {
    if (typeof value !== 'string' || !isInsightSlug(value) || slugs.includes(value)) return null
    slugs.push(value)
  }
  return slugs
}

export function defaultHeaderInsightSlugs(): InsightSlug[] {
  return [...HEADER_INSIGHT_SLUGS]
}
