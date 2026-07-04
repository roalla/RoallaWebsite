import type { InsightSlug } from '@/lib/insights'

export const INSIGHT_BODY_KEYS = ['p1', 'p2', 'p3', 'p4'] as const

/** Conservative rate for short-form business content on the web. */
const WORDS_PER_MINUTE = 200

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function estimateReadMinutes(body: string): number {
  return Math.max(1, Math.ceil(countWords(body) / WORDS_PER_MINUTE))
}

export function insightBodyText(getParagraph: (key: (typeof INSIGHT_BODY_KEYS)[number]) => string): string {
  return INSIGHT_BODY_KEYS.map(getParagraph).join(' ')
}

export function insightReadMinutesFromParagraphs(
  getParagraph: (key: (typeof INSIGHT_BODY_KEYS)[number]) => string,
): number {
  return estimateReadMinutes(insightBodyText(getParagraph))
}

type InsightTranslator = {
  (key: `${InsightSlug}.${(typeof INSIGHT_BODY_KEYS)[number]}`): string
  (key: 'minRead', values: { count: number }): string
}

export function formatInsightReadTime(t: InsightTranslator, slug: InsightSlug): string {
  const minutes = insightReadMinutesFromParagraphs((key) => t(`${slug}.${key}`))
  return t('minRead', { count: minutes })
}
