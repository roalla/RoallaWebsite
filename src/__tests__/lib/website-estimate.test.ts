import { calculateWebsiteEstimate, WEBSITE_ESTIMATE_CORE_PRICE } from '@/lib/website-estimate'

const ontario = { regionId: 'CA-ON' as const }

describe('website estimate', () => {
  it('calculates the required three-year-domain estimate at standard pricing', () => {
    const result = calculateWebsiteEstimate({
      domainSource: 'new',
      domainTerm: 'three',
      email: 'none',
      emailUsers: 1,
      voice: 'none',
      voiceUsers: 1,
      social: 'none',
      hosting: 'own',
      referralDiscount: false,
      ...ontario,
    })

    expect(WEBSITE_ESTIMATE_CORE_PRICE).toBe(1350)
    expect(result.domain).toBe(75)
    expect(result.firstYearBeforeTax).toBe(1425)
    expect(result.taxTotal).toBeCloseTo(185.25)
    expect(result.firstYearTotal).toBeCloseTo(1610.25)
  })

  it('adds no domain cost when the customer already has a domain', () => {
    const result = calculateWebsiteEstimate({
      domainSource: 'existing',
      domainTerm: 'three',
      email: 'none',
      emailUsers: 1,
      voice: 'none',
      voiceUsers: 1,
      social: 'none',
      hosting: 'own',
      referralDiscount: false,
      ...ontario,
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
      voice: 'none',
      voiceUsers: 1,
      social: 'bundle',
      hosting: 'launch',
      referralDiscount: true,
      ...ontario,
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
      voice: 'none',
      voiceUsers: 1,
      social: 'none',
      hosting: 'care-lite',
      referralDiscount: true,
      ...ontario,
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
      voice: 'none',
      voiceUsers: 1,
      social: 'none',
      hosting: 'own',
      referralDiscount: false,
      ...ontario,
    })
    const google = calculateWebsiteEstimate({
      domainSource: 'existing',
      domainTerm: 'one',
      email: 'google-starter',
      emailUsers: 1,
      voice: 'none',
      voiceUsers: 1,
      social: 'none',
      hosting: 'own',
      referralDiscount: false,
      ...ontario,
    })

    expect(microsoft.emailSetup).toBe(150)
    expect(microsoft.emailAnnual).toBe(456)
    expect(microsoft.emailUsers).toBe(2)
    expect(google.emailAnnual).toBeCloseTo(110.4)
  })

  it('adds the voice setup fee and annual Canadian provider price by user', () => {
    const zoom = calculateWebsiteEstimate({
      domainSource: 'existing',
      domainTerm: 'one',
      email: 'none',
      emailUsers: 1,
      voice: 'zoom',
      voiceUsers: 2,
      social: 'none',
      hosting: 'own',
      referralDiscount: false,
      ...ontario,
    })

    expect(zoom.voiceSetup).toBe(50)
    expect(zoom.voiceAnnual).toBeCloseTo(518.4)
    expect(zoom.voiceUsers).toBe(2)
    expect(zoom.professionalServices).toBe(1400)
    expect(zoom.firstYearBeforeTax).toBeCloseTo(1918.4)
  })

  it('applies region tax schedules without changing package prices', () => {
    const base = {
      domainSource: 'existing' as const,
      domainTerm: 'one' as const,
      email: 'none' as const,
      emailUsers: 1,
      voice: 'none' as const,
      voiceUsers: 1,
      social: 'none' as const,
      hosting: 'own' as const,
      referralDiscount: false,
    }
    const on = calculateWebsiteEstimate({ ...base, regionId: 'CA-ON' })
    const ab = calculateWebsiteEstimate({ ...base, regionId: 'CA-AB' })
    const ns = calculateWebsiteEstimate({ ...base, regionId: 'CA-NS' })
    const qc = calculateWebsiteEstimate({ ...base, regionId: 'CA-QC' })
    const us = calculateWebsiteEstimate({ ...base, regionId: 'US-NY' })
    const unset = calculateWebsiteEstimate(base)

    expect(on.firstYearBeforeTax).toBe(1350)
    expect(ab.firstYearBeforeTax).toBe(1350)
    expect(on.taxTotal).toBeCloseTo(175.5)
    expect(ab.taxTotal).toBeCloseTo(67.5)
    expect(ns.taxTotal).toBeCloseTo(202.5)
    expect(qc.taxLines).toHaveLength(2)
    expect(qc.taxTotal).toBeCloseTo(1350 * (0.05 + 0.09975))
    expect(us.taxReady).toBe(true)
    expect(us.taxTotal).toBe(0)
    expect(us.firstYearTotal).toBe(1350)
    expect(unset.taxReady).toBe(false)
    expect(unset.taxTotal).toBe(0)
    expect(unset.firstYearTotal).toBe(1350)
  })
})
