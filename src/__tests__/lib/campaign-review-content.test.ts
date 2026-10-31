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
    expect(campaignReviewContent['communications-modernization-review'].en.outcomeTitle).toContain('requirements summary')
    expect(campaignReviewContent['communications-modernization-review'].en.faqs).toHaveLength(5)
    expect(campaignReviewContent['communications-modernization-review'].fr.faqs).toHaveLength(5)
    expect(campaignReviewContent['one-workflow-ai-pilot'].en.intent).toBe('ai-support')
    expect(campaignReviewContent['one-workflow-ai-pilot'].fr.fit).toHaveLength(4)
  })

  it('wraps the three plain-language briefs with campaign landings', () => {
    expect(campaignReviewIds).toEqual(
      expect.arrayContaining(['email-reach-review', '90-day-execution-plan', 'capacity-pressure-review']),
    )
    expect(campaignReviewContent['email-reach-review'].en.toolPath).toBe('/tools/email-reach-brief')
    expect(campaignReviewContent['90-day-execution-plan'].en.toolPath).toBe('/tools/ninety-day-plan-brief')
    expect(campaignReviewContent['capacity-pressure-review'].en.toolPath).toBe(
      '/tools/capacity-pressure-brief',
    )
    expect(campaignReviewContent['email-reach-review'].fr.intent).toBe('visibility')
    expect(campaignReviewContent['90-day-execution-plan'].fr.intent).toBe('consulting')
    expect(campaignReviewContent['capacity-pressure-review'].fr.intent).toBe('ai-support')
  })

  it('adds connected operations, AI Employee, security coverage, and compliance readiness reviews', () => {
    expect(campaignReviewIds).toEqual(
      expect.arrayContaining([
        'connected-operations-review',
        'ai-employee-fit-review',
        'security-risk-coverage-review',
        'compliance-readiness-review',
      ]),
    )
    expect(campaignReviewContent['connected-operations-review'].en).toMatchObject({
      intent: 'consulting',
      focus: 'technology',
      servicePath: '/services/technology-advisory',
    })
    expect(campaignReviewContent['ai-employee-fit-review'].en).toMatchObject({
      intent: 'consulting',
      focus: 'technology',
    })
    expect(campaignReviewContent['security-risk-coverage-review'].fr.intent).toBe('security')
    expect(campaignReviewContent['compliance-readiness-review'].en.servicePath).toBe(
      '/services/security-risk-compliance',
    )
    expect(campaignReviewContent['compliance-readiness-review'].en.caveat).toContain('CPA firm')
    expect(JSON.stringify(campaignReviewContent['ai-employee-fit-review'])).not.toMatch(/nextiva|xbert/i)
  })
})
