import {
  buildConversionHref,
  isConversionBriefPath,
  isConversionDeadEnd,
} from '@/lib/conversion-cta'
import { buildAiEmployeeFitBrief } from '@/lib/ai-employee-fit-brief'
import { buildLearningAdoptionBrief } from '@/lib/learning-adoption-brief'
import { campaignReviewContent, campaignReviewIds } from '@/lib/campaign-review-content'

describe('conversion CTA contract', () => {
  it('treats assessment as a dead-end primary destination', () => {
    expect(isConversionDeadEnd('/assessment')).toBe(true)
    expect(isConversionBriefPath('/tools/ai-employee-fit-brief')).toBe(true)
    expect(isConversionBriefPath('/tools/learning-adoption-brief')).toBe(true)
  })

  it('builds locale-aware conversion hrefs with offer context', () => {
    expect(
      buildConversionHref('en', '/tools/ai-employee-fit-brief', {
        campaign: 'ai-employee',
        offer: 'AI Employee Fit Brief',
        industry: 'IT & Managed Services',
      }),
    ).toContain('/en/tools/ai-employee-fit-brief?')
  })

  it('does not leave campaign reviews pointing at /assessment', () => {
    for (const id of campaignReviewIds) {
      for (const locale of ['en', 'fr'] as const) {
        expect(campaignReviewContent[id][locale].toolPath).not.toBe('/assessment')
      }
    }
  })

  it('routes AI Employee fit review to the fit brief', () => {
    expect(campaignReviewContent['ai-employee-fit-review'].en.toolPath).toBe(
      '/tools/ai-employee-fit-brief',
    )
    expect(campaignReviewContent['ai-employee-fit-review'].fr.toolPath).toBe(
      '/tools/ai-employee-fit-brief',
    )
  })
})

describe('AI Employee fit brief', () => {
  it('prioritizes handoff when rules are missing', () => {
    const brief = buildAiEmployeeFitBrief({
      channel: 'voice',
      skill: 'answer',
      knowledge: 'ready',
      handoff: 'not-defined',
      urgency: 'this-quarter',
      industry: 'IT & Managed Services',
    })
    expect(brief.path).toBe('handoff-first')
    expect(brief.headline).toMatch(/handoff/i)
  })
})

describe('learning adoption brief', () => {
  it('recommends tracked learning for SCORM or compliance', () => {
    const brief = buildLearningAdoptionBrief({
      audience: 'internal',
      format: 'scorm',
      outcome: 'compliance',
      ownership: 'named-owner',
      urgency: 'this-quarter',
    })
    expect(brief.path).toBe('tracked-learning')
  })
})
