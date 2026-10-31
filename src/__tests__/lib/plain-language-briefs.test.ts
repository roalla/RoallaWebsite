import {
  buildEmailReachBrief,
  parseEmailReachTarget,
  recommendEmailReachPath,
} from '@/lib/email-reach-brief'
import type { DomainHealthSnapshot } from '@/lib/domain-health/evaluate'
import {
  buildNinetyDayPlanBrief,
  recommendNinetyDayPath,
} from '@/lib/ninety-day-plan-brief'
import {
  buildCapacityPressureBrief,
  recommendCapacityPath,
} from '@/lib/capacity-pressure-brief'

function mailSnapshot(
  statuses: Partial<Record<'mx' | 'spf' | 'dkim' | 'dmarc', 'pass' | 'review' | 'gap'>>,
): DomainHealthSnapshot {
  return {
    domain: 'example.com',
    checkedAt: '2026-01-01T00:00:00.000Z',
    checks: [
      { id: 'mx', status: statuses.mx ?? 'pass', evidence: [] },
      { id: 'spf', status: statuses.spf ?? 'pass', evidence: [] },
      { id: 'dkim', status: statuses.dkim ?? 'pass', evidence: [] },
      { id: 'dmarc', status: statuses.dmarc ?? 'pass', evidence: [] },
      { id: 'names', status: 'pass', evidence: [] },
    ],
  }
}

describe('email reach brief', () => {
  it('parses domains and business emails', () => {
    expect(parseEmailReachTarget('https://www.Example.com/path')).toEqual({
      ok: true,
      domain: 'example.com',
      kind: 'domain',
      isFreeMail: false,
    })
    expect(parseEmailReachTarget('Owner@YourBusiness.ca')).toEqual({
      ok: true,
      domain: 'yourbusiness.ca',
      kind: 'email',
      isFreeMail: false,
    })
  })

  it('rejects free-mail providers', () => {
    expect(parseEmailReachTarget('owner@gmail.com')).toEqual({ ok: false, error: 'free-mail' })
  })

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

  it('recommends setup basics when live mail auth has gaps', () => {
    expect(
      recommendEmailReachPath({
        situation: 'junk-folder',
        usesOwnDomain: true,
        audience: 'customers',
        urgency: 'this-quarter',
        mailHealth: mailSnapshot({ spf: 'gap', dmarc: 'gap' }),
      }),
    ).toBe('setup-basics')
  })

  it('recommends trust-and-lists for junk when auth looks usable', () => {
    expect(
      recommendEmailReachPath({
        situation: 'looks-like-spam',
        usesOwnDomain: true,
        audience: 'prospects',
        urgency: 'this-quarter',
        mailHealth: mailSnapshot({}),
      }),
    ).toBe('trust-and-lists')
  })

  it('builds a private summary with live priorities when setup gaps exist', () => {
    const brief = buildEmailReachBrief({
      situation: 'never-arrives',
      usesOwnDomain: true,
      audience: 'both',
      urgency: 'exploring',
      mailHealth: mailSnapshot({ dmarc: 'gap', mx: 'pass', spf: 'pass', dkim: 'pass' }),
    })
    expect(brief.path).toBe('setup-basics')
    expect(brief.headline).toBeTruthy()
    expect(brief.summary).toMatch(/setup gaps/i)
    expect(brief.priorities.some((line) => /DMARC/i.test(line))).toBe(true)
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
