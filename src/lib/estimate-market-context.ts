import {
  INDUSTRY_HUB_IDS,
  getIndustryHub,
  isIndustryHubId,
  type IndustryHubId,
} from '@/lib/industry-hub-content'
import {
  getEstimateRegionLabel,
  getRegionConsiderations,
  isEstimateRegionId,
} from '@/lib/estimate-regions'

export type EstimateToolKind = 'website' | 'visibility' | 'email' | 'workshop'

export type EstimateMarketId = IndustryHubId | 'other'

export const ESTIMATE_MARKET_OTHER = 'other' as const

export function listEstimateMarketOptions(locale: string): { id: EstimateMarketId; label: string }[] {
  const language = locale === 'fr' ? 'fr' : 'en'
  const hubs = INDUSTRY_HUB_IDS.map((id) => {
    const hub = getIndustryHub(language, id)
    return { id: id as EstimateMarketId, label: hub?.label ?? id }
  })
  hubs.push({
    id: ESTIMATE_MARKET_OTHER,
    label: language === 'fr' ? 'Autre / pas sûr' : 'Other / not sure',
  })
  return hubs
}

/** Resolve hub id from query `industry` / `icp` (id or label). */
export function resolveEstimateMarketId(
  locale: string,
  raw: string | null | undefined,
): EstimateMarketId | null {
  const value = raw?.trim()
  if (!value) return null
  if (value === ESTIMATE_MARKET_OTHER) return ESTIMATE_MARKET_OTHER
  if (isIndustryHubId(value)) return value

  const language = locale === 'fr' ? 'fr' : 'en'
  const lowered = value.toLowerCase()
  for (const id of INDUSTRY_HUB_IDS) {
    const hub = getIndustryHub(language, id)
    if (!hub) continue
    if (hub.label.toLowerCase() === lowered || hub.shortLabel.toLowerCase() === lowered) return id
  }
  // Try the other locale labels too (EN link into FR page, etc.)
  const other = language === 'fr' ? 'en' : 'fr'
  for (const id of INDUSTRY_HUB_IDS) {
    const hub = getIndustryHub(other, id)
    if (!hub) continue
    if (hub.label.toLowerCase() === lowered || hub.shortLabel.toLowerCase() === lowered) return id
  }
  return null
}

export function getEstimateMarketLabel(locale: string, marketId: string | null | undefined): string {
  if (!marketId) return ''
  if (marketId === ESTIMATE_MARKET_OTHER) {
    return locale === 'fr' ? 'Autre / pas sûr' : 'Other / not sure'
  }
  if (!isIndustryHubId(marketId)) return marketId
  return getIndustryHub(locale === 'fr' ? 'fr' : 'en', marketId)?.label ?? marketId
}

function toolAngle(locale: string, tool: EstimateToolKind, marketId: IndustryHubId): string {
  const fr = locale === 'fr'
  switch (tool) {
    case 'website':
      return fr
        ? `Pour ${getEstimateMarketLabel(locale, marketId)}, le site doit rendre l’offre et le prochain pas évidents pour ce type de client.`
        : `For ${getEstimateMarketLabel(locale, marketId)}, the site should make the offer and next step obvious for this type of buyer.`
    case 'visibility':
      return fr
        ? `Pour ${getEstimateMarketLabel(locale, marketId)}, alignez la présence publique sur les endroits où ces clients cherchent réellement.`
        : `For ${getEstimateMarketLabel(locale, marketId)}, align public presence with where these customers actually look.`
    case 'email':
      return fr
        ? `Pour ${getEstimateMarketLabel(locale, marketId)}, sécurisez la messagerie et les signaux d’authentification avant d’augmenter le volume.`
        : `For ${getEstimateMarketLabel(locale, marketId)}, harden mailbox and authentication signals before scaling volume.`
    case 'workshop':
      return fr
        ? `Pour ${getEstimateMarketLabel(locale, marketId)}, un atelier utile produit une décision, une pratique ou un engagement nommé—pas seulement une discussion.`
        : `For ${getEstimateMarketLabel(locale, marketId)}, a useful workshop produces a decision, practiced skill, or named commitment—not only discussion.`
  }
}

export function getMarketConsiderations(
  locale: string,
  marketId: string | null | undefined,
  tool: EstimateToolKind,
): string[] {
  if (!marketId || marketId === ESTIMATE_MARKET_OTHER || !isIndustryHubId(marketId)) return []
  const hub = getIndustryHub(locale === 'fr' ? 'fr' : 'en', marketId)
  if (!hub) return []
  const pressures = hub.pressures.slice(0, 2)
  return [toolAngle(locale, tool, marketId), ...pressures]
}

/** DIY builder limits vs ROALLA scoped website/visibility work (not email). Workshop travel framing when relevant. */
export function getPlatformConsiderations(locale: string, tool: EstimateToolKind): string[] {
  const fr = locale === 'fr'
  if (tool === 'workshop') {
    return fr
      ? [
          'Les prix d’atelier sont en $ CA. Le déplacement est inclus jusqu’à Mississauga (est), Hamilton (ouest) et Milton (nord); au-delà, les frais de déplacement sont confirmés au cadrage.',
          'Il s’agit d’une estimation d’hôte préliminaire—pas de billetterie en ligne. La portée, la taille du groupe et le lieu sont confirmés par écrit avant la réservation.',
        ]
      : [
          'Workshop prices are CAD. Travel is included as far as Mississauga (east), Hamilton (west), and Milton (north); beyond that, travel fees are confirmed on scoping.',
          'This is a preliminary host estimate—not online ticketing. Scope, group size, and venue are confirmed in writing before booking.',
        ]
  }
  if (tool !== 'website' && tool !== 'visibility') return []
  if (fr) {
    return [
      'Les plateformes générateurs (thèmes WordPress, GoDaddy, Wix) limitent souvent les données structurées, l’architecture crawlable et la liberté d’ajuster les pages pour la recherche et les assistants IA.',
      'Le travail ROALLA porte sur l’empreinte publique que vous contrôlez—offre et contact clairs, signaux techniques pour le SEO, l’AEO et la découverte agentique—pas seulement un thème ou un modèle de marketplace.',
    ]
  }
  return [
    'Builder platforms (WordPress themes, GoDaddy, Wix) often restrict structured data, crawlable architecture, and how freely you can tune pages for search and AI assistants.',
    'ROALLA’s package work owns the public footprint—clear offer/contact path, technical signals for SEO/AEO/agentic discovery, and scoped changes on a stack you control—not a theme preset or marketplace template alone.',
  ]
}

export function getEstimateConsiderations(args: {
  locale: string
  marketId: string | null | undefined
  regionId: string | null | undefined
  tool: EstimateToolKind
}): string[] {
  const platform = getPlatformConsiderations(args.locale, args.tool)
  const market = getMarketConsiderations(args.locale, args.marketId, args.tool)
  const region = getRegionConsiderations(args.locale, args.regionId)
  // Cap at 5 so platform contrast still leaves room for market/region tips
  return [...platform, ...market, ...region].slice(0, 5)
}

export function buildEstimateContextSummary(args: {
  locale: string
  marketId: string | null | undefined
  regionId: string | null | undefined
}): string {
  const fr = args.locale === 'fr'
  const parts: string[] = []
  const marketLabel = getEstimateMarketLabel(args.locale, args.marketId)
  if (marketLabel) parts.push(fr ? `Marché: ${marketLabel}` : `Market: ${marketLabel}`)
  if (args.regionId && isEstimateRegionId(args.regionId)) {
    parts.push(
      fr
        ? `Région: ${getEstimateRegionLabel(args.regionId, args.locale)}`
        : `Region: ${getEstimateRegionLabel(args.regionId, args.locale)}`,
    )
  }
  return parts.join('. ')
}
