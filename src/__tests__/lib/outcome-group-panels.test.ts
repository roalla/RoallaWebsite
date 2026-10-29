import {
  getOutcomeGroupPanelCopy,
  outcomeGroupPanels,
} from '@/lib/outcome-group-panels'
import type { OutcomeGroupId } from '@/lib/solution-outcome-pages'

const GROUP_IDS: OutcomeGroupId[] = [
  'growth-visibility',
  'experience-products',
  'automation-ai',
  'security-compliance',
  'execution',
]

describe('outcome group panels', () => {
  it.each(GROUP_IDS)('defines complete EN and FR copy for %s', (groupId) => {
    for (const locale of ['en', 'fr'] as const) {
      const copy = getOutcomeGroupPanelCopy(groupId, locale)
      expect(copy.resultTitle).toBeTruthy()
      expect(copy.situations).toHaveLength(3)
      expect(copy.ladderSteps).toHaveLength(3)
      expect(copy.vignetteSteps.length).toBeGreaterThanOrEqual(2)
      expect(copy.pathwayLinks.length).toBeGreaterThanOrEqual(1)
      copy.situations.forEach((situation) => {
        expect(situation.evidencePath).toMatch(/^\//)
        expect(situation.evidenceLabel).toBeTruthy()
        expect(situation.contactIntent).toBeTruthy()
      })
      if (groupId === 'growth-visibility') {
        expect(copy.evidenceMode).toBe('domain')
        expect(copy.domainLabel).toBeTruthy()
        expect(copy.domainCta).toBeTruthy()
      } else {
        expect(copy.evidenceMode).toBe('link')
      }
    }
  })

  it('exposes all five groups in the registry', () => {
    expect(Object.keys(outcomeGroupPanels).sort()).toEqual([...GROUP_IDS].sort())
  })
})
