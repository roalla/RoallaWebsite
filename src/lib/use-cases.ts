import type { AssessmentLane, AssessmentResult } from '@/lib/assessment'
import type { ConsultationIntent } from '@/lib/consultation-request'
import type { CaseStudySlug } from '@/lib/portfolio-case-studies'
import type { OutcomeGroupId } from '@/lib/solution-outcome-pages'
import type { SolutionPathId } from '@/lib/solutions-by-need'

export const USE_CASE_MATURITY_LEVELS = ['proven', 'established', 'ready'] as const
export type UseCaseMaturity = (typeof USE_CASE_MATURITY_LEVELS)[number]

export const USE_CASE_CATEGORIES = [
  'decisions',
  'operations',
  'growth',
  'risk',
] as const
export type UseCaseCategory = (typeof USE_CASE_CATEGORIES)[number]

export const USE_CASE_FAMILIES = ['build-grow', 'strategy-risk'] as const
export type UseCaseFamily = (typeof USE_CASE_FAMILIES)[number]

export type UseCaseFilter = UseCaseCategory | 'featured'
export type UseCaseFamilyFilter = UseCaseFamily | 'all'

export const USE_CASE_SERVICE_KEYS = [
  'business-advisory',
  'technology-advisory',
  'website-design',
  'digital-products',
  'automation',
  'digital-events',
  'digital-enablement',
  'ai-agents',
  'search-ai-visibility',
  'workshops',
  'managed-optimization',
] as const
export type UseCaseServiceKey = (typeof USE_CASE_SERVICE_KEYS)[number]

export const USE_CASE_SERVICE_HREFS = {
  'business-advisory': '/services/business-advisory',
  'technology-advisory': '/services/technology-advisory',
  'website-design': '/website-design',
  'digital-products': '/services/digital-products',
  automation: '/services/automation',
  'digital-events': '/services/digital-events',
  'digital-enablement': '/services/digital',
  'ai-agents': '/services/ai-agents',
  'search-ai-visibility': '/services/search-ai-visibility',
  workshops: '/programs/workshops',
  'managed-optimization': '/services/managed-optimization',
} as const satisfies Record<UseCaseServiceKey, string>

export const USE_CASE_INDUSTRIES = [
  'professional-services',
  'trades-field',
  'retail-hospitality',
  'healthcare-wellness',
  'nonprofit-public',
  'technology-saas',
  'manufacturing-ops',
  'general-smb',
] as const
export type UseCaseIndustry = (typeof USE_CASE_INDUSTRIES)[number]

export const USE_CASE_TECHNOLOGIES = [
  'websites',
  'communications',
  'cloud-migration',
  'security-mdr',
  'automation',
  'ai-employee',
  'iot-tracking',
  'pos-checkout',
  'data-ai',
  'search-visibility',
] as const
export type UseCaseTechnology = (typeof USE_CASE_TECHNOLOGIES)[number]

type UseCaseDefinition = {
  id: string
  category: UseCaseCategory
  outcomeGroup: OutcomeGroupId
  pathwaySlug?: SolutionPathId
  industries: readonly UseCaseIndustry[]
  technologies: readonly UseCaseTechnology[]
  service: UseCaseServiceKey
  maturity: UseCaseMaturity
  portfolio: readonly CaseStudySlug[]
}

export const USE_CASES = [
  {
    id: 'strategic-priorities',
    outcomeGroup: 'execution',
    pathwaySlug: 'strategy',
    industries: ['general-smb', 'professional-services', 'nonprofit-public', 'technology-saas'],
    technologies: [],
    category: 'decisions',
    service: 'business-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'process-bottlenecks',
    outcomeGroup: 'execution',
    pathwaySlug: 'strategy',
    industries: ['general-smb', 'manufacturing-ops', 'trades-field', 'professional-services'],
    technologies: ['automation'],
    category: 'operations',
    service: 'business-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'founder-bottleneck',
    outcomeGroup: 'execution',
    pathwaySlug: 'strategy',
    industries: ['general-smb', 'trades-field', 'professional-services', 'retail-hospitality'],
    technologies: [],
    category: 'operations',
    service: 'business-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'leadership-decision-rights',
    outcomeGroup: 'execution',
    pathwaySlug: 'strategy',
    industries: ['general-smb', 'professional-services', 'nonprofit-public', 'healthcare-wellness'],
    technologies: [],
    category: 'operations',
    service: 'business-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'management-dashboard',
    outcomeGroup: 'execution',
    pathwaySlug: 'strategy',
    industries: ['general-smb', 'professional-services', 'retail-hospitality', 'manufacturing-ops'],
    technologies: ['data-ai'],
    category: 'operations',
    service: 'business-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'profitability-capacity',
    outcomeGroup: 'execution',
    pathwaySlug: 'strategy',
    industries: ['professional-services', 'trades-field', 'general-smb'],
    technologies: ['data-ai'],
    category: 'operations',
    service: 'business-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'repeatable-delivery',
    outcomeGroup: 'execution',
    pathwaySlug: 'strategy',
    industries: ['professional-services', 'trades-field', 'technology-saas', 'manufacturing-ops'],
    technologies: ['automation'],
    category: 'operations',
    service: 'business-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'digital-change-readiness',
    outcomeGroup: 'execution',
    pathwaySlug: 'strategy',
    industries: ['general-smb', 'nonprofit-public', 'healthcare-wellness'],
    technologies: ['automation'],
    category: 'decisions',
    service: 'business-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'customer-concentration',
    outcomeGroup: 'execution',
    pathwaySlug: 'strategy',
    industries: ['professional-services', 'technology-saas', 'manufacturing-ops'],
    technologies: [],
    category: 'risk',
    service: 'business-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'partnership-readiness',
    outcomeGroup: 'execution',
    pathwaySlug: 'strategy',
    industries: ['technology-saas', 'professional-services', 'general-smb'],
    technologies: [],
    category: 'decisions',
    service: 'business-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'technology-stack-review',
    outcomeGroup: 'security-compliance',
    pathwaySlug: 'cloud-infrastructure',
    industries: ['general-smb', 'professional-services', 'healthcare-wellness'],
    technologies: ['cloud-migration', 'security-mdr'],
    category: 'risk',
    service: 'technology-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'platform-selection',
    outcomeGroup: 'security-compliance',
    pathwaySlug: 'cloud-infrastructure',
    industries: ['general-smb', 'retail-hospitality', 'healthcare-wellness'],
    technologies: ['cloud-migration', 'pos-checkout'],
    category: 'decisions',
    service: 'technology-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'provider-comparison',
    outcomeGroup: 'execution',
    pathwaySlug: 'cloud-infrastructure',
    industries: ['general-smb', 'retail-hospitality', 'nonprofit-public'],
    technologies: ['communications', 'cloud-migration', 'security-mdr'],
    category: 'decisions',
    service: 'technology-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'continuity-recovery',
    outcomeGroup: 'security-compliance',
    pathwaySlug: 'security',
    industries: ['healthcare-wellness', 'professional-services', 'retail-hospitality', 'manufacturing-ops'],
    technologies: ['cloud-migration', 'security-mdr'],
    category: 'risk',
    service: 'technology-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'cybersecurity-sourcing',
    outcomeGroup: 'security-compliance',
    pathwaySlug: 'security',
    industries: ['healthcare-wellness', 'professional-services', 'nonprofit-public', 'technology-saas'],
    technologies: ['security-mdr'],
    category: 'risk',
    service: 'technology-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'communications-modernization',
    outcomeGroup: 'experience-products',
    pathwaySlug: 'communications',
    industries: ['general-smb', 'healthcare-wellness', 'retail-hospitality', 'professional-services'],
    technologies: ['communications'],
    category: 'risk',
    service: 'technology-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'cloud-connectivity',
    outcomeGroup: 'security-compliance',
    pathwaySlug: 'cloud-infrastructure',
    industries: ['manufacturing-ops', 'retail-hospitality', 'trades-field'],
    technologies: ['cloud-migration'],
    category: 'risk',
    service: 'technology-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'technology-implementation',
    outcomeGroup: 'execution',
    pathwaySlug: 'cloud-infrastructure',
    industries: ['general-smb', 'healthcare-wellness', 'manufacturing-ops'],
    technologies: ['cloud-migration', 'automation'],
    category: 'operations',
    service: 'technology-advisory',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'website-refresh',
    outcomeGroup: 'experience-products',
    pathwaySlug: 'digital-experience',
    industries: ['professional-services', 'trades-field', 'retail-hospitality', 'healthcare-wellness'],
    technologies: ['websites'],
    category: 'growth',
    service: 'website-design',
    maturity: 'proven',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'lead-capture',
    outcomeGroup: 'growth-visibility',
    pathwaySlug: 'visibility',
    industries: ['professional-services', 'trades-field', 'healthcare-wellness', 'retail-hospitality'],
    technologies: ['websites', 'automation'],
    category: 'growth',
    service: 'website-design',
    maturity: 'proven',
    portfolio: ['grcstatus'] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'custom-app',
    outcomeGroup: 'experience-products',
    pathwaySlug: 'digital-experience',
    industries: ['technology-saas', 'retail-hospitality', 'manufacturing-ops', 'healthcare-wellness'],
    technologies: ['websites', 'automation'],
    category: 'growth',
    service: 'digital-products',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'client-portal',
    outcomeGroup: 'experience-products',
    pathwaySlug: 'digital-experience',
    industries: ['professional-services', 'healthcare-wellness', 'nonprofit-public'],
    technologies: ['websites', 'automation'],
    category: 'growth',
    service: 'digital-products',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'integrations',
    outcomeGroup: 'automation-ai',
    pathwaySlug: 'automation-ai',
    industries: ['retail-hospitality', 'manufacturing-ops', 'trades-field', 'general-smb'],
    technologies: ['automation', 'pos-checkout'],
    category: 'operations',
    service: 'automation',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'workflow-automation',
    outcomeGroup: 'automation-ai',
    pathwaySlug: 'automation-ai',
    industries: ['general-smb', 'trades-field', 'professional-services', 'manufacturing-ops'],
    technologies: ['automation'],
    category: 'operations',
    service: 'automation',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'event-kit',
    outcomeGroup: 'experience-products',
    pathwaySlug: 'digital-experience',
    industries: ['retail-hospitality', 'nonprofit-public', 'technology-saas', 'professional-services'],
    technologies: ['websites', 'automation'],
    category: 'growth',
    service: 'digital-events',
    maturity: 'proven',
    portfolio: ['boothlio'] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'ai-workflows',
    outcomeGroup: 'automation-ai',
    pathwaySlug: 'automation-ai',
    industries: ['professional-services', 'technology-saas', 'retail-hospitality', 'general-smb'],
    technologies: ['ai-employee', 'automation'],
    category: 'operations',
    service: 'ai-agents',
    maturity: 'proven',
    portfolio: ['pitch-hotshots'] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'human-agent-operating-model',
    outcomeGroup: 'automation-ai',
    pathwaySlug: 'automation-ai',
    industries: ['professional-services', 'technology-saas', 'general-smb'],
    technologies: ['ai-employee'],
    category: 'operations',
    service: 'business-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'search-ai-visibility',
    outcomeGroup: 'growth-visibility',
    pathwaySlug: 'visibility',
    industries: ['professional-services', 'trades-field', 'retail-hospitality', 'healthcare-wellness'],
    technologies: ['search-visibility', 'websites'],
    category: 'growth',
    service: 'search-ai-visibility',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'data-ai-readiness',
    outcomeGroup: 'automation-ai',
    pathwaySlug: 'automation-ai',
    industries: ['technology-saas', 'healthcare-wellness', 'manufacturing-ops', 'professional-services'],
    technologies: ['data-ai', 'ai-employee'],
    category: 'decisions',
    service: 'technology-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'shadow-ai-risk',
    outcomeGroup: 'security-compliance',
    pathwaySlug: 'security',
    industries: ['professional-services', 'healthcare-wellness', 'technology-saas', 'nonprofit-public'],
    technologies: ['ai-employee', 'security-mdr', 'data-ai'],
    category: 'risk',
    service: 'technology-advisory',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'managed-optimization',
    outcomeGroup: 'growth-visibility',
    pathwaySlug: 'visibility',
    industries: ['professional-services', 'retail-hospitality', 'trades-field', 'general-smb'],
    technologies: ['websites', 'search-visibility'],
    category: 'growth',
    service: 'managed-optimization',
    maturity: 'established',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
  {
    id: 'technology-adoption',
    outcomeGroup: 'execution',
    pathwaySlug: 'automation-ai',
    industries: ['general-smb', 'nonprofit-public', 'healthcare-wellness'],
    technologies: ['automation', 'ai-employee'],
    category: 'operations',
    service: 'workshops',
    maturity: 'ready',
    portfolio: [] as const satisfies readonly CaseStudySlug[],
  },
] as const satisfies readonly UseCaseDefinition[]

export type UseCaseId = (typeof USE_CASES)[number]['id']

export const FEATURED_USE_CASE_IDS = [
  'strategic-priorities',
  'process-bottlenecks',
  'website-refresh',
  'ai-workflows',
  'search-ai-visibility',
  'cybersecurity-sourcing',
] as const satisfies readonly UseCaseId[]

const BUILD_GROW_SERVICES = new Set<UseCaseServiceKey>([
  'website-design',
  'digital-products',
  'automation',
  'digital-events',
  'digital-enablement',
  'ai-agents',
  'search-ai-visibility',
  'managed-optimization',
])

export function familyForService(service: UseCaseServiceKey): UseCaseFamily {
  return BUILD_GROW_SERVICES.has(service) ? 'build-grow' : 'strategy-risk'
}

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
  agentic: 'ai-workflows',
  visibility: 'search-ai-visibility',
  event: 'event-kit',
  workshop: 'technology-adoption',
}

export type UseCasePageHref =
  | { pathname: '/use-cases' }
  | { pathname: '/use-cases'; hash: UseCaseId }

export function useCasePageHref(id: UseCaseId | 'all' = 'all'): UseCasePageHref {
  return id === 'all' ? { pathname: '/use-cases' } : { pathname: '/use-cases', hash: id }
}

export function useCaseForAssessmentResult(result: AssessmentResult): UseCaseId | 'all' | null {
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
  'human-agent-operating-model': { intent: 'consulting', focus: 'operations', need: 'human-agent-operating-model' },
  'search-ai-visibility': { intent: 'visibility', need: 'search-ai-visibility' },
  'data-ai-readiness': { intent: 'ai-support', need: 'data-ai-readiness' },
  'shadow-ai-risk': { intent: 'consulting', focus: 'technology', need: 'shadow-ai-risk' },
  'managed-optimization': { intent: 'visibility', need: 'managed-optimization' },
  'technology-adoption': { intent: 'workshop', need: 'technology-adoption' },
}

export function scheduleQueryForUseCase(id: UseCaseId): UseCaseScheduleQuery {
  return USE_CASE_SCHEDULE_QUERIES[id]
}
