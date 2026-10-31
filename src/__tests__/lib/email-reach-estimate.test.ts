import {
  calculateEmailReachEstimate,
  EMAIL_REACH_CORE_PRICE,
  EMAIL_REACH_PRICES,
} from '@/lib/email-reach-estimate'
import { EMAIL_ANNUAL_PRICES, WEBSITE_ESTIMATE_PRICES } from '@/lib/website-estimate'

const base = {
  email: 'none',
  emailUsers: 1,
  listCleanup: false,
  authSetup: false,
  referralDiscount: false,
} as const

describe('email reach estimate', () => {
  it('calculates the required inbox-reach package at standard pricing', () => {
    const result = calculateEmailReachEstimate(base)

    expect(EMAIL_REACH_CORE_PRICE).toBe(400)
    expect(result.emailSetup).toBe(0)
    expect(result.emailAnnual).toBe(0)
    expect(result.firstYearBeforeTax).toBe(400)
    expect(result.hst).toBeCloseTo(52)
    expect(result.firstYearTotal).toBeCloseTo(452)
  })

  it('reuses shared website-estimate setup and annual pricing', () => {
    expect(EMAIL_REACH_PRICES.emailSetup).toBe(WEBSITE_ESTIMATE_PRICES.emailSetup)
    expect(EMAIL_REACH_PRICES.emailAnnual).toBe(WEBSITE_ESTIMATE_PRICES.emailAnnual)

    const result = calculateEmailReachEstimate({
      ...base,
      email: 'microsoft-basic',
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

  it('multiplies annual licences by user count for each provider', () => {
    const standard = calculateEmailReachEstimate({ ...base, email: 'microsoft-standard', emailUsers: 3 })
    expect(standard.emailUsers).toBe(3)
    expect(standard.emailSetup).toBe(150)
    expect(standard.emailAnnual).toBe(EMAIL_ANNUAL_PRICES['microsoft-standard'] * 3)
    expect(standard.firstYearBeforeTax).toBe(400 + 150 + 228 * 3)

    const google = calculateEmailReachEstimate({ ...base, email: 'google-starter', emailUsers: 2 })
    expect(google.emailAnnual).toBeCloseTo(WEBSITE_ESTIMATE_PRICES.googleWorkspaceStarterAnnual * 2)
  })

  it('charges setup but no licences for another provider', () => {
    const result = calculateEmailReachEstimate({ ...base, email: 'other', emailUsers: 4 })
    expect(result.emailSetup).toBe(150)
    expect(result.emailAnnual).toBe(0)
    expect(result.firstYearBeforeTax).toBe(550)
  })

  it('ignores user count when no email is selected and clamps to at least one user', () => {
    expect(calculateEmailReachEstimate({ ...base, emailUsers: 10 }).emailAnnual).toBe(0)
    const result = calculateEmailReachEstimate({ ...base, email: 'microsoft-basic', emailUsers: 0 })
    expect(result.emailUsers).toBe(1)
    expect(result.emailAnnual).toBe(114)
  })
})
