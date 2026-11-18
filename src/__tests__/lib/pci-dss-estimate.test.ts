import { calculatePciDssEstimate, PCI_DSS_ESTIMATE_PRICES } from '@/lib/pci-dss-estimate'

const focusedInput = {
  entityType: 'merchant' as const,
  channels: ['ecommerce' as const],
  integration: 'hosted-redirect' as const,
  cardDataHandling: 'no' as const,
  environmentSize: 'single' as const,
  evidenceReadiness: 'partial' as const,
  supportLevel: 'readiness' as const,
  regionId: 'CA-ON',
}

describe('PCI DSS readiness estimate', () => {
  it('prices a focused outsourced-checkout merchant review at $1,995 before tax', () => {
    const estimate = calculatePciDssEstimate(focusedInput)
    expect(estimate.tier).toBe('focused')
    expect(estimate.subtotalLow).toBe(PCI_DSS_ESTIMATE_PRICES.focused)
    expect(estimate.subtotalHigh).toBe(PCI_DSS_ESTIMATE_PRICES.focused)
    expect(estimate.totalLow).toBeCloseTo(2254.35)
  })

  it('uses the multi-channel range when scope spans payment environments', () => {
    const estimate = calculatePciDssEstimate({
      ...focusedInput,
      channels: ['ecommerce', 'terminal'],
      environmentSize: 'multiple',
    })
    expect(estimate.tier).toBe('multi-channel')
    expect(estimate.subtotalLow).toBe(3500)
    expect(estimate.subtotalHigh).toBe(6500)
  })

  it.each([
    { entityType: 'service-provider' as const },
    { cardDataHandling: 'yes' as const },
    { integration: 'custom' as const },
    { supportLevel: 'implementation-support' as const },
  ])('requires custom scope for higher-risk inputs', (override) => {
    const estimate = calculatePciDssEstimate({ ...focusedInput, ...override })
    expect(estimate.tier).toBe('custom')
    expect(estimate.requiresCustomScope).toBe(true)
    expect(estimate.subtotalLow).toBe(7500)
  })
})
