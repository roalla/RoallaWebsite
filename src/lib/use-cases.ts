import type { AssessmentLane, AssessmentResult } from '@/lib/assessment'
import type { ConsultationIntent } from '@/lib/consultation-request'
import type { CaseStudySlug } from '@/lib/portfolio-case-studies'

export const USE_CASE_MATURITY_LEVELS = ['proven', 'established', 'ready'] as const
export type UseCaseMaturity = (typeof USE_CASE_MATURITY_LEVELS)[number]

export const USE_CASE_CATEGORIES = [
  'decisions',
  'execution',
  'resilience',
  'demand',
  'experiences',
  'automation',
] as const
export type UseCaseCategory = (typeof USE_CASE_CATEGORIES)[number]

export type UseCaseFilter = UseCaseCategory | 'all'

export const USE_CASE_SERVICE_KEYS = [
  'business-advisory',
  'technology-advisory',
  'website-design',
  'digital-products',
  'automation',
  'digital-events',
  'digital-enablement',
] as const
export type UseCaseServiceKey = (typeof USE_CASE_SERVICE_KEYS)[number]

export const USE_CASE_SERVICE_HREFS = {
  'business-advisory': '/programs/business-enablement',
  'technology-advisory': '/programs/technology-advisory',
  'website-design': '/website-design',
  'digital-products': '/services/digital-products',
  automation: '/services/automation',
  'digital-events': '/services/digital-events',
  'digital-enablement': '/services/digital',
} as const satisfies Record<UseCaseServiceKey, string>

export const USE_CASES = [
  {
    id: 'strategic-priorities',
    category: 'decisions',
    service: 'business-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'process-bottlenecks',
    category: 'execution',
    service: 'business-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'founder-bottleneck',
    category: 'execution',
    service: 'business-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'leadership-decision-rights',
    category: 'execution',
    service: 'business-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'management-dashboard',
    category: 'execution',
    service: 'business-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'profitability-capacity',
    category: 'execution',
    service: 'business-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'repeatable-delivery',
    category: 'execution',
    service: 'business-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'digital-change-readiness',
    category: 'decisions',
    service: 'business-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'customer-concentration',
    category: 'resilience',
    service: 'business-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'partnership-readiness',
    category: 'decisions',
    service: 'business-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'technology-stack-review',
    category: 'resilience',
    service: 'technology-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'platform-selection',
    category: 'decisions',
    service: 'technology-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'provider-comparison',
    category: 'decisions',
    service: 'technology-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'continuity-recovery',
    category: 'resilience',
    service: 'technology-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'cybersecurity-sourcing',
    category: 'resilience',
    service: 'technology-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'communications-modernization',
    category: 'resilience',
    service: 'technology-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'cloud-connectivity',
    category: 'resilience',
    service: 'technology-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'technology-implementation',
    category: 'execution',
    service: 'technology-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'website-refresh',
    category: 'demand',
    service: 'website-design',
    maturity: 'proven',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'lead-capture',
    category: 'demand',
    service: 'website-design',
    maturity: 'proven',
    portfolio: ['grcstatus'] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'custom-app',
    category: 'experiences',
    service: 'digital-products',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'client-portal',
    category: 'experiences',
    service: 'digital-products',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'integrations',
    category: 'automation',
    service: 'automation',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'workflow-automation',
    category: 'automation',
    service: 'automation',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'event-kit',
    category: 'demand',
    service: 'digital-events',
    maturity: 'proven',
    portfolio: ['boothlio'] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'ai-workflows',
    category: 'automation',
    service: 'digital-enablement',
    maturity: 'proven',
    portfolio: ['pitch-hotshots'] as const satisfies readonly CaseStudySlug[],
  },
] as const

export type UseCaseId = (typeof USE_CASES)[number]['id']

export const HERO_PATH_USE_CASES = {
  website: 'website-refresh',
  platform: 'custom-app',
  automation: 'integrations',
} as const satisfies Record<string, UseCaseId>

const ASSESSMENT_LANE_USE_CASES: Partial<Record<AssessmentLane, UseCaseId>> = {
  technology: 'platform-selection',
  website: 'website-refresh',
  platform: 'custom-app',
  automation: 'integrations',
  ai: 'ai-workflows',
  event: 'event-kit',
}

export type UseCasePageHref =
  | { pathname: '/use-cases' }
  | { pathname: '/use-cases'; hash: UseCaseId }

export function useCasePageHref(id: UseCaseId | 'all' = 'all'): UseCasePageHref {
  return id === 'all' ? { pathname: '/use-cases' } : { pathname: '/use-cases', hash: id }
}

export function useCaseForAssessmentResult(result: AssessmentResult): UseCaseId | 'all' | null {
  if (result.lane === 'workshop') return null

  if (result.lane === 'consulting') {
    if (result.primaryService === 'strategy') return 'strategic-priorities'
    if (result.primaryService === 'operations') return 'process-bottlenecks'
    if (result.primaryService === 'team') return 'leadership-decision-rights'
    if (result.primaryService === 'data') return 'management-dashboard'
    if (result.primaryService === 'innovation') return 'digital-change-readiness'
    return 'all'
  }

  const laneMatch = ASSESSMENT_LANE_USE_CASES[result.lane]
  if (laneMatch) return laneMatch

  return 'all'
}

export function useCaseHrefForAssessment(result: AssessmentResult): UseCasePageHref | null {
  const id = useCaseForAssessmentResult(result)
  if (id === null) return null
  return useCasePageHref(id)
}

export function isUseCaseId(value: string): value is UseCaseId {
  return USE_CASES.some((item) => item.id === value)
}

export function categoryForUseCase(id: UseCaseId): UseCaseCategory {
  return USE_CASES.find((item) => item.id === id)!.category
}

export type UseCaseScheduleQuery = {
  intent: ConsultationIntent
  focus?: string
  need?: string
}

export const USE_CASE_SCHEDULE_QUERIES: Record<UseCaseId, UseCaseScheduleQuery> = {
  'strategic-priorities': { intent: 'consulting', focus: 'strategy', need: 'strategic-priorities' },
  'process-bottlenecks': { intent: 'consulting', focus: 'operations', need: 'process-bottlenecks' },
  'founder-bottleneck': { intent: 'consulting', focus: 'operations', need: 'founder-bottleneck' },
  'leadership-decision-rights': { intent: 'consulting', focus: 'team', need: 'leadership-decision-rights' },
  'management-dashboard': { intent: 'consulting', focus: 'data', need: 'management-dashboard' },
  'profitability-capacity': { intent: 'consulting', focus: 'operations', need: 'profitability-capacity' },
  'repeatable-delivery': { intent: 'consulting', focus: 'operations', need: 'repeatable-delivery' },
  'digital-change-readiness': { intent: 'consulting', focus: 'innovation', need: 'digital-change-readiness' },
  'customer-concentration': { intent: 'consulting', focus: 'strategy', need: 'customer-concentration' },
  'partnership-readiness': { intent: 'consulting', focus: 'strategy', need: 'partnership-readiness' },
  'technology-stack-review': { intent: 'consulting', focus: 'technology', need: 'technology-stack-review' },
  'platform-selection': { intent: 'consulting', focus: 'technology', need: 'platform-selection' },
  'provider-comparison': { intent: 'consulting', focus: 'technology', need: 'provider-comparison' },
  'continuity-recovery': { intent: 'consulting', focus: 'technology', need: 'continuity-recovery' },
  'cybersecurity-sourcing': { intent: 'consulting', focus: 'technology', need: 'cybersecurity-sourcing' },
  'communications-modernization': { intent: 'consulting', focus: 'technology', need: 'communications-modernization' },
  'cloud-connectivity': { intent: 'consulting', focus: 'technology', need: 'cloud-connectivity' },
  'technology-implementation': { intent: 'consulting', focus: 'technology', need: 'technology-implementation' },
  'website-refresh': { intent: 'website', need: 'redesign' },
  'lead-capture': { intent: 'website', need: 'conversion' },
  'custom-app': { intent: 'platform' },
  'client-portal': { intent: 'platform', need: 'client-portal' },
  integrations: { intent: 'automation', need: 'integration' },
  'workflow-automation': { intent: 'automation', need: 'workflow' },
  'event-kit': { intent: 'digital-events', need: 'booth' },
  'ai-workflows': { intent: 'ai-support', need: 'exploring' },
}

export function scheduleQueryForUseCase(id: UseCaseId): UseCaseScheduleQuery {
  return USE_CASE_SCHEDULE_QUERIES[id]
}
