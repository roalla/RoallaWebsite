import { pathwayEstimateCtas, pathwayEvidenceCtas } from '@/lib/pathway-evidence-cta'
import { SOLUTION_PATH_IDS } from '@/lib/solutions-by-need'

describe('pathway evidence CTAs', () => {
  it('maps a free starting point for every pathway', () => {
    SOLUTION_PATH_IDS.forEach((id) => {
      const cta = pathwayEvidenceCtas[id]
      expect(cta).toBeTruthy()
      expect(cta?.pathname).toMatch(/^\//)
      expect(cta?.label.en).toBeTruthy()
      expect(cta?.label.fr).toBeTruthy()
    })
  })

  it('maps light estimate CTAs for visibility and digital-experience pathways', () => {
    expect(pathwayEstimateCtas.visibility?.map((item) => item.pathname)).toEqual([
      '/visibility-improvement-estimate',
      '/email-reach-estimate',
    ])
    expect(pathwayEstimateCtas['digital-experience']?.map((item) => item.pathname)).toEqual([
      '/website-estimate',
    ])
    for (const locale of ['en', 'fr'] as const) {
      pathwayEstimateCtas.visibility?.forEach((item) => expect(item.label[locale]).toBeTruthy())
      pathwayEstimateCtas['digital-experience']?.forEach((item) => expect(item.label[locale]).toBeTruthy())
    }
  })
})
