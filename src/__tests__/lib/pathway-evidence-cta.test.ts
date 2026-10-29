import { pathwayEvidenceCtas } from '@/lib/pathway-evidence-cta'
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
})
