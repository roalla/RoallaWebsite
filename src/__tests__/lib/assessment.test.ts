import {
  ASSESSMENT_QUESTION_IDS,
  LANE_VALUES,
  computeAssessmentResult,
  outcomeGroupForLane,
  type AssessmentAnswers,
} from '@/lib/assessment'
import { isOutcomeGroupId } from '@/lib/solution-outcome-pages'

const readyAnswers = {
  strategy: '4',
  operations: '4',
  team: '4',
  data: '4',
  innovation: '4',
} satisfies AssessmentAnswers

describe('service assessment', () => {
  it('routes agentic and visibility needs to their dedicated services', () => {
    const agentic = computeAssessmentResult({ ...readyAnswers, lane: 'agentic' })
    const visibility = computeAssessmentResult({ ...readyAnswers, lane: 'visibility' })

    expect(agentic).toMatchObject({
      lane: 'agentic',
      actionStage: 'agentic',
      laneHref: '/services/ai-agents',
      scheduleIntent: 'ai-support',
    })
    expect(visibility).toMatchObject({
      lane: 'visibility',
      actionStage: 'improve',
      laneHref: '/services/search-ai-visibility',
      scheduleIntent: 'visibility',
    })
  })

  it('uses readiness answers to tailor direct-service results', () => {
    const result = computeAssessmentResult({
      ...readyAnswers,
      lane: 'automation',
      operations: '1',
      data: '2',
    })

    expect(result).toMatchObject({
      lane: 'automation',
      actionStage: 'connect',
      primaryService: 'operations',
      secondaryService: 'data',
      laneHref: '/services/automation',
    })
  })

  it('gives an unsure visitor a practical advisory starting point', () => {
    expect(computeAssessmentResult({ ...readyAnswers, lane: 'unsure' })).toMatchObject({
      lane: 'consulting',
      actionStage: 'advise',
      laneHref: '/services/business-advisory',
      scheduleIntent: 'consulting',
    })

    expect(
      computeAssessmentResult({ ...readyAnswers, lane: 'unsure', direction: 'source' }),
    ).toMatchObject({
      lane: 'technology',
      actionStage: 'source',
      laneHref: '/services/technology-advisory',
    })

    expect(
      computeAssessmentResult({ ...readyAnswers, lane: 'unsure', direction: 'build' }),
    ).toMatchObject({
      lane: 'digital',
      actionStage: 'build',
      laneHref: '/services/digital',
    })
  })

  it('routes security and compliance needs to the dedicated service', () => {
    expect(computeAssessmentResult({ ...readyAnswers, lane: 'security' })).toMatchObject({
      lane: 'security',
      actionStage: 'source',
      laneHref: '/services/security-risk-compliance',
      scheduleIntent: 'security',
    })
  })

  it('keeps assisted AI distinct from autonomous agentic work', () => {
    expect(computeAssessmentResult({ ...readyAnswers, lane: 'ai' })).toMatchObject({
      lane: 'ai',
      actionStage: 'build',
      laneHref: '/services/digital',
    })
  })
})

describe('assessment outcome retarget', () => {
  it('keeps the six-question scoring engine', () => {
    expect(ASSESSMENT_QUESTION_IDS).toEqual([
      'lane',
      'strategy',
      'operations',
      'team',
      'data',
      'innovation',
    ])
    expect(computeAssessmentResult({ ...readyAnswers, lane: 'visibility' })?.overallScore).toBe(80)
  })

  it('maps each lane to a need-group outcome', () => {
    expect(outcomeGroupForLane('visibility')).toBe('growth-visibility')
    expect(outcomeGroupForLane('digital')).toBe('experience-products')
    expect(outcomeGroupForLane('agentic')).toBe('automation-ai')
    expect(outcomeGroupForLane('security')).toBe('security-compliance')
    expect(outcomeGroupForLane('consulting')).toBe('execution')
    expect(outcomeGroupForLane('unsure')).toBe('execution')

    for (const lane of LANE_VALUES) {
      expect(isOutcomeGroupId(outcomeGroupForLane(lane))).toBe(true)
    }
  })

  it('returns outcome group, evidence, and supporting service for each lane', () => {
    expect(computeAssessmentResult({ ...readyAnswers, lane: 'visibility' })).toMatchObject({
      outcomeGroup: 'growth-visibility',
      evidenceHref: '/tools/digital-presence-snapshot',
      supportingServiceHref: '/services/search-ai-visibility',
    })
    expect(computeAssessmentResult({ ...readyAnswers, lane: 'digital' })).toMatchObject({
      outcomeGroup: 'experience-products',
      evidenceHref: '/digital-product-discovery',
      supportingServiceHref: '/services/digital',
    })
    expect(computeAssessmentResult({ ...readyAnswers, lane: 'agentic' })).toMatchObject({
      outcomeGroup: 'automation-ai',
      evidenceHref: '/ai-agent-readiness-review',
      supportingServiceHref: '/services/ai-agents',
    })
    expect(computeAssessmentResult({ ...readyAnswers, lane: 'security' })).toMatchObject({
      outcomeGroup: 'security-compliance',
      evidenceHref: '/security-risk-coverage-review',
      supportingServiceHref: '/services/security-risk-compliance',
    })
  })

  it('sends consulting and unsure visitors to the execution outcome without evidence CTA', () => {
    for (const lane of ['consulting', 'unsure'] as const) {
      const result = computeAssessmentResult({ ...readyAnswers, lane })
      expect(result).toMatchObject({
        outcomeGroup: 'execution',
        evidenceHref: null,
      })
      expect(result?.supportingServiceHref).toMatch(/^\/services\/business-advisory/)
    }
  })

  it('follows the resolved lane when an unsure visitor picks a direction', () => {
    expect(
      computeAssessmentResult({ ...readyAnswers, lane: 'unsure', direction: 'improve' }),
    ).toMatchObject({ lane: 'visibility', outcomeGroup: 'growth-visibility' })
    expect(
      computeAssessmentResult({ ...readyAnswers, lane: 'unsure', direction: 'agentic' }),
    ).toMatchObject({ lane: 'agentic', outcomeGroup: 'automation-ai' })
  })
})
