import { ESTIMATE_DEFAULT_REGION } from '@/hooks/useEstimateMarketRegion'
import { applyEstimateTax } from '@/lib/estimate-regions'

describe('estimate market region defaults', () => {
  it('defaults estimators to Canada Ontario', () => {
    expect(ESTIMATE_DEFAULT_REGION).toBe('CA-ON')
    expect(applyEstimateTax(1000, ESTIMATE_DEFAULT_REGION).taxTotal).toBeCloseTo(130)
  })
})
