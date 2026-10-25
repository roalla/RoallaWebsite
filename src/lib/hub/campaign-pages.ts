export const hubCampaignPages = [
  {
    id: 'website-ai-visibility-review',
    path: '/website-ai-visibility-review',
    titleKey: 'campaignVisibilityReview',
    descKey: 'campaignVisibilityReviewDesc',
  },
  {
    id: 'digital-visibility-optimization',
    path: '/services/search-ai-visibility',
    titleKey: 'campaignVisibilityService',
    descKey: 'campaignVisibilityServiceDesc',
  },
  {
    id: 'digital-presence-snapshot',
    path: '/tools/digital-presence-snapshot',
    titleKey: 'campaignPresenceSnapshot',
    descKey: 'campaignPresenceSnapshotDesc',
  },
  {
    id: 'website-packages',
    path: '/website-package',
    titleKey: 'campaignWebsitePackages',
    descKey: 'campaignWebsitePackagesDesc',
  },
  {
    id: 'website-design',
    path: '/website-design',
    titleKey: 'campaignWebsiteDesign',
    descKey: 'campaignWebsiteDesignDesc',
  },
] as const

export function localizedCampaignPath(locale: 'en' | 'fr', path: string) {
  return `/${locale}${path}`
}
