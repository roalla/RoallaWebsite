import { applyEstimateTax } from '@/lib/estimate-regions'
import { WEBSITE_ESTIMATE_PRICES } from '@/lib/website-estimate'

export const WORKSHOP_ESTIMATE_PRICES = {
  oneHour: 400,
  halfDay: 1000,
  fullDay: 2000,
  materials: 200,
  bilingual: 350,
  followUp: 350,
  customAgenda: 400,
  recording: 250,
  participantSurcharge: 300,
  includedParticipants: 16,
  maxParticipantsPriced: 30,
  referralDiscountRate: WEBSITE_ESTIMATE_PRICES.referralDiscountRate,
  /** @deprecated Tax comes from applyEstimateTax / customer region. */
  hstRate: WEBSITE_ESTIMATE_PRICES.hstRate,
} as const

export type WorkshopDuration = 'one-hour' | 'half-day' | 'full-day'
export type WorkshopDelivery = 'in-person' | 'virtual'
export type WorkshopParticipantBand = 'up-to-16' | '17-30' | 'over-30'

export const WORKSHOP_DURATION_HOURS: Record<WorkshopDuration, number> = {
  'one-hour': 1,
  'half-day': 3,
  'full-day': 6,
}

export const WORKSHOP_DURATION_PRICES: Record<WorkshopDuration, number> = {
  'one-hour': WORKSHOP_ESTIMATE_PRICES.oneHour,
  'half-day': WORKSHOP_ESTIMATE_PRICES.halfDay,
  'full-day': WORKSHOP_ESTIMATE_PRICES.fullDay,
}

export type WorkshopEstimateSelection = {
  duration: WorkshopDuration
  delivery: WorkshopDelivery
  /** Only meaningful for in-person; ignored for virtual. */
  outsideTravelZone: boolean
  materials: boolean
  bilingual: boolean
  followUp: boolean
  customAgenda: boolean
  recording: boolean
  participantBand: WorkshopParticipantBand
  referralDiscount: boolean
  regionId?: string | null
}

export function calculateWorkshopEstimate(selection: WorkshopEstimateSelection) {
  const session = WORKSHOP_DURATION_PRICES[selection.duration]
  const referralDiscount = selection.referralDiscount
    ? session * WORKSHOP_ESTIMATE_PRICES.referralDiscountRate
    : 0

  const materials = selection.materials ? WORKSHOP_ESTIMATE_PRICES.materials : 0
  const bilingual = selection.bilingual ? WORKSHOP_ESTIMATE_PRICES.bilingual : 0
  const followUp = selection.followUp ? WORKSHOP_ESTIMATE_PRICES.followUp : 0
  const customAgenda = selection.customAgenda ? WORKSHOP_ESTIMATE_PRICES.customAgenda : 0
  const recording = selection.recording ? WORKSHOP_ESTIMATE_PRICES.recording : 0
  const participantSurcharge =
    selection.participantBand === '17-30' ? WORKSHOP_ESTIMATE_PRICES.participantSurcharge : 0
  const largeGroupNeedsQuote = selection.participantBand === 'over-30'
  const outsideTravelZone =
    selection.delivery === 'in-person' && selection.outsideTravelZone

  const professionalServices =
    session + materials + bilingual + followUp + customAgenda + recording + participantSurcharge
  const beforeTax = professionalServices - referralDiscount
  const tax = applyEstimateTax(beforeTax, selection.regionId)

  return {
    session,
    hours: WORKSHOP_DURATION_HOURS[selection.duration],
    referralDiscount,
    materials,
    bilingual,
    followUp,
    customAgenda,
    recording,
    participantSurcharge,
    largeGroupNeedsQuote,
    outsideTravelZone,
    travelFeeAmount: 0,
    professionalServices,
    beforeTax,
    firstYearBeforeTax: beforeTax,
    taxReady: tax.taxReady,
    taxLines: tax.taxLines,
    taxTotal: tax.taxTotal,
    taxNote: tax.taxNote,
    provincialSalesTaxMaybeApplies: tax.provincialSalesTaxMaybeApplies,
    hst: tax.taxTotal,
    firstYearTotal: tax.firstYearTotal,
    total: tax.firstYearTotal,
  }
}
