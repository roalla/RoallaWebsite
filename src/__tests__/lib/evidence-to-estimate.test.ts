import {
  buildEstimateHref,
  preferEstimate,
  serializeEstimateHref,
  summarizeEvidenceForContact,
} from '@/lib/evidence-to-estimate'

describe('preferEstimate', () => {
  it('is true for insights campaign prefix', () => {
    expect(preferEstimate({ campaign: 'insights-visibility-review' })).toBe(true)
  })

  it('is true for insights_campaign conversion_source', () => {
    expect(preferEstimate({ conversion_source: 'insights_campaign' })).toBe(true)
  })

  it('is true for solutions campaign prefix', () => {
    expect(preferEstimate({ campaign: 'solutions-growth-visibility' })).toBe(true)
  })

  it('is true when entry_page is a solutions need path', () => {
    expect(preferEstimate({ entry_page: '/solutions/need/growth-visibility' })).toBe(true)
  })

  it('reads the same signals from a query string', () => {
    expect(
      preferEstimate(
        '?campaign=solutions-growth-visibility&entry_page=%2Fsolutions%2Fneed%2Fgrowth-visibility',
      ),
    ).toBe(true)
    expect(preferEstimate('?utm_source=newsletter')).toBe(false)
  })

  it('is false without insights/solutions signals', () => {
    expect(preferEstimate({ campaign: 'website-ai-visibility-review' })).toBe(false)
    expect(preferEstimate({})).toBe(false)
    expect(preferEstimate(null)).toBe(false)
  })
})

describe('buildEstimateHref', () => {
  it('preserves attribution, website, and from_tool', () => {
    const href = buildEstimateHref({
      pathname: '/visibility-improvement-estimate',
      website: 'https://example.com',
      fromTool: 'digital-presence-snapshot',
      attribution: {
        campaign: 'solutions-growth-visibility',
        conversion_source: 'solutions_group_interactive',
        entry_page: '/solutions/need/growth-visibility',
        signal: 'findability',
        selected_problem: 'website-and-ai-visibility',
      },
    })
    expect(href.pathname).toBe('/visibility-improvement-estimate')
    expect(href.query.website).toBe('https://example.com')
    expect(href.query.from_tool).toBe('digital-presence-snapshot')
    expect(href.query.campaign).toBe('solutions-growth-visibility')
    expect(href.query.conversion_source).toBe('solutions_group_interactive')
    expect(href.query.entry_page).toBe('/solutions/need/growth-visibility')
    expect(href.query.signal).toBe('findability')
    expect(href.query.selected_problem).toBe('website-and-ai-visibility')
    const serialized = serializeEstimateHref(href)
    expect(serialized.startsWith('/visibility-improvement-estimate?')).toBe(true)
    expect(serialized).toContain('website=https%3A%2F%2Fexample.com')
  })

  it('omits empty website but always sets from_tool', () => {
    const href = buildEstimateHref({
      pathname: '/email-reach-estimate',
      fromTool: 'email-reach-brief',
      attribution: { campaign: 'insights-visibility-review' },
    })
    expect(serializeEstimateHref(href)).toBe(
      '/email-reach-estimate?campaign=insights-visibility-review&from_tool=email-reach-brief',
    )
  })
})

describe('summarizeEvidenceForContact', () => {
  it('builds a compact summary line', () => {
    const summary = summarizeEvidenceForContact({
      tool: 'digital-presence-snapshot',
      domain: 'example.com',
      priorities: ['Fix title', 'Add social image', 'Improve mobile speed'],
      asOf: '2026-11-13T12:00:00.000Z',
    })
    expect(summary).toContain('digital-presence-snapshot')
    expect(summary).toContain('example.com')
    expect(summary).toContain('Fix title')
  })
})
