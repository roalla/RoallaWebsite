import { calculateWebsiteEstimate, WEBSITE_ESTIMATE_CORE_PRICE } from '@/lib/website-estimate'

describe('website estimate', () => {
  it('calculates the required three-year-domain estimate at standard pricing', () => {
    const result = calculateWebsiteEstimate({
      domainSource: 'new',
      domainTerm: 'three',
      email: 'none',
      emailUsers: 1,
      social: 'none',
      hosting: 'own',
      referralDiscount: false,
    })

    expect(WEBSITE_ESTIMATE_CORE_PRICE).toBe(1350)
    expect(result.domain).toBe(75)
    expect(result.firstYearBeforeTax).toBe(1425)
    expect(result.hst).toBeCloseTo(185.25)
    expect(result.firstYearTotal).toBeCloseTo(1610.25)
  })

  it('adds no domain cost when the customer already has a domain', () => {
    const result = calculateWebsiteEstimate({
      domainSource: 'existing',
      domainTerm: 'three',
      email: 'none',
      emailUsers: 1,
      social: 'none',
      hosting: 'own',
      referralDiscount: false,
    })

    expect(result.domain).toBe(0)
    expect(result.firstYearBeforeTax).toBe(1350)
    expect(result.firstYearTotal).toBeCloseTo(1525.5)
  })

  it('applies the 30 percent referral discount only to core services', () => {
    const result = calculateWebsiteEstimate({
      domainSource: 'new',
      domainTerm: 'three',
      email: 'microsoft-basic',
      emailUsers: 1,
      social: 'bundle',
      hosting: 'launch',
      referralDiscount: true,
    })

    expect(result.referralDiscount).toBe(405)
    expect(result.emailSetup).toBe(150)
    expect(result.emailAnnual).toBe(114)
    expect(result.socialSetup).toBe(300)
    expect(result.hostingFirstYear).toBe(179)
    expect(result.firstYearBeforeTax).toBe(1763)
    expect(result.firstYearTotal).toBeCloseTo(1992.19)
  })

  it('projects monthly care over the first year', () => {
    const result = calculateWebsiteEstimate({
      domainSource: 'new',
      domainTerm: 'one',
      email: 'none',
      emailUsers: 1,
      social: 'none',
      hosting: 'care-lite',
      referralDiscount: true,
    })

    expect(result.hostingFirstYear).toBe(588)
    expect(result.firstYearBeforeTax).toBe(1563)
  })

  it('prices email licensing by provider and mailbox count', () => {
    const microsoft = calculateWebsiteEstimate({
      domainSource: 'existing',
      domainTerm: 'one',
      email: 'microsoft-standard',
      emailUsers: 2,
      social: 'none',
      hosting: 'own',
      referralDiscount: false,
    })
    const google = calculateWebsiteEstimate({
      domainSource: 'existing',
      domainTerm: 'one',
      email: 'google-starter',
      emailUsers: 1,
      social: 'none',
      hosting: 'own',
      referralDiscount: false,
    })

    expect(microsoft.emailSetup).toBe(150)
    expect(microsoft.emailAnnual).toBe(456)
    expect(microsoft.emailUsers).toBe(2)
    expect(google.emailAnnual).toBeCloseTo(110.4)
  })
})
