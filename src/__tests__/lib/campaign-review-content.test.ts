import { campaignReviewContent, campaignReviewIds, getCampaignReview } from '@/lib/campaign-review-content'

describe('campaign review landing pages', () => {
  it('provides complete English and French content for every campaign', () => {
    for (const id of campaignReviewIds) {
      for (const locale of ['en', 'fr'] as const) {
        const page = campaignReviewContent[id][locale]
        expect(page.path).toBe(`/${id}`)
        expect(page.signals.length).toBeGreaterThanOrEqual(4)
        expect(page.reviewItems.length).toBeGreaterThanOrEqual(6)
        expect(page.outcomes).toHaveLength(3)
        expect(page.fit.length).toBeGreaterThanOrEqual(4)
        expect(page.faqs.length).toBeGreaterThanOrEqual(3)
        expect(page.servicePath).toMatch(/^\/services\//)
        expect(page.toolPath).toMatch(/^\/(assessment|tools\/)/)
      }
    }
  })

  it('rejects unknown campaign routes', () => {
    expect(getCampaignReview('not-a-campaign', 'en')).toBeNull()
  })

  it('includes direct bilingual communications and one-workflow offers', () => {
    expect(campaignReviewIds).toEqual(expect.arrayContaining([
      'communications-modernization-review',
      'one-workflow-ai-pilot',
    ]))
    expect(campaignReviewContent['communications-modernization-review'].en.caveat).toContain('Telarus')
    expect(campaignReviewContent['communications-modernization-review'].fr.caveat).toContain('Telarus')
    expect(campaignReviewContent['one-workflow-ai-pilot'].en.intent).toBe('ai-support')
    expect(campaignReviewContent['one-workflow-ai-pilot'].fr.fit).toHaveLength(4)
  })
})
