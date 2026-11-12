import {
  calculateVisibilityImprovementEstimate,
  VISIBILITY_IMPROVEMENT_CORE_PRICE,
  VISIBILITY_IMPROVEMENT_PRICES,
} from '@/lib/visibility-improvement-estimate'

const ontario = { regionId: 'CA-ON' as const }

describe('visibility improvement estimate', () => {
  it('calculates the required foundation at standard pricing', () => {
    const result = calculateVisibilityImprovementEstimate({
      localMaps: 'none',
      offerRewrite: false,
      monitoring: false,
      referralDiscount: false,
      ...ontario,
    })

    expect(VISIBILITY_IMPROVEMENT_CORE_PRICE).toBe(1200)
    expect(result.firstYearBeforeTax).toBe(1200)
    expect(result.taxTotal).toBeCloseTo(156)
    expect(result.firstYearTotal).toBeCloseTo(1356)
  })

  it('prices the three Google Maps options separately', () => {
    expect(
      calculateVisibilityImprovementEstimate({
        localMaps: 'essentials',
        offerRewrite: false,
        monitoring: false,
        referralDiscount: false,
        ...ontario,
      }).localMaps,
    ).toBe(VISIBILITY_IMPROVEMENT_PRICES.localMapsEssentials)

    expect(
      calculateVisibilityImprovementEstimate({
        localMaps: 'nearby',
        offerRewrite: false,
        monitoring: false,
        referralDiscount: false,
        ...ontario,
      }).localMaps,
    ).toBe(VISIBILITY_IMPROVEMENT_PRICES.localMapsNearby)

    expect(
      calculateVisibilityImprovementEstimate({
        localMaps: 'compete',
        offerRewrite: false,
        monitoring: false,
        referralDiscount: false,
        ...ontario,
      }).localMaps,
    ).toBe(VISIBILITY_IMPROVEMENT_PRICES.localMapsCompete)
  })

  it('applies the 30 percent referral discount only to the foundation', () => {
    const result = calculateVisibilityImprovementEstimate({
      localMaps: 'nearby',
      offerRewrite: true,
      monitoring: true,
      referralDiscount: true,
      ...ontario,
    })

    expect(result.referralDiscount).toBe(360)
    expect(result.localMaps).toBe(350)
    expect(result.offerRewrite).toBe(450)
    expect(result.monitoring).toBe(480)
    expect(result.firstYearBeforeTax).toBe(2120)
    expect(result.firstYearTotal).toBeCloseTo(2395.6)
  })
})
