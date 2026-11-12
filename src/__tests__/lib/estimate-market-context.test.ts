import {
  getEstimateConsiderations,
  getPlatformConsiderations,
  resolveEstimateMarketId,
} from '@/lib/estimate-market-context'

describe('estimate market context', () => {
  it('resolves market from hub id or label', () => {
    expect(resolveEstimateMarketId('en', 'legal')).toBe('legal')
    expect(resolveEstimateMarketId('en', 'Legal')).toBe('legal')
    expect(resolveEstimateMarketId('fr', 'Juridique')).toBe('legal')
    expect(resolveEstimateMarketId('en', 'not-a-market')).toBeNull()
  })

  it('builds considerations when market or region is set', () => {
    const items = getEstimateConsiderations({
      locale: 'en',
      marketId: 'legal',
      regionId: 'CA-ON',
      tool: 'website',
    })
    expect(items.length).toBeGreaterThan(0)
    expect(items.length).toBeLessThanOrEqual(5)
  })

  it('shows platform contrast on website and visibility even without market', () => {
    const website = getEstimateConsiderations({
      locale: 'en',
      marketId: null,
      regionId: null,
      tool: 'website',
    })
    const visibility = getEstimateConsiderations({
      locale: 'en',
      marketId: null,
      regionId: null,
      tool: 'visibility',
    })
    const joined = [...website, ...visibility].join(' ')
    expect(joined).toMatch(/WordPress|Wix|GoDaddy/)
    expect(joined).toMatch(/ROALLA/)
    expect(website).toHaveLength(2)
    expect(visibility).toHaveLength(2)
    expect(getPlatformConsiderations('fr', 'website').join(' ')).toMatch(/WordPress|Wix|GoDaddy/)
  })

  it('omits platform bullets for email estimates', () => {
    expect(getPlatformConsiderations('en', 'email')).toEqual([])
    expect(
      getEstimateConsiderations({
        locale: 'en',
        marketId: null,
        regionId: null,
        tool: 'email',
      }),
    ).toEqual([])
  })
})
