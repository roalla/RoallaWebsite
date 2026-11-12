import {
  getEstimateConsiderations,
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
    expect(items.length).toBeLessThanOrEqual(4)
  })

  it('omits considerations when market and region are unset', () => {
    expect(
      getEstimateConsiderations({
        locale: 'en',
        marketId: null,
        regionId: null,
        tool: 'website',
      }),
    ).toEqual([])
  })
})
