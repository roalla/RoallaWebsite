import {
  ESTIMATE_PRICING_VERSION,
  ESTIMATE_VALIDITY_DAYS,
  formatEstimateValidityCopy,
  formatEstimateWhatHappensNext,
  getEstimateAsOfDate,
  getEstimateValidUntilDate,
} from '@/lib/estimate-commercial'

describe('estimate commercial framing', () => {
  const fixed = new Date('2026-11-12T15:00:00.000Z')

  it('versions pricing and computes a discussion window', () => {
    expect(ESTIMATE_PRICING_VERSION).toMatch(/^\d{4}\.\d{2}$/)
    expect(ESTIMATE_VALIDITY_DAYS).toBe(30)
    expect(getEstimateAsOfDate(fixed)).toBe('2026-11-12')
    expect(getEstimateValidUntilDate(fixed)).toBe('2026-12-12')
  })

  it('formats EN and FR validity and next-step copy', () => {
    expect(formatEstimateValidityCopy('en', fixed)).toContain('2026-11-12')
    expect(formatEstimateValidityCopy('en', fixed)).toContain(ESTIMATE_PRICING_VERSION)
    expect(formatEstimateValidityCopy('fr', fixed)).toContain('en vigueur')
    expect(formatEstimateWhatHappensNext('en')).toMatch(/What happens next/i)
    expect(formatEstimateWhatHappensNext('fr')).toMatch(/Ensuite/i)
  })
})
