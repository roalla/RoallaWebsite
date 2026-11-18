import { applyEstimateTax } from '@/lib/estimate-regions'

export type PciEntityType = 'merchant' | 'service-provider' | 'unsure'
export type PciPaymentChannel = 'ecommerce' | 'moto' | 'terminal' | 'payment-link'
export type PciIntegration = 'hosted-redirect' | 'embedded' | 'provider-script' | 'custom' | 'unknown'
export type PciCardDataHandling = 'no' | 'uncertain' | 'yes'
export type PciEnvironmentSize = 'single' | 'multiple'
export type PciEvidenceReadiness = 'organized' | 'partial' | 'limited'
export type PciSupportLevel = 'readiness' | 'remediation-plan' | 'implementation-support'

export type PciDssEstimateInput = {
  entityType: PciEntityType
  channels: PciPaymentChannel[]
  integration: PciIntegration
  cardDataHandling: PciCardDataHandling
  environmentSize: PciEnvironmentSize
  evidenceReadiness: PciEvidenceReadiness
  supportLevel: PciSupportLevel
  regionId?: string | null
}

export type PciDssEstimateTier = 'focused' | 'multi-channel' | 'custom'

export const PCI_DSS_ESTIMATE_PRICES = {
  focused: 1995,
  multiChannelLow: 3500,
  multiChannelHigh: 6500,
  customFrom: 7500,
} as const

export function calculatePciDssEstimate(input: PciDssEstimateInput) {
  const channels = Array.from(new Set(input.channels))
  const requiresCustomScope =
    input.entityType === 'service-provider' ||
    input.cardDataHandling === 'yes' ||
    input.integration === 'custom' ||
    input.supportLevel === 'implementation-support'

  const isFocused =
    !requiresCustomScope &&
    input.entityType === 'merchant' &&
    input.cardDataHandling === 'no' &&
    input.environmentSize === 'single' &&
    channels.length === 1 &&
    (input.integration === 'hosted-redirect' || input.integration === 'provider-script') &&
    input.supportLevel === 'readiness'

  const tier: PciDssEstimateTier = requiresCustomScope
    ? 'custom'
    : isFocused
      ? 'focused'
      : 'multi-channel'
  const subtotalLow =
    tier === 'focused'
      ? PCI_DSS_ESTIMATE_PRICES.focused
      : tier === 'custom'
        ? PCI_DSS_ESTIMATE_PRICES.customFrom
        : PCI_DSS_ESTIMATE_PRICES.multiChannelLow
  const subtotalHigh =
    tier === 'multi-channel' ? PCI_DSS_ESTIMATE_PRICES.multiChannelHigh : subtotalLow
  const lowTax = applyEstimateTax(subtotalLow, input.regionId)
  const highTax = applyEstimateTax(subtotalHigh, input.regionId)

  return {
    tier,
    requiresCustomScope,
    subtotalLow,
    subtotalHigh,
    totalLow: lowTax.firstYearTotal,
    totalHigh: highTax.firstYearTotal,
    taxReady: lowTax.taxReady,
    taxLinesLow: lowTax.taxLines,
    taxLinesHigh: highTax.taxLines,
    taxNote: lowTax.taxNote,
    provincialSalesTaxMaybeApplies: lowTax.provincialSalesTaxMaybeApplies,
  }
}
