import type { AssessmentLane, AssessmentResult } from '@/lib/assessment'
import type { ConsultationIntent } from '@/lib/consultation-request'
import type { CaseStudySlug } from '@/lib/portfolio-case-studies'

export const USE_CASE_MATURITY_LEVELS = ['proven', 'established', 'ready'] as const
export type UseCaseMaturity = (typeof USE_CASE_MATURITY_LEVELS)[number]

export const USE_CASE_CATEGORIES = [
  'websites',
  'apps',
  'automation',
  'events',
  'ai',
] as const
export type UseCaseCategory = (typeof USE_CASE_CATEGORIES)[number]

export type UseCaseFilter = UseCaseCategory | 'all'

export const USE_CASES = [
  {
    id: 'website-refresh',
    category: 'websites',
    maturity: 'proven',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'lead-capture',
    category: 'websites',
    maturity: 'proven',
    portfolio: ['grcstatus'] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'custom-app',
    category: 'apps',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'client-portal',
    category: 'apps',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'integrations',
    category: 'automation',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'workflow-automation',
    category: 'automation',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'event-kit',
    category: 'events',
    maturity: 'proven',
    portfolio: ['boothlio'] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'ai-workflows',
    category: 'ai',
    maturity: 'proven',
    portfolio: ['business-cocoon', 'pitch-hotshots'] as const satisfies readonly CaseStudySlug[],
  },
] as const

export type UseCaseId = (typeof USE_CASES)[number]['id']

export const HERO_PATH_USE_CASES = {
  website: 'website-refresh',
  platform: 'custom-app',
  automation: 'integrations',
} as const satisfies Record<string, UseCaseId>

const ASSESSMENT_LANE_USE_CASES: Partial<Record<AssessmentLane, UseCaseId>> = {
  website: 'website-refresh',
  platform: 'custom-app',
  event: 'event-kit',
  unsure: 'website-refresh',
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
    if (result.primaryService === 'digital' || result.primaryService === 'innovation') {
      return 'ai-workflows'
    }
    if (result.primaryService === 'operations') return 'workflow-automation'
    return null
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
  need?: string
}

export const USE_CASE_SCHEDULE_QUERIES: Record<UseCaseId, UseCaseScheduleQuery> = {
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