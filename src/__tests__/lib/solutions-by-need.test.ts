import { SOLUTION_PATH_IDS, solutionsByNeedContent } from '@/lib/solutions-by-need'

describe('solutions by need content', () => {
  it.each(['en', 'fr'] as const)('defines nine complete, ordered outcome pathways for %s', (locale) => {
    const pathways = solutionsByNeedContent[locale].pathways
    expect(pathways).toHaveLength(9)
    expect(pathways.map(({ id }) => id)).toEqual(SOLUTION_PATH_IDS)
    pathways.forEach((pathway) => {
      expect(pathway.navDescription).toBeTruthy()
      expect(pathway.title).toBeTruthy()
      expect(pathway.description).toBeTruthy()
      expect(pathway.signals).toHaveLength(3)
      expect(pathway.examples).toHaveLength(3)
      expect(pathway.result).toBeTruthy()
      expect(pathway.href).toMatch(/^\/(services|programs)\//)
    })
  })
})
