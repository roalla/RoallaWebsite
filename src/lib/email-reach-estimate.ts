import {
  EMAIL_ANNUAL_PRICES,
  WEBSITE_ESTIMATE_PRICES,
  type EmailChoice,
} from '@/lib/website-estimate'

export const EMAIL_REACH_PRICES = {
  reachReview: 400,
  emailSetup: WEBSITE_ESTIMATE_PRICES.emailSetup,
  emailAnnual: WEBSITE_ESTIMATE_PRICES.emailAnnual,
  listCleanup: 250,
  authSetup: 200,
  hstRate: WEBSITE_ESTIMATE_PRICES.hstRate,
  referralDiscountRate: WEBSITE_ESTIMATE_PRICES.referralDiscountRate,
} as const

export type EmailReachEstimateSelection = {
  email: EmailChoice
  emailUsers: number
  listCleanup: boolean
  authSetup: boolean
  referralDiscount: boolean
}

export const EMAIL_REACH_CORE_PRICE = EMAIL_REACH_PRICES.reachReview

export function calculateEmailReachEstimate(selection: EmailReachEstimateSelection) {
  const referralDiscount = selection.referralDiscount
    ? EMAIL_REACH_CORE_PRICE * EMAIL_REACH_PRICES.referralDiscountRate
    : 0
  const hasEmail = selection.email !== 'none'
  const emailUsers = hasEmail ? Math.max(1, Math.floor(selection.emailUsers || 1)) : 0
  const emailSetup = hasEmail ? EMAIL_REACH_PRICES.emailSetup : 0
  const emailAnnual = EMAIL_ANNUAL_PRICES[selection.email] * emailUsers
  const listCleanup = selection.listCleanup ? EMAIL_REACH_PRICES.listCleanup : 0
  const authSetup = selection.authSetup ? EMAIL_REACH_PRICES.authSetup : 0

  const professionalServices = EMAIL_REACH_CORE_PRICE + emailSetup + listCleanup + authSetup
  const firstYearBeforeTax = professionalServices - referralDiscount + emailAnnual
  const hst = firstYearBeforeTax * EMAIL_REACH_PRICES.hstRate

  return {
    core: EMAIL_REACH_CORE_PRICE,
    referralDiscount,
    emailSetup,
    emailAnnual,
    emailUsers,
    listCleanup,
    authSetup,
    professionalServices,
    firstYearBeforeTax,
    hst,
    firstYearTotal: firstYearBeforeTax + hst,
  }
}
