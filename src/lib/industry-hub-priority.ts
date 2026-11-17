import type { IndustryHubId, IndustryHubServiceKey } from '@/lib/industry-hub-content'
import type { InsightSlug } from '@/lib/insights'
import type { UseCaseId } from '@/lib/use-cases'

export const FEATURED_INDUSTRY_HUB_IDS = [
  'it-msp',
  'trades-field',
  'legal',
  'accounting-tax',
  'care-practices',
  'manufacturing',
  'real-estate-property',
  'insurance-brokerage',
] as const satisfies readonly IndustryHubId[]

export type FeaturedIndustryHubId = (typeof FEATURED_INDUSTRY_HUB_IDS)[number]

export type IndustryStartHereTarget =
  | 'ai-employee'
  | 'fit-brief'
  | 'security'
  | 'communications'
  | 'assessment'

export type IndustryHubProof =
  | { kind: 'insight'; slug: InsightSlug }
  | { kind: 'use-case'; slug: UseCaseId }

export type IndustryHubPriority = {
  leadServices: readonly [IndustryHubServiceKey, IndustryHubServiceKey]
  startHereTarget: IndustryStartHereTarget
  proof: IndustryHubProof
}

/** Service display order used when expanding “also relevant”. */
export const INDUSTRY_SERVICE_ORDER: readonly IndustryHubServiceKey[] = [
  'aiEmployee',
  'security',
  'ucaas',
  'ccaas',
  'cloudMigration',
  'automation',
  'visibility',
  'websites',
]

export const INDUSTRY_HUB_PRIORITY: Record<IndustryHubId, IndustryHubPriority> = {
  'it-msp': {
    leadServices: ['aiEmployee', 'security'],
    startHereTarget: 'fit-brief',
    proof: { kind: 'insight', slug: 'it-provider-who-owns-risk' },
  },
  'recruiting-staffing': {
    leadServices: ['aiEmployee', 'ucaas'],
    startHereTarget: 'ai-employee',
    proof: { kind: 'insight', slug: 'hire-or-fix-the-work-first' },
  },
  'trades-field': {
    leadServices: ['aiEmployee', 'visibility'],
    startHereTarget: 'ai-employee',
    proof: { kind: 'use-case', slug: 'lead-capture' },
  },
  'transportation-logistics': {
    leadServices: ['aiEmployee', 'ucaas'],
    startHereTarget: 'communications',
    proof: { kind: 'use-case', slug: 'communications-modernization' },
  },
  warehouses: {
    leadServices: ['aiEmployee', 'cloudMigration'],
    startHereTarget: 'ai-employee',
    proof: { kind: 'use-case', slug: 'workflow-automation' },
  },
  'care-practices': {
    leadServices: ['aiEmployee', 'security'],
    startHereTarget: 'fit-brief',
    proof: { kind: 'insight', slug: 'personal-information-stop-collecting' },
  },
  manufacturing: {
    leadServices: ['aiEmployee', 'cloudMigration'],
    startHereTarget: 'security',
    proof: { kind: 'insight', slug: 'twelve-month-technology-roadmap' },
  },
  legal: {
    leadServices: ['aiEmployee', 'security'],
    startHereTarget: 'fit-brief',
    proof: { kind: 'insight', slug: 'client-boundaries-without-damaging-relationships' },
  },
  'accounting-tax': {
    leadServices: ['aiEmployee', 'security'],
    startHereTarget: 'fit-brief',
    proof: { kind: 'insight', slug: 'measure-software-business-value' },
  },
  'real-estate-property': {
    leadServices: ['aiEmployee', 'visibility'],
    startHereTarget: 'ai-employee',
    proof: { kind: 'insight', slug: 'sales-pipeline-or-list-of-contacts' },
  },
  veterinary: {
    leadServices: ['aiEmployee', 'ucaas'],
    startHereTarget: 'ai-employee',
    proof: { kind: 'use-case', slug: 'communications-modernization' },
  },
  'insurance-brokerage': {
    leadServices: ['aiEmployee', 'security'],
    startHereTarget: 'fit-brief',
    proof: { kind: 'insight', slug: 'should-you-say-yes-to-this-opportunity' },
  },
  'immigration-settlement': {
    leadServices: ['aiEmployee', 'security'],
    startHereTarget: 'ai-employee',
    proof: { kind: 'insight', slug: 'structured-data-for-small-business' },
  },
  'home-care-seniors': {
    leadServices: ['aiEmployee', 'ucaas'],
    startHereTarget: 'fit-brief',
    proof: { kind: 'insight', slug: 'can-business-operate-two-weeks-without-you' },
  },
  'municipal-public': {
    leadServices: ['aiEmployee', 'security'],
    startHereTarget: 'assessment',
    proof: { kind: 'use-case', slug: 'cybersecurity-sourcing' },
  },
}

export function relatedServicesForIndustry(id: IndustryHubId): IndustryHubServiceKey[] {
  const lead = new Set(INDUSTRY_HUB_PRIORITY[id].leadServices)
  return INDUSTRY_SERVICE_ORDER.filter((key) => !lead.has(key))
}

export function isFeaturedIndustryHubId(id: string): boolean {
  return (FEATURED_INDUSTRY_HUB_IDS as readonly string[]).includes(id)
}
