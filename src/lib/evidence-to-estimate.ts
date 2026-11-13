/**
 * Evidence → estimate loop helpers: prefer estimate CTAs for Insights/solutions
 * inbound traffic, build estimate hrefs that keep attribution, and store compact
 * session evidence for estimator → contact handoff.
 */

import {
  ATTRIBUTION_QUERY_KEYS,
  type AttributionBag,
  readAttributionFromSearch,
} from '@/lib/conversion-attribution'

export const EVIDENCE_STORAGE_KEYS = {
  digitalPresenceSnapshot: 'roalla-evidence-digital-presence-snapshot',
  emailReachBrief: 'roalla-evidence-email-reach-brief',
} as const

export type EvidenceToolId = 'digital-presence-snapshot' | 'email-reach-brief'

export type EvidenceArtifact = {
  tool: EvidenceToolId
  domain?: string
  url?: string
  priorities: string[]
  scores?: Record<string, number | null | undefined>
  asOf: string
}

export type PreferEstimateSource =
  | AttributionBag
  | URLSearchParams
  | string
  | null
  | undefined

function asAttributionBag(source: PreferEstimateSource): AttributionBag {
  if (!source) return {}
  if (typeof source === 'string' || source instanceof URLSearchParams) {
    return readAttributionFromSearch(source)
  }
  return source
}

/** True when inbound traffic came from Insights campaigns or solutions need pages. */
export function preferEstimate(source: PreferEstimateSource): boolean {
  const bag = asAttributionBag(source)
  const campaign = bag.campaign?.trim() || ''
  const conversionSource = bag.conversion_source?.trim() || ''
  const entryPage = bag.entry_page?.trim() || ''

  if (campaign.startsWith('insights-')) return true
  if (conversionSource === 'insights_campaign') return true
  if (campaign.startsWith('solutions-')) return true
  if (entryPage.includes('/solutions/need/')) return true
  return false
}

export type BuildEstimateHrefInput = {
  pathname: string
  website?: string
  attribution?: AttributionBag
  fromTool: EvidenceToolId | string
}

/** Build an estimate path that preserves solutions/Insights attribution + website. */
export function buildEstimateHref({
  pathname,
  website,
  attribution = {},
  fromTool,
}: BuildEstimateHrefInput): string {
  const target = new URL(pathname.startsWith('/') ? pathname : `/${pathname}`, 'https://www.roalla.com')
  for (const key of ATTRIBUTION_QUERY_KEYS) {
    const value = attribution[key]?.trim()
    if (value) target.searchParams.set(key, value.slice(0, 240))
  }
  const site = website?.trim()
  if (site) target.searchParams.set('website', site.slice(0, 240))
  if (fromTool.trim()) target.searchParams.set('from_tool', fromTool.trim().slice(0, 80))
  return `${target.pathname}${target.search}`
}

export function writeEvidenceArtifact(
  key: (typeof EVIDENCE_STORAGE_KEYS)[keyof typeof EVIDENCE_STORAGE_KEYS],
  artifact: EvidenceArtifact,
): void {
  if (typeof window === 'undefined') return
  try {
    const compact: EvidenceArtifact = {
      tool: artifact.tool,
      ...(artifact.domain ? { domain: artifact.domain.slice(0, 240) } : {}),
      ...(artifact.url ? { url: artifact.url.slice(0, 240) } : {}),
      priorities: artifact.priorities
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 7)
        .map((line) => line.slice(0, 200)),
      asOf: artifact.asOf || new Date().toISOString(),
    }
    if (artifact.scores && Object.keys(artifact.scores).length) {
      compact.scores = artifact.scores
    }
    window.sessionStorage.setItem(key, JSON.stringify(compact))
  } catch {
    /* ignore quota / private mode */
  }
}

export function readEvidenceArtifact(
  key: (typeof EVIDENCE_STORAGE_KEYS)[keyof typeof EVIDENCE_STORAGE_KEYS],
): EvidenceArtifact | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as EvidenceArtifact
    if (!parsed?.tool || !Array.isArray(parsed.priorities)) return null
    return parsed
  } catch {
    return null
  }
}

/** Compact one-line summary for contact query when a structured engagement packet is not yet ready. */
export function summarizeEvidenceForContact(artifact: EvidenceArtifact | null | undefined): string {
  if (!artifact) return ''
  const where = artifact.domain || artifact.url || ''
  const tops = artifact.priorities.slice(0, 3).join('; ')
  const parts = [
    artifact.tool,
    where ? `site ${where}` : '',
    tops ? `priorities: ${tops}` : '',
  ].filter(Boolean)
  return parts.join(' · ').slice(0, 480)
}

export function showEstimateContinuation(
  search: PreferEstimateSource,
  fromTool?: string | null,
): boolean {
  if (fromTool?.trim()) return true
  return preferEstimate(search)
}
