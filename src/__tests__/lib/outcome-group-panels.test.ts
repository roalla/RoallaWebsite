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

const SITUATION_COUNTS: Record<OutcomeGroupId, number> = {
  'growth-visibility': 5,
  'experience-products': 6,
  'automation-ai': 4,
  'security-compliance': 6,
  execution: 3,
}

describe('outcome group panels', () => {
  it.each(GROUP_IDS)('defines complete EN and FR copy for %s', (groupId) => {
    for (const locale of ['en', 'fr'] as const) {
      const copy = getOutcomeGroupPanelCopy(groupId, locale)
      expect(copy.resultTitle).toBeTruthy()
      expect(copy.situations).toHaveLength(SITUATION_COUNTS[groupId])
      expect(copy.ladderSteps).toHaveLength(3)
      expect(copy.vignetteSteps.length).toBeGreaterThanOrEqual(2)
      expect(copy.pathwayLinks.length).toBeGreaterThanOrEqual(1)
      expect(copy.detailIssuesLabel).toBeTruthy()
      expect(copy.detailApproachLabel).toBeTruthy()
      expect(copy.detailSolutionsLabel).toBeTruthy()
      copy.situations.forEach((situation) => {
        expect(situation.evidencePath).toMatch(/^\//)
        expect(situation.evidenceLabel).toBeTruthy()
        expect(situation.contactIntent).toBeTruthy()
        expect(situation.detail.issues.length).toBeGreaterThanOrEqual(2)
        expect(situation.detail.approach).toBeTruthy()
        expect(situation.detail.solutions.length).toBeGreaterThanOrEqual(2)
        situation.detail.issues.forEach((issue) => expect(issue).toBeTruthy())
        situation.detail.solutions.forEach((solution) => expect(solution).toBeTruthy())
        expect(situation.typicalCauses).toHaveLength(2)
        expect(situation.roallaHelp).toBeTruthy()
        expect(situation.evidenceNote).toBeTruthy()
      })
      if (groupId === 'growth-visibility') {
        expect(copy.evidenceMode).toBe('link')
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
    expect(getOutcomeGroupPanelCopy('growth-visibility', 'en').situations[0].id).toBe('no-presence')
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
      estimatePath: '/email-reach-estimate',
      estimateLabel:
        locale === 'fr'
          ? 'Estimer la configuration et la portée courriel'
          : 'Estimate email setup and reach work',
      pathwaySlug: 'visibility',
      contactIntent: 'visibility',
    })
    expect(situation?.evidencePath).toBe('/tools/email-reach-brief')
  })

  it.each(['en', 'fr'] as const)(
    'wires visibility estimate secondary CTAs for findability and AI clarity in %s',
    (locale) => {
      const copy = getOutcomeGroupPanelCopy('growth-visibility', locale)
      const findability = copy.situations.find((item) => item.id === 'findability')
      const aiClarity = copy.situations.find((item) => item.id === 'ai-clarity')

      expect(findability).toMatchObject({
        estimatePath: '/visibility-improvement-estimate',
        estimateLabel:
          locale === 'fr' ? 'Estimer l’investissement d’amélioration' : 'Estimate improvement investment',
      })
      expect(aiClarity).toMatchObject({
        estimatePath: '/visibility-improvement-estimate',
        estimateLabel:
          locale === 'fr' ? 'Estimer l’investissement d’amélioration' : 'Estimate improvement investment',
      })
      expect(copy.evidenceMode).toBe('link')
    },
  )

  it.each(['en', 'fr'] as const)(
    'wires website launch estimate secondary CTA on experience website-or-product for %s',
    (locale) => {
      const situation = getOutcomeGroupPanelCopy('experience-products', locale).situations.find(
        (item) => item.id === 'website-or-product',
      )

      expect(situation).toMatchObject({
        estimatePath: '/website-estimate',
        estimateLabel:
          locale === 'fr' ? 'Estimer un forfait de lancement Web' : 'Estimate a website launch package',
      })
    },
  )

  it.each(['en', 'fr'] as const)(
    'routes no online presence on growth-visibility to the website launch estimate for %s',
    (locale) => {
      const situation = getOutcomeGroupPanelCopy('growth-visibility', locale).situations.find(
        (item) => item.id === 'no-presence',
      )

      expect(situation).toMatchObject({
        evidencePath: '/website-estimate',
        evidenceLabel:
          locale === 'fr' ? 'Estimer un forfait de lancement Web' : 'Estimate a website launch package',
        pathwaySlug: 'digital-experience',
        contactIntent: 'website',
      })
    },
  )

  it.each(['en', 'fr'] as const)('uses capacity pressures instead of AI jargon for automation %s', (locale) => {
    const copy = getOutcomeGroupPanelCopy('automation-ai', locale)
    const ids = copy.situations.map((item) => item.id)

    expect(ids).toEqual(['repetitive-work', 'staffing-capacity', 'peak-continuity', 'iot-ops'])
    expect(ids).not.toContain('ai-agent')

    expect(copy.situations.find((item) => item.id === 'staffing-capacity')).toMatchObject({
      evidencePath: '/ai-agent-readiness-review',
      pathwaySlug: 'automation-ai',
      contactIntent: 'ai-support',
    })
    expect(copy.situations.find((item) => item.id === 'peak-continuity')).toMatchObject({
      evidencePath: '/automation-opportunity-review',
      pathwaySlug: 'automation-ai',
      contactIntent: 'ai-support',
    })
  })

  it.each(['en', 'fr'] as const)('adds phone, AI Employee, and point-of-sale situations to experience for %s', (locale) => {
    const copy = getOutcomeGroupPanelCopy('experience-products', locale)

    expect(copy.situations.map((item) => item.id)).toEqual([
      'website-or-product',
      'customer-journey',
      'communications',
      'phone-ip-uc',
      'ai-employee',
      'point-of-sale',
    ])
    expect(copy.situations.find((item) => item.id === 'phone-ip-uc')).toMatchObject({
      evidencePath: '/tools/communications-value-brief',
      pathwaySlug: 'communications',
      contactIntent: 'consulting',
      contactFocus: 'technology',
    })
    expect(copy.situations.find((item) => item.id === 'ai-employee')).toMatchObject({
      evidencePath: '/ai-employee-fit-review',
      pathwaySlug: 'communications',
      contactIntent: 'consulting',
      contactFocus: 'technology',
    })
    expect(copy.situations.find((item) => item.id === 'point-of-sale')).toMatchObject({
      evidencePath: '/digital-product-discovery',
      pathwaySlug: 'digital-experience',
      contactIntent: 'platform',
    })
    expect(JSON.stringify(copy)).not.toMatch(/nextiva|xbert/i)
  })

  it.each(['en', 'fr'] as const)('routes iot-ops to the connected operations review for %s', (locale) => {
    const situation = getOutcomeGroupPanelCopy('automation-ai', locale).situations.find(
      (item) => item.id === 'iot-ops',
    )

    expect(situation).toMatchObject({
      evidencePath: '/connected-operations-review',
      pathwaySlug: 'iot',
      contactIntent: 'consulting',
      contactFocus: 'technology',
    })
    expect(situation?.detail.solutions.some((item) => item.includes('Signal →'))).toBe(true)
  })

  it.each(['en', 'fr'] as const)('adds coverage and compliance situations to security for %s', (locale) => {
    const copy = getOutcomeGroupPanelCopy('security-compliance', locale)
    const byId = (id: string) => copy.situations.find((item) => item.id === id)

    expect(copy.situations.map((item) => item.id)).toEqual([
      'security-gaps',
      'active-threat-coverage',
      'security-ops-capacity',
      'compliance-readiness',
      'cloud-infra',
      'network',
    ])
    expect(byId('security-gaps')?.evidencePath).toBe('/technology-decision-review')
    expect(byId('active-threat-coverage')?.evidencePath).toBe('/security-risk-coverage-review')
    expect(byId('security-ops-capacity')?.evidencePath).toBe('/security-risk-coverage-review')
    expect(byId('compliance-readiness')?.evidencePath).toBe('/compliance-readiness-review')
    expect(byId('cloud-infra')?.evidencePath).toBe('/technology-decision-review')
    for (const id of ['active-threat-coverage', 'security-ops-capacity', 'compliance-readiness']) {
      expect(byId(id)).toMatchObject({ pathwaySlug: 'security', contactIntent: 'security' })
    }
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
    expect(automation.situations.every((item) => item.typicalCauses?.length === 2)).toBe(true)
    expect(automation.situations.every((item) => Boolean(item.roallaHelp))).toBe(true)
    execution.situations.forEach((situation) => {
      expect(situation.evidencePath).toBe('/tools/ninety-day-plan-brief')
    })
  })
})
