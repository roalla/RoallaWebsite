import { WEBSITE_ESTIMATE_PRICES } from '@/lib/website-estimate'

export const VISIBILITY_IMPROVEMENT_PRICES = {
  foundation: 1200,
  localMaps: 350,
  offerRewrite: 450,
  monitoring: 480,
  hstRate: WEBSITE_ESTIMATE_PRICES.hstRate,
  referralDiscountRate: WEBSITE_ESTIMATE_PRICES.referralDiscountRate,
} as const

export type VisibilityImprovementSelection = {
  localMaps: boolean
  offerRewrite: boolean
  monitoring: boolean
  referralDiscount: boolean
}

export const VISIBILITY_IMPROVEMENT_CORE_PRICE = VISIBILITY_IMPROVEMENT_PRICES.foundation

export function calculateVisibilityImprovementEstimate(selection: VisibilityImprovementSelection) {
  const referralDiscount = selection.referralDiscount
    ? VISIBILITY_IMPROVEMENT_CORE_PRICE * VISIBILITY_IMPROVEMENT_PRICES.referralDiscountRate
    : 0
  const localMaps = selection.localMaps ? VISIBILITY_IMPROVEMENT_PRICES.localMaps : 0
  const offerRewrite = selection.offerRewrite ? VISIBILITY_IMPROVEMENT_PRICES.offerRewrite : 0
  const monitoring = selection.monitoring ? VISIBILITY_IMPROVEMENT_PRICES.monitoring : 0

  const professionalServices =
    VISIBILITY_IMPROVEMENT_CORE_PRICE + localMaps + offerRewrite + monitoring
  const firstYearBeforeTax = professionalServices - referralDiscount
  const hst = firstYearBeforeTax * VISIBILITY_IMPROVEMENT_PRICES.hstRate

  return {
    core: VISIBILITY_IMPROVEMENT_CORE_PRICE,
    referralDiscount,
    localMaps,
    offerRewrite,
    monitoring,
    professionalServices,
    firstYearBeforeTax,
    hst,
    firstYearTotal: firstYearBeforeTax + hst,
  }
}
