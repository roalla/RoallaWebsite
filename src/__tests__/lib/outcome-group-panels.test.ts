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
      const expectedCount =
        groupId === 'growth-visibility' || groupId === 'automation-ai' ? 4 : 3
      expect(copy.situations).toHaveLength(expectedCount)
      expect(copy.ladderSteps).toHaveLength(3)
      expect(copy.vignetteSteps.length).toBeGreaterThanOrEqual(2)
      expect(copy.pathwayLinks.length).toBeGreaterThanOrEqual(1)
      copy.situations.forEach((situation) => {
        expect(situation.evidencePath).toMatch(/^\//)
        expect(situation.evidenceLabel).toBeTruthy()
        expect(situation.contactIntent).toBeTruthy()
        expect(situation.typicalCauses).toHaveLength(2)
        expect(situation.roallaHelp).toBeTruthy()
        expect(situation.evidenceNote).toBeTruthy()
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

  it('defaults each group’s first situation to the planned signal', () => {
    expect(getOutcomeGroupPanelCopy('growth-visibility', 'en').situations[0].id).toBe('findability')
    expect(getOutcomeGroupPanelCopy('experience-products', 'en').situations[0].id).toBe(
      'website-or-product',
    )
    expect(getOutcomeGroupPanelCopy('automation-ai', 'en').situations[0].id).toBe('repetitive-work')
    expect(getOutcomeGroupPanelCopy('security-compliance', 'en').situations[0].id).toBe(
      'security-gaps',
    )
    expect(getOutcomeGroupPanelCopy('execution', 'en').situations[0].id).toBe('too-many-priorities')
  })

  it.each(['en', 'fr'] as const)('includes email deliverability in the growth pathway for %s', (locale) => {
    const copy = getOutcomeGroupPanelCopy('growth-visibility', locale)
    const situation = copy.situations.find((item) => item.id === 'email-deliverability')

    expect(situation).toMatchObject({
      evidencePath: '/tools/email-reach-brief',
      evidenceLabel:
        locale === 'fr' ? 'Vérifier si vos courriels passent' : 'Check if your emails are getting through',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
    })
    expect(copy.channels.some((channel) => channel.id === 'email')).toBe(true)
  })

  it.each(['en', 'fr'] as const)('remaps key tiles to plain-language evidence paths for %s', (locale) => {
    const growth = getOutcomeGroupPanelCopy('growth-visibility', locale)
    const experience = getOutcomeGroupPanelCopy('experience-products', locale)
    const automation = getOutcomeGroupPanelCopy('automation-ai', locale)
    const execution = getOutcomeGroupPanelCopy('execution', locale)

    expect(growth.situations.find((item) => item.id === 'ai-clarity')?.evidencePath).toBe(
      '/website-ai-visibility-review',
    )
    expect(experience.situations.find((item) => item.id === 'customer-journey')?.evidencePath).toBe(
      '/digital-asset-health-review',
    )
    expect(automation.situations.map((item) => item.id)).toEqual([
      'repetitive-work',
      'staffing-capacity',
      'peak-continuity',
      'iot-ops',
    ])
    expect(automation.situations.find((item) => item.id === 'staffing-capacity')?.evidencePath).toBe(
      '/tools/capacity-pressure-brief',
    )
    expect(automation.situations.find((item) => item.id === 'peak-continuity')?.evidencePath).toBe(
      '/tools/capacity-pressure-brief',
    )
    execution.situations.forEach((situation) => {
      expect(situation.evidencePath).toBe('/tools/ninety-day-plan-brief')
    })
  })
})
