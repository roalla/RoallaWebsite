import { OUTCOME_GROUP_IDS, isOutcomeGroupId, type OutcomeGroupId } from '@/lib/solution-outcome-pages'
import {
  USE_CASES,
  USE_CASE_INDUSTRIES,
  USE_CASE_TECHNOLOGIES,
  type UseCaseId,
  type UseCaseIndustry,
  type UseCaseTechnology,
} from '@/lib/use-cases'

export type FacetLocale = 'en' | 'fr'

export const ALL_FACET = 'all' as const
export type AllFacet = typeof ALL_FACET

export type UseCaseFacetState = {
  group: OutcomeGroupId | AllFacet
  industry: UseCaseIndustry | AllFacet
  tech: UseCaseTechnology | AllFacet
}

export const DEFAULT_USE_CASE_FACETS: UseCaseFacetState = {
  group: ALL_FACET,
  industry: ALL_FACET,
  tech: ALL_FACET,
}

export const USE_CASE_FACET_QUERY_KEYS = {
  group: 'group',
  industry: 'industry',
  tech: 'tech',
} as const

/** Short pill labels for the five outcome groups (full titles live in solution-outcome-pages). */
export const OUTCOME_GROUP_FACET_LABELS: Record<FacetLocale, Record<OutcomeGroupId, string>> = {
  en: {
    'growth-visibility': 'Growth & visibility',
    'experience-products': 'Experiences & products',
    'automation-ai': 'Automation & AI',
    'security-compliance': 'Security & compliance',
    execution: 'Execution',
  },
  fr: {
    'growth-visibility': 'Croissance et visibilité',
    'experience-products': 'Expériences et produits',
    'automation-ai': 'Automatisation et IA',
    'security-compliance': 'Sécurité et conformité',
    execution: 'Exécution',
  },
}

export const INDUSTRY_FACET_LABELS: Record<FacetLocale, Record<UseCaseIndustry, string>> = {
  en: {
    'professional-services': 'Professional services',
    'trades-field': 'Trades & field service',
    'retail-hospitality': 'Retail & hospitality',
    'healthcare-wellness': 'Healthcare & wellness',
    'nonprofit-public': 'Nonprofit & public sector',
    'technology-saas': 'Technology & SaaS',
    'manufacturing-ops': 'Manufacturing & operations',
    'general-smb': 'General small business',
  },
  fr: {
    'professional-services': 'Services professionnels',
    'trades-field': 'Métiers et services sur le terrain',
    'retail-hospitality': 'Commerce de détail et hôtellerie',
    'healthcare-wellness': 'Santé et mieux-être',
    'nonprofit-public': 'OBNL et secteur public',
    'technology-saas': 'Technologie et SaaS',
    'manufacturing-ops': 'Fabrication et opérations',
    'general-smb': 'Petite entreprise (général)',
  },
}

export const TECHNOLOGY_FACET_LABELS: Record<FacetLocale, Record<UseCaseTechnology, string>> = {
  en: {
    websites: 'Websites',
    communications: 'Communications',
    'cloud-migration': 'Cloud & migration',
    'security-mdr': 'Security & MDR',
    automation: 'Automation',
    'ai-employee': 'AI employee',
    'iot-tracking': 'IoT & tracking',
    'pos-checkout': 'POS & checkout',
    'data-ai': 'Data & AI',
    'search-visibility': 'Search & AI visibility',
  },
  fr: {
    websites: 'Sites web',
    communications: 'Communications',
    'cloud-migration': 'Infonuagique et migration',
    'security-mdr': 'Sécurité et MDR',
    automation: 'Automatisation',
    'ai-employee': 'Employé IA',
    'iot-tracking': 'IdO et suivi',
    'pos-checkout': 'Caisse et paiement',
    'data-ai': 'Données et IA',
    'search-visibility': 'Visibilité en recherche et IA',
  },
}

export function facetLocale(locale: string): FacetLocale {
  return locale === 'fr' ? 'fr' : 'en'
}

export function isUseCaseIndustry(value: string): value is UseCaseIndustry {
  return (USE_CASE_INDUSTRIES as readonly string[]).includes(value)
}

export function isUseCaseTechnology(value: string): value is UseCaseTechnology {
  return (USE_CASE_TECHNOLOGIES as readonly string[]).includes(value)
}

type SearchLike = string | URLSearchParams | Pick<URLSearchParams, 'get'>

/** Parse `?group=&industry=&tech=`; unknown values fall back to "all". */
export function parseUseCaseFacets(search: SearchLike): UseCaseFacetState {
  const params =
    typeof search === 'string' ? new URLSearchParams(search.startsWith('?') ? search.slice(1) : search) : search
  const group = params.get(USE_CASE_FACET_QUERY_KEYS.group) ?? ''
  const industry = params.get(USE_CASE_FACET_QUERY_KEYS.industry) ?? ''
  const tech = params.get(USE_CASE_FACET_QUERY_KEYS.tech) ?? ''
  return {
    group: isOutcomeGroupId(group) ? group : ALL_FACET,
    industry: isUseCaseIndustry(industry) ? industry : ALL_FACET,
    tech: isUseCaseTechnology(tech) ? tech : ALL_FACET,
  }
}

/** Serialize active facets (omitting "all") into a query string without the leading "?". */
export function serializeUseCaseFacets(state: UseCaseFacetState): string {
  const params = new URLSearchParams()
  if (state.group !== ALL_FACET) params.set(USE_CASE_FACET_QUERY_KEYS.group, state.group)
  if (state.industry !== ALL_FACET) params.set(USE_CASE_FACET_QUERY_KEYS.industry, state.industry)
  if (state.tech !== ALL_FACET) params.set(USE_CASE_FACET_QUERY_KEYS.tech, state.tech)
  return params.toString()
}

export function hasActiveUseCaseFacets(state: UseCaseFacetState): boolean {
  return state.group !== ALL_FACET || state.industry !== ALL_FACET || state.tech !== ALL_FACET
}

type FacetedUseCase = (typeof USE_CASES)[number]

export function useCaseMatchesFacets(item: FacetedUseCase, state: UseCaseFacetState): boolean {
  const industries: readonly string[] = item.industries
  const technologies: readonly string[] = item.technologies
  return (
    (state.group === ALL_FACET || item.outcomeGroup === state.group) &&
    (state.industry === ALL_FACET || industries.includes(state.industry)) &&
    (state.tech === ALL_FACET || technologies.includes(state.tech))
  )
}

/** All active facets combine with AND. */
export function filterUseCases(state: UseCaseFacetState): readonly FacetedUseCase[] {
  return USE_CASES.filter((item) => useCaseMatchesFacets(item, state))
}

export type FacetKey = keyof UseCaseFacetState

/**
 * Count of cases each option would yield if selected, holding the other two facets constant.
 * Lets the UI dim options that would produce an empty result.
 */
export function facetOptionCounts(state: UseCaseFacetState, key: FacetKey): Record<string, number> {
  const counts: Record<string, number> = {}
  const options: readonly string[] =
    key === 'group' ? OUTCOME_GROUP_IDS : key === 'industry' ? USE_CASE_INDUSTRIES : USE_CASE_TECHNOLOGIES
  for (const option of options) {
    counts[option] = USE_CASES.filter((item) =>
      useCaseMatchesFacets(item, { ...state, [key]: option } as UseCaseFacetState),
    ).length
  }
  counts[ALL_FACET] = USE_CASES.filter((item) =>
    useCaseMatchesFacets(item, { ...state, [key]: ALL_FACET } as UseCaseFacetState),
  ).length
  return counts
}

/** Industries/technologies that appear on at least one use case (keeps unused facet values out of the UI). */
export const USED_USE_CASE_INDUSTRIES: readonly UseCaseIndustry[] = USE_CASE_INDUSTRIES.filter((industry) =>
  USE_CASES.some((item) => (item.industries as readonly string[]).includes(industry)),
)

export const USED_USE_CASE_TECHNOLOGIES: readonly UseCaseTechnology[] = USE_CASE_TECHNOLOGIES.filter((tech) =>
  USE_CASES.some((item) => (item.technologies as readonly string[]).includes(tech)),
)

export function outcomeGroupForUseCase(id: UseCaseId): OutcomeGroupId {
  return USE_CASES.find((item) => item.id === id)!.outcomeGroup
}

/** Tertiary tool links shown on a use case, when a relevant tool exists. */
export const USE_CASE_TOOLS = {
  'communications-modernization': { href: '/tools/communications-value-brief', labelKey: 'commsValueBriefCta' },
  'platform-selection': { href: '/tools/technology-decision-brief', labelKey: 'techDecisionBriefCta' },
  'provider-comparison': { href: '/tools/technology-decision-brief', labelKey: 'techDecisionBriefCta' },
  'technology-stack-review': { href: '/tools/technology-decision-brief', labelKey: 'techDecisionBriefCta' },
  'strategic-priorities': { href: '/tools/ninety-day-plan-brief', labelKey: 'ninetyDayPlanBriefCta' },
  'profitability-capacity': { href: '/tools/capacity-pressure-brief', labelKey: 'capacityPressureBriefCta' },
  'search-ai-visibility': { href: '/tools/digital-presence-snapshot', labelKey: 'digitalPresenceSnapshotCta' },
  'website-refresh': { href: '/tools/digital-presence-snapshot', labelKey: 'digitalPresenceSnapshotCta' },
} as const satisfies Partial<
  Record<
    UseCaseId,
    {
      href:
        | '/tools/communications-value-brief'
        | '/tools/technology-decision-brief'
        | '/tools/ninety-day-plan-brief'
        | '/tools/capacity-pressure-brief'
        | '/tools/digital-presence-snapshot'
      labelKey:
        | 'commsValueBriefCta'
        | 'techDecisionBriefCta'
        | 'ninetyDayPlanBriefCta'
        | 'capacityPressureBriefCta'
        | 'digitalPresenceSnapshotCta'
    }
  >
>
