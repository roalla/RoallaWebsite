export const hubCampaignPages = [
  {
    id: 'website-ai-visibility-review',
    path: '/website-ai-visibility-review',
    titleKey: 'campaignVisibilityReview',
    descKey: 'campaignVisibilityReviewDesc',
  },
  {
    id: 'technology-decision-review',
    path: '/technology-decision-review',
    titleKey: 'campaignTechnologyDecisionReview',
    descKey: 'campaignTechnologyDecisionReviewDesc',
  },
  {
    id: 'ai-agent-readiness-review',
    path: '/ai-agent-readiness-review',
    titleKey: 'campaignAiAgentReadinessReview',
    descKey: 'campaignAiAgentReadinessReviewDesc',
  },
  {
    id: 'automation-opportunity-review',
    path: '/automation-opportunity-review',
    titleKey: 'campaignAutomationOpportunityReview',
    descKey: 'campaignAutomationOpportunityReviewDesc',
  },
  {
    id: 'digital-product-discovery',
    path: '/digital-product-discovery',
    titleKey: 'campaignDigitalProductDiscovery',
    descKey: 'campaignDigitalProductDiscoveryDesc',
  },
  {
    id: 'digital-event-readiness-review',
    path: '/digital-event-readiness-review',
    titleKey: 'campaignDigitalEventReadinessReview',
    descKey: 'campaignDigitalEventReadinessReviewDesc',
  },
  {
    id: 'digital-asset-health-review',
    path: '/digital-asset-health-review',
    titleKey: 'campaignDigitalAssetHealthReview',
    descKey: 'campaignDigitalAssetHealthReviewDesc',
  },
  {
    id: 'connected-operations-review',
    path: '/connected-operations-review',
    titleKey: 'campaignConnectedOperationsReview',
    descKey: 'campaignConnectedOperationsReviewDesc',
  },
  {
    id: 'ai-employee-fit-review',
    path: '/ai-employee-fit-review',
    titleKey: 'campaignAiEmployeeFitReview',
    descKey: 'campaignAiEmployeeFitReviewDesc',
  },
  {
    id: 'security-risk-coverage-review',
    path: '/security-risk-coverage-review',
    titleKey: 'campaignSecurityRiskCoverageReview',
    descKey: 'campaignSecurityRiskCoverageReviewDesc',
  },
  {
    id: 'compliance-readiness-review',
    path: '/compliance-readiness-review',
    titleKey: 'campaignComplianceReadinessReview',
    descKey: 'campaignComplianceReadinessReviewDesc',
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
