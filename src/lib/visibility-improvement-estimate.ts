import { WEBSITE_ESTIMATE_PRICES } from '@/lib/website-estimate'

export const VISIBILITY_IMPROVEMENT_PRICES = {
  foundation: 1200,
  localMapsEssentials: 250,
  localMapsNearby: 350,
  localMapsCompete: 550,
  /** @deprecated Prefer localMapsNearby — kept for older references */
  localMaps: 350,
  offerRewrite: 450,
  monitoring: 480,
  hstRate: WEBSITE_ESTIMATE_PRICES.hstRate,
  referralDiscountRate: WEBSITE_ESTIMATE_PRICES.referralDiscountRate,
} as const

export type LocalMapsChoice = 'none' | 'essentials' | 'nearby' | 'compete'

export type VisibilityImprovementSelection = {
  localMaps: LocalMapsChoice
  offerRewrite: boolean
  monitoring: boolean
  referralDiscount: boolean
}

export const LOCAL_MAPS_PRICES: Record<LocalMapsChoice, number> = {
  none: 0,
  essentials: VISIBILITY_IMPROVEMENT_PRICES.localMapsEssentials,
  nearby: VISIBILITY_IMPROVEMENT_PRICES.localMapsNearby,
  compete: VISIBILITY_IMPROVEMENT_PRICES.localMapsCompete,
}

export const VISIBILITY_IMPROVEMENT_CORE_PRICE = VISIBILITY_IMPROVEMENT_PRICES.foundation

export function calculateVisibilityImprovementEstimate(selection: VisibilityImprovementSelection) {
  const referralDiscount = selection.referralDiscount
    ? VISIBILITY_IMPROVEMENT_CORE_PRICE * VISIBILITY_IMPROVEMENT_PRICES.referralDiscountRate
    : 0
  const localMaps = LOCAL_MAPS_PRICES[selection.localMaps]
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
    localMapsChoice: selection.localMaps,
    offerRewrite,
    monitoring,
    professionalServices,
    firstYearBeforeTax,
    hst,
    firstYearTotal: firstYearBeforeTax + hst,
  }
}
