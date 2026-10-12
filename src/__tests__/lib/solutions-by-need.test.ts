import { SOLUTION_PATH_IDS, solutionsByNeedContent } from '@/lib/solutions-by-need'

describe('solutions by need content', () => {
  it.each(['en', 'fr'] as const)('defines eight unique, ordered pathways for %s', (locale) => {
    const pathways = solutionsByNeedContent[locale].pathways
    expect(pathways).toHaveLength(8)
    expect(pathways.map(({ id }) => id)).toEqual(SOLUTION_PATH_IDS)
    expect(new Set(pathways.map(({ href }) => href)).size).toBe(8)
    pathways.forEach((pathway) => {
      expect(pathway.title).toBeTruthy()
      expect(pathway.description).toBeTruthy()
      expect(pathway.signals).toHaveLength(3)
      expect(pathway.href).toMatch(/^\/(services|programs)\//)
    })
  })
})
