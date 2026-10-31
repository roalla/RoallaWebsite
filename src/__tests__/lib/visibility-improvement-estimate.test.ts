import {
  calculateVisibilityImprovementEstimate,
  VISIBILITY_IMPROVEMENT_CORE_PRICE,
} from '@/lib/visibility-improvement-estimate'

describe('visibility improvement estimate', () => {
  it('calculates the required foundation at standard pricing', () => {
    const result = calculateVisibilityImprovementEstimate({
      localMaps: false,
      offerRewrite: false,
      monitoring: false,
      referralDiscount: false,
    })

    expect(VISIBILITY_IMPROVEMENT_CORE_PRICE).toBe(1200)
    expect(result.firstYearBeforeTax).toBe(1200)
    expect(result.hst).toBeCloseTo(156)
    expect(result.firstYearTotal).toBeCloseTo(1356)
  })

  it('applies the 30 percent referral discount only to the foundation', () => {
    const result = calculateVisibilityImprovementEstimate({
      localMaps: true,
      offerRewrite: true,
      monitoring: true,
      referralDiscount: true,
    })

    expect(result.referralDiscount).toBe(360)
    expect(result.localMaps).toBe(350)
    expect(result.offerRewrite).toBe(450)
    expect(result.monitoring).toBe(480)
    expect(result.firstYearBeforeTax).toBe(2120)
    expect(result.firstYearTotal).toBeCloseTo(2395.6)
  })
})
