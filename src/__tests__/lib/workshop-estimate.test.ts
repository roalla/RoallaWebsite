import {
  WORKSHOP_DURATION_PRICES,
  WORKSHOP_ESTIMATE_PRICES,
  calculateWorkshopEstimate,
} from '@/lib/workshop-estimate'

const ontario = { regionId: 'CA-ON' as const }

describe('workshop estimate', () => {
  it('prices the three duration SKUs', () => {
    expect(WORKSHOP_DURATION_PRICES['one-hour']).toBe(400)
    expect(WORKSHOP_DURATION_PRICES['half-day']).toBe(1000)
    expect(WORKSHOP_DURATION_PRICES['full-day']).toBe(2000)
  })

  it('calculates a half-day in-zone session with Ontario tax', () => {
    const result = calculateWorkshopEstimate({
      duration: 'half-day',
      delivery: 'in-person',
      outsideTravelZone: false,
      materials: false,
      bilingual: false,
      followUp: false,
      customAgenda: false,
      recording: false,
      participantBand: 'up-to-16',
      referralDiscount: false,
      ...ontario,
    })

    expect(result.session).toBe(1000)
    expect(result.hours).toBe(3)
    expect(result.beforeTax).toBe(1000)
    expect(result.taxTotal).toBeCloseTo(130)
    expect(result.total).toBeCloseTo(1130)
    expect(result.outsideTravelZone).toBe(false)
    expect(result.travelFeeAmount).toBe(0)
  })

  it('adds market add-ons and the 17–30 participant surcharge', () => {
    const result = calculateWorkshopEstimate({
      duration: 'one-hour',
      delivery: 'virtual',
      outsideTravelZone: true,
      materials: true,
      bilingual: true,
      followUp: true,
      customAgenda: true,
      recording: true,
      participantBand: '17-30',
      referralDiscount: false,
      ...ontario,
    })

    expect(result.session).toBe(400)
    expect(result.materials).toBe(200)
    expect(result.bilingual).toBe(350)
    expect(result.followUp).toBe(350)
    expect(result.customAgenda).toBe(400)
    expect(result.recording).toBe(250)
    expect(result.participantSurcharge).toBe(300)
    expect(result.beforeTax).toBe(2250)
    expect(result.outsideTravelZone).toBe(false)
  })

  it('applies referral only to the session fee', () => {
    const result = calculateWorkshopEstimate({
      duration: 'full-day',
      delivery: 'in-person',
      outsideTravelZone: true,
      materials: true,
      bilingual: false,
      followUp: false,
      customAgenda: false,
      recording: false,
      participantBand: 'up-to-16',
      referralDiscount: true,
      ...ontario,
    })

    expect(result.referralDiscount).toBe(WORKSHOP_ESTIMATE_PRICES.fullDay * 0.3)
    expect(result.materials).toBe(200)
    expect(result.beforeTax).toBe(2000 - 600 + 200)
    expect(result.outsideTravelZone).toBe(true)
    expect(result.travelFeeAmount).toBe(0)
  })

  it('flags groups over 30 without inventing a price', () => {
    const result = calculateWorkshopEstimate({
      duration: 'half-day',
      delivery: 'virtual',
      outsideTravelZone: false,
      materials: false,
      bilingual: false,
      followUp: false,
      customAgenda: false,
      recording: false,
      participantBand: 'over-30',
      referralDiscount: false,
      ...ontario,
    })

    expect(result.participantSurcharge).toBe(0)
    expect(result.largeGroupNeedsQuote).toBe(true)
    expect(result.beforeTax).toBe(1000)
  })
})
