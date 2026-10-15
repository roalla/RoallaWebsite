import { computeAssessmentResult, type AssessmentAnswers } from '@/lib/assessment'

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

  it('requires an outcome clarifier when the user is unsure', () => {
    expect(computeAssessmentResult({ ...readyAnswers, lane: 'unsure' })).toBeNull()

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

  it('keeps assisted AI distinct from autonomous agentic work', () => {
    expect(computeAssessmentResult({ ...readyAnswers, lane: 'ai' })).toMatchObject({
      lane: 'ai',
      actionStage: 'build',
      laneHref: '/services/digital',
    })
  })
})
