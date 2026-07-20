import type { PortfolioItemId } from '@/lib/digitalPortfolio'

/** Portfolio items with dedicated case-study landing pages. */
export const CASE_STUDY_SLUGS = [
  'grcstatus',
  'business-cocoon',
  'pitch-hotshots',
  'boothlio',
  'unjargonit',
] as const satisfies readonly PortfolioItemId[]

export type CaseStudySlug = (typeof CASE_STUDY_SLUGS)[number]

export function isCaseStudySlug(value: string): value is CaseStudySlug {
  return (CASE_STUDY_SLUGS as readonly string[]).includes(value)
}
