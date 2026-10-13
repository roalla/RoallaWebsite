import { SOLUTION_PATH_IDS, solutionsByNeedContent } from '@/lib/solutions-by-need'
import { outcomeEvidence, outcomeGroups, relatedOutcomeIds } from '@/lib/solution-outcome-pages'

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

  it.each(['en', 'fr'] as const)('groups every %s outcome exactly once for guided discovery', (locale) => {
    const groupedIds = outcomeGroups[locale].flatMap((group) => group.pathwayIds)
    expect(groupedIds).toHaveLength(SOLUTION_PATH_IDS.length)
    expect(new Set(groupedIds).size).toBe(SOLUTION_PATH_IDS.length)
    expect(groupedIds).toEqual(expect.arrayContaining([...SOLUTION_PATH_IDS]))
  })

  it('keeps related outcomes and published evidence on valid routes', () => {
    SOLUTION_PATH_IDS.forEach((id) => {
      expect(relatedOutcomeIds[id]).toHaveLength(2)
      relatedOutcomeIds[id].forEach((relatedId) => {
        expect(SOLUTION_PATH_IDS).toContain(relatedId)
        expect(relatedId).not.toBe(id)
      })
    })

    Object.values(outcomeEvidence).flat().forEach((item) => {
      expect(['grcstatus', 'pitch-hotshots', 'boothlio', 'unjargonit']).toContain(item?.slug)
    })
  })
})
