import {
  calculateEmailReachEstimate,
  EMAIL_REACH_CORE_PRICE,
  EMAIL_REACH_PRICES,
} from '@/lib/email-reach-estimate'
import { WEBSITE_ESTIMATE_PRICES } from '@/lib/website-estimate'

describe('email reach estimate', () => {
  it('calculates the required inbox-reach package at standard pricing', () => {
    const result = calculateEmailReachEstimate({
      microsoft365: false,
      listCleanup: false,
      authSetup: false,
      referralDiscount: false,
    })

    expect(EMAIL_REACH_CORE_PRICE).toBe(400)
    expect(result.firstYearBeforeTax).toBe(400)
    expect(result.hst).toBeCloseTo(52)
    expect(result.firstYearTotal).toBeCloseTo(452)
  })

  it('reuses shared Microsoft 365 setup and annual pricing', () => {
    expect(EMAIL_REACH_PRICES.emailSetup).toBe(WEBSITE_ESTIMATE_PRICES.emailSetup)
    expect(EMAIL_REACH_PRICES.emailAnnual).toBe(WEBSITE_ESTIMATE_PRICES.emailAnnual)

    const result = calculateEmailReachEstimate({
      microsoft365: true,
      listCleanup: true,
      authSetup: true,
      referralDiscount: true,
    })

    expect(result.referralDiscount).toBe(120)
    expect(result.emailSetup).toBe(150)
    expect(result.emailAnnual).toBe(114)
    expect(result.listCleanup).toBe(250)
    expect(result.authSetup).toBe(200)
    expect(result.firstYearBeforeTax).toBe(994)
    expect(result.firstYearTotal).toBeCloseTo(1123.22)
  })
})
