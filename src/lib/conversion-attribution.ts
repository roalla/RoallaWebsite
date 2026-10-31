/**
 * Preserve solutions / campaign attribution across tool → contact hops.
 * Prefer inbound query values; never wipe an existing solutions entry_page.
 */

export const ATTRIBUTION_QUERY_KEYS = [
  'campaign',
  'offer',
  'icp',
  'conversion_source',
  'entry_page',
  'signal',
  'selected_problem',
  'situation',
  'scope',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const

export type AttributionQueryKey = (typeof ATTRIBUTION_QUERY_KEYS)[number]

export type AttributionBag = Partial<Record<AttributionQueryKey, string>>

export function readAttributionFromSearch(
  search: string | URLSearchParams | null | undefined,
): AttributionBag {
  const params =
    typeof search === 'string'
      ? new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
      : search instanceof URLSearchParams
        ? search
        : new URLSearchParams()
  const bag: AttributionBag = {}
  for (const key of ATTRIBUTION_QUERY_KEYS) {
    const value = params.get(key)?.trim()
    if (value) bag[key] = value.slice(0, 240)
  }
  return bag
}

/** Merge inbound attribution into a contact (or next-hop) URL without dropping prior solutions context. */
export function appendAttributionToHref(
  href: string,
  inbound: AttributionBag,
  defaults: AttributionBag = {},
): string {
  const target = new URL(href, 'https://www.roalla.com')
  const merged: AttributionBag = { ...defaults }

  for (const key of ATTRIBUTION_QUERY_KEYS) {
    const incoming = inbound[key]
    if (incoming) merged[key] = incoming
  }

  // Keep the earliest solutions entry_page when defaults only supply the tool path.
  if (inbound.entry_page) merged.entry_page = inbound.entry_page

  for (const [key, value] of Object.entries(merged)) {
    if (value) target.searchParams.set(key, value.slice(0, 240))
  }

  // Pack attribution into from_page query string so consultation email rows can parse it.
  const fromPage = target.searchParams.get('from_page') || target.pathname
  try {
    const source = new URL(fromPage, 'https://www.roalla.com')
    for (const key of ATTRIBUTION_QUERY_KEYS) {
      const value = merged[key as AttributionQueryKey]
      if (value && key !== 'entry_page') source.searchParams.set(key, value.slice(0, 240))
    }
    if (merged.entry_page) source.searchParams.set('entry_page', merged.entry_page)
    target.searchParams.set('from_page', `${source.pathname}${source.search}`)
  } catch {
    /* keep existing from_page */
  }

  return `${target.pathname}${target.search}${target.hash}`
}

/** Prefer inbound params; fill gaps with campaign-page defaults (used by ReviewCampaign CTAs). */
export function mergeCampaignAttribution(
  inbound: AttributionBag,
  campaignDefaults: AttributionBag,
): AttributionBag {
  const merged: AttributionBag = { ...campaignDefaults }
  for (const key of ATTRIBUTION_QUERY_KEYS) {
    if (inbound[key]) merged[key] = inbound[key]
  }
  // Keep original solutions entry when present; otherwise use campaign page path.
  if (inbound.entry_page) merged.entry_page = inbound.entry_page
  else if (campaignDefaults.entry_page) merged.entry_page = campaignDefaults.entry_page
  // Preserve solutions conversion_source when inbound; else stamp campaign_page.
  if (!inbound.conversion_source && campaignDefaults.conversion_source) {
    merged.conversion_source = campaignDefaults.conversion_source
  }
  return merged
}

export function solutionsResumeKey(groupId: string) {
  return `roalla-solutions-resume:${groupId}`
}

export type SolutionsResume = {
  situationId: string
  evidencePath?: string
  savedAt: string
}

export function readSolutionsResume(groupId: string): SolutionsResume | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(solutionsResumeKey(groupId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as SolutionsResume
    if (!parsed?.situationId) return null
    return parsed
  } catch {
    return null
  }
}

export function writeSolutionsResume(groupId: string, resume: Omit<SolutionsResume, 'savedAt'>) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(
      solutionsResumeKey(groupId),
      JSON.stringify({ ...resume, savedAt: new Date().toISOString() }),
    )
  } catch {
    /* ignore quota */
  }
}
