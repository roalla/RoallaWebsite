import {
  ESTIMATE_REGION_OPTIONS,
  applyEstimateTax,
  getEstimateTaxSchedule,
  getRegionConsiderations,
} from '@/lib/estimate-regions'

describe('estimate regions and tax', () => {
  it('exposes Canada, US, and other region options', () => {
    expect(ESTIMATE_REGION_OPTIONS.some((item) => item.id === 'CA-ON')).toBe(true)
    expect(ESTIMATE_REGION_OPTIONS.some((item) => item.id === 'US-CA')).toBe(true)
    expect(ESTIMATE_REGION_OPTIONS.some((item) => item.id === 'other')).toBe(true)
  })

  it('keeps tax unset until a region is selected', () => {
    const schedule = getEstimateTaxSchedule(null)
    expect(schedule.ready).toBe(false)
    expect(schedule.lines).toHaveLength(0)
    expect(applyEstimateTax(1000, null).firstYearTotal).toBe(1000)
  })

  it('applies Canadian place-of-supply style rates', () => {
    expect(applyEstimateTax(1000, 'CA-ON').taxTotal).toBeCloseTo(130)
    expect(applyEstimateTax(1000, 'CA-NS').taxTotal).toBeCloseTo(150)
    expect(applyEstimateTax(1000, 'CA-AB').taxTotal).toBeCloseTo(50)
    const qc = applyEstimateTax(1000, 'CA-QC')
    expect(qc.taxLines.map((line) => line.id)).toEqual(['gst', 'qst'])
    expect(qc.taxTotal).toBeCloseTo(149.75)
  })

  it('quotes GST only for BC/SK/MB and flags provincial sales tax maybe applies', () => {
    const bc = getEstimateTaxSchedule('CA-BC')
    expect(bc.ready).toBe(true)
    expect(bc.lines).toHaveLength(1)
    expect(bc.provincialSalesTaxMaybeApplies).toBe(true)
    expect(applyEstimateTax(1000, 'CA-BC').taxTotal).toBeCloseTo(50)
  })

  it('does not invent US sales tax amounts', () => {
    const us = applyEstimateTax(1000, 'US-TX')
    expect(us.taxReady).toBe(true)
    expect(us.taxTotal).toBe(0)
    expect(us.firstYearTotal).toBe(1000)
    expect(getRegionConsiderations('en', 'US-TX').length).toBeGreaterThan(0)
  })
})
