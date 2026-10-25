import { hubCampaignPages, localizedCampaignPath } from '@/lib/hub/campaign-pages'

describe('hub campaign page shortcuts', () => {
  it('provides unique owner shortcuts for the primary customer landing pages', () => {
    expect(hubCampaignPages.map((page) => page.id)).toEqual([
      'website-ai-visibility-review',
      'digital-visibility-optimization',
      'digital-presence-snapshot',
      'website-packages',
      'website-design',
    ])
    expect(new Set(hubCampaignPages.map((page) => page.path)).size).toBe(hubCampaignPages.length)
  })

  it('builds explicit English and French customer URLs', () => {
    expect(localizedCampaignPath('en', '/website-ai-visibility-review')).toBe(
      '/en/website-ai-visibility-review',
    )
    expect(localizedCampaignPath('fr', '/website-ai-visibility-review')).toBe(
      '/fr/website-ai-visibility-review',
    )
  })
})
