import {
  buildEmailReachBrief,
  recommendEmailReachPath,
} from '@/lib/email-reach-brief'
import {
  buildNinetyDayPlanBrief,
  recommendNinetyDayPath,
} from '@/lib/ninety-day-plan-brief'
import {
  buildCapacityPressureBrief,
  recommendCapacityPath,
} from '@/lib/capacity-pressure-brief'

describe('email reach brief', () => {
  it('recommends setup basics when not sending from own domain', () => {
    expect(
      recommendEmailReachPath({
        situation: 'junk-folder',
        usesOwnDomain: false,
        audience: 'customers',
        urgency: 'urgent',
      }),
    ).toBe('setup-basics')
  })

  it('recommends trust-and-lists for junk or spam-looking mail on own domain', () => {
    expect(
      recommendEmailReachPath({
        situation: 'looks-like-spam',
        usesOwnDomain: true,
        audience: 'prospects',
        urgency: 'this-quarter',
      }),
    ).toBe('trust-and-lists')
  })

  it('builds a private summary with priorities', () => {
    const brief = buildEmailReachBrief({
      situation: 'never-arrives',
      usesOwnDomain: true,
      audience: 'both',
      urgency: 'exploring',
    })
    expect(brief.path).toBe('full-reach-review')
    expect(brief.headline).toBeTruthy()
    expect(brief.summary).toBeTruthy()
    expect(brief.priorities).toHaveLength(3)
  })
})

describe('ninety-day plan brief', () => {
  it('maps pressure to the matching path', () => {
    expect(
      recommendNinetyDayPath({
        pressure: 'plans-stall',
        horizon: '90-days',
        teamPressure: 'small-team',
        outcome: 'Close three enterprise deals',
      }),
    ).toBe('follow-through-rhythm')
    expect(
      recommendNinetyDayPath({
        pressure: 'unclear-ownership',
        horizon: '30-days',
        teamPressure: 'founder-led',
        outcome: 'Ship the offer page',
      }),
    ).toBe('ownership-map')
  })

  it('includes the named outcome in the summary', () => {
    const brief = buildNinetyDayPlanBrief({
      pressure: 'too-many-priorities',
      horizon: '90-days',
      teamPressure: 'growing-team',
      outcome: 'Reduce cycle time by 20%',
    })
    expect(brief.path).toBe('focus-sequence')
    expect(brief.summary).toContain('Reduce cycle time by 20%')
    expect(brief.priorities.length).toBeGreaterThanOrEqual(3)
  })
})

describe('capacity pressure brief', () => {
  it('maps peak and quality pressures to distinct paths', () => {
    expect(
      recommendCapacityPath({
        pressure: 'peak-volume',
        workArea: 'customer-requests',
        mustStayHuman: 'relationships',
        urgency: 'urgent',
      }),
    ).toBe('cover-peaks')
    expect(
      recommendCapacityPath({
        pressure: 'quality-slipping',
        workArea: 'operations',
        mustStayHuman: 'approvals',
        urgency: 'this-quarter',
      }),
    ).toBe('protect-quality')
  })

  it('builds a capacity summary without jargon', () => {
    const brief = buildCapacityPressureBrief({
      pressure: 'cant-hire',
      workArea: 'internal-admin',
      mustStayHuman: 'exceptions',
      urgency: 'exploring',
    })
    expect(brief.path).toBe('automate-repeatable')
    expect(brief.summary.toLowerCase()).not.toMatch(/\b(spf|dkim|agentic|iot)\b/)
    expect(brief.priorities).toHaveLength(3)
  })
})
