/**
 * Conversion contract for service and solution CTAs.
 *
 * Primary CTAs should land on a context brief, snapshot, or estimate—or on
 * contact with the offer prefilled. Do not send visitors from a product page
 * through another brochure review page, then a generic /assessment.
 *
 * Campaign review pages may stay for ads/SEO; their own primary CTA must
 * still point at the matching brief (or contact), not /assessment.
 */

export const CONVERSION_BRIEF_PATHS = [
  '/tools/ai-employee-fit-brief',
  '/tools/learning-adoption-brief',
  '/tools/communications-value-brief',
  '/tools/email-reach-brief',
  '/tools/ninety-day-plan-brief',
  '/tools/capacity-pressure-brief',
  '/tools/technology-decision-brief',
  '/tools/digital-presence-snapshot',
  '/tools/digital-value-blueprint',
  '/tools/estimates',
  '/website-estimate',
  '/visibility-improvement-estimate',
  '/email-reach-estimate',
  '/contact',
] as const

export type ConversionBriefPath = (typeof CONVERSION_BRIEF_PATHS)[number]

/** Paths that must not be used as primary conversion from product/solution pages. */
export const CONVERSION_DEAD_END_PATHS = ['/assessment'] as const

export function isConversionBriefPath(path: string): boolean {
  return (CONVERSION_BRIEF_PATHS as readonly string[]).includes(path)
}

export function isConversionDeadEnd(path: string): boolean {
  return (CONVERSION_DEAD_END_PATHS as readonly string[]).includes(path)
}

export type ConversionContextParams = {
  campaign?: string
  offer?: string
  entry_page?: string
  signal?: string
  selected_problem?: string
  industry?: string
  audience?: string
  conversion_source?: string
  intent?: string
  focus?: string
  need?: string
  icp?: string
}

/** Build a conversion href that preserves offer context for the destination tool. */
export function buildConversionHref(
  locale: 'en' | 'fr',
  toolPath: ConversionBriefPath | string,
  context: ConversionContextParams,
): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(context)) {
    if (value) params.set(key, value)
  }
  const query = params.toString()
  return `/${locale}${toolPath}${query ? `?${query}` : ''}`
}
