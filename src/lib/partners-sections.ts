import type { EcosystemKey } from '@/lib/technologyEcosystem'
import { ecosystemDirectoryGroups } from '@/lib/technologyEcosystem'

export const partnersSectionPaths = [
  '/partners/strategic-relationships',
  '/partners/technology-providers',
  '/partners/delivery-platforms',
  '/partners/evaluation-standard',
  '/partners/compensation',
] as const

export type PartnersSectionPath = (typeof partnersSectionPaths)[number]

export const partnersHashRedirects: Record<string, PartnersSectionPath> = {
  'strategic-relationships': '/partners/strategic-relationships',
  'technology-providers': '/partners/technology-providers',
  'delivery-platforms': '/partners/delivery-platforms',
  'evaluation-standard': '/partners/evaluation-standard',
  compensation: '/partners/compensation',
}

export const partnersSectionNav = [
  {
    path: '/partners/strategic-relationships',
    labelKey: 'strategicRelationshipsTitle',
  },
  {
    path: '/partners/technology-providers',
    labelKey: 'technologyProvidersTitle',
  },
  {
    path: '/partners/delivery-platforms',
    labelKey: 'deliveryPlatformsTitle',
  },
  {
    path: '/partners/evaluation-standard',
    labelKey: 'standardTitle',
  },
  {
    path: '/partners/compensation',
    labelKey: 'compensationTitle',
  },
] as const

export function partnersPathForEcosystemKey(key: EcosystemKey): string {
  if (key === 'telarus') return '/partners/strategic-relationships'
  for (const group of ecosystemDirectoryGroups) {
    if ((group.keys as readonly string[]).includes(key)) {
      return `/partners/${group.id}#${key}`
    }
  }
  return '/partners'
}
