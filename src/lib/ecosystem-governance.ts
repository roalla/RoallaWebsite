import { existsSync } from 'node:fs'
import path from 'node:path'
import {
  ecosystemCtas,
  ecosystemKeys,
  ecosystemLogos,
  type EcosystemKey,
} from '@/lib/technologyEcosystem'

/** Public ecosystem governance is code-backed (not Hub CRM). Hub partners remain internal contacts only. */
export const ECOSYSTEM_DISCLOSURE_EFFECTIVE = '2026-09-23'
export const ECOSYSTEM_DISCLOSURE_VERSION = '2026.09'

export type EcosystemAccessType =
  | 'advisor'
  | 'verified_supplier'
  | 'service_partner'
  | 'independent_reseller'
  | 'provider'

export type EcosystemCompensationCategory =
  | 'advisor_channel'
  | 'referral_possible'
  | 'reseller_possible'
  | 'none_listed'

export type EcosystemGeography = 'canada' | 'north_america' | 'global'

export type EcosystemAudienceTag = 'mid_market' | 'multi_site' | 'operations_heavy'

export type EcosystemGovernanceRecord = {
  accessType: EcosystemAccessType
  exclusivity: 'non_exclusive'
  geography: EcosystemGeography
  compensation: EcosystemCompensationCategory
  /** ISO year-month of last public review */
  reviewedAt: string
  audience: readonly EcosystemAudienceTag[]
}

export const ecosystemGovernance: Record<EcosystemKey, EcosystemGovernanceRecord> = {
  telarus: {
    accessType: 'advisor',
    exclusivity: 'non_exclusive',
    geography: 'north_america',
    compensation: 'advisor_channel',
    reviewedAt: '2026-10',
    audience: ['mid_market', 'multi_site', 'operations_heavy'],
  },
  fieldEffect: {
    accessType: 'verified_supplier',
    exclusivity: 'non_exclusive',
    geography: 'north_america',
    compensation: 'referral_possible',
    reviewedAt: '2026-10',
    audience: ['mid_market', 'operations_heavy'],
  },
  zoom: {
    accessType: 'verified_supplier',
    exclusivity: 'non_exclusive',
    geography: 'global',
    compensation: 'referral_possible',
    reviewedAt: '2026-10',
    audience: ['mid_market', 'multi_site'],
  },
  lunavi: {
    accessType: 'service_partner',
    exclusivity: 'non_exclusive',
    geography: 'north_america',
    compensation: 'referral_possible',
    reviewedAt: '2026-10',
    audience: ['mid_market', 'operations_heavy'],
  },
  equinix: {
    accessType: 'provider',
    exclusivity: 'non_exclusive',
    geography: 'global',
    compensation: 'referral_possible',
    reviewedAt: '2026-10',
    audience: ['multi_site', 'operations_heavy'],
  },
  terago: {
    accessType: 'provider',
    exclusivity: 'non_exclusive',
    geography: 'canada',
    compensation: 'referral_possible',
    reviewedAt: '2026-10',
    audience: ['mid_market', 'multi_site'],
  },
  thrive: {
    accessType: 'service_partner',
    exclusivity: 'non_exclusive',
    geography: 'north_america',
    compensation: 'referral_possible',
    reviewedAt: '2026-10',
    audience: ['mid_market', 'operations_heavy'],
  },
  speechLogix: {
    accessType: 'independent_reseller',
    exclusivity: 'non_exclusive',
    geography: 'north_america',
    compensation: 'reseller_possible',
    reviewedAt: '2026-10',
    audience: ['mid_market'],
  },
}

export function formatReviewedMonth(reviewedAt: string, locale: string): string {
  const [year, month] = reviewedAt.split('-').map(Number)
  if (!year || !month) return reviewedAt
  const date = new Date(Date.UTC(year, month - 1, 1))
  return date.toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** Used by tests / ops checks — verifies public assets and https CTAs. */
export function assertEcosystemPublicIntegrity(repoRoot = process.cwd()) {
  const issues: string[] = []
  for (const key of ecosystemKeys) {
    const logo = ecosystemLogos[key]
    if (logo) {
      const filePath = path.join(repoRoot, 'public', logo.src.replace(/^\//, ''))
      if (!existsSync(filePath)) issues.push(`Missing logo for ${key}: ${logo.src}`)
    }
    const cta = ecosystemCtas[key]
    if (cta?.type === 'external' && !/^https:\/\//i.test(cta.href)) {
      issues.push(`Non-https CTA for ${key}: ${cta.href}`)
    }
    if (!ecosystemGovernance[key]) issues.push(`Missing governance for ${key}`)
  }
  return issues
}
