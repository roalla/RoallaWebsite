import {
  assembleEngagementFromContactHandoff,
  buildPlanningReportSalesHtml,
  buildPlanningReportSalesText,
  buildPlanningReportUserHtml,
  buildPlanningReportUserText,
  ENGAGEMENT_CAPS,
  parseEngagementFromBody,
} from '@/lib/consultation-engagement'
import {
  buildConsultationSalesEmailHtml,
  buildConsultationUserConfirmationHtml,
} from '@/lib/consultation-request'

const labels: Record<string, string> = {
  emailHeading: 'New Service Inquiry',
  emailIntro: 'Intro',
  intent: 'Request type',
  intent_visibility: 'Digital visibility optimization',
  goal: 'Goal / challenge',
  timeline: 'Timeline',
  timeline_exploring: 'Just exploring',
  name: 'Name',
  email: 'Email',
  company: 'Company',
  phone: 'Phone',
  notProvided: 'Not provided',
  submittedAt: 'Submitted',
  source: 'Website',
  sourcePage: 'Referrer page',
  campaign: 'Campaign',
  entryPage: 'Entry page',
  selectedProblem: 'Selected problem',
  conversionSource: 'Conversion source',
  signal: 'Signal',
  submissionId: 'Reference',
  discoveryHeading: 'Suggested discovery link',
  discoverySalesHint: 'Share enablement',
  discoveryCta: 'Open the brief',
  userHtmlHeading: 'We received your inquiry',
  userGreeting: 'Thanks',
  userBody: 'We got it.',
  userUrgent: 'Call us',
  userNextHeading: 'What happens next',
  userNext1: 'Review',
  userNext2: 'Recommend',
  userNext3: 'Reply',
  userSignoff: 'Best regards,\nThe ROALLA Team',
  userDiscoveryEyebrow: 'Optional next step',
  userDiscoveryBody: 'Start a brief',
  userDiscoveryCta: 'Start your digital brief',
  engagementKind: 'Engagement',
  'engagementKind_visibility-estimate': 'Visibility estimate',
  engagementWebsite: 'Website',
  engagementFromTool: 'From tool',
  evidenceTool: 'Tool',
  evidenceUrl: 'Checked URL',
  evidencePriorities: 'Priorities',
  evidenceScores: 'Scores',
  evidenceAsOf: 'As of',
  estimateTotal: 'Preliminary total',
  estimateRegion: 'Region',
  estimateReferral: 'Referral code',
  estimateSummary: 'Selections',
  planningSalesHeading: 'Planning report — internal',
  planningSalesEyebrow: 'Sales desk · Planning report',
  planningSalesIntro: 'Estimate-backed request.',
  planningHeaderSection: 'Prospect',
  planningJourneySection: 'Journey',
  planningEvidenceSection: 'Evidence snapshot',
  planningEstimateSection: 'Preliminary estimate',
  planningNoteSection: 'Prospect note',
  planningUserHeading: 'Your preliminary planning report',
  planningUserPreheader: 'Planning report inside.',
  planningUserEyebrow: 'Planning report',
  planningUserGreeting: 'Thanks for the estimate.',
  planningUserBody: 'Here is a preliminary planning report for {kind}.',
  planningUserEvidenceSection: 'What we checked',
  planningUserEstimateSection: 'Your preliminary estimate',
  planningUserNext1: 'We review your results.',
  planningUserNext2: 'Written scope next.',
  planningUserNext3: 'Kickoff after agreement.',
  planningUserCta: 'Reply to this email anytime.',
}

const baseInquiry = {
  intent: 'visibility' as const,
  goal: 'Improve findability for qualified inquiries.',
  timeline: 'exploring',
  name: 'Pat Lee',
  email: 'pat@example.com',
  company: 'Northwind',
  sourcePage: '/contact?from_page=/visibility-improvement-estimate',
}

const sampleEngagement = {
  kind: 'visibility-estimate' as const,
  website: 'https://example.com',
  fromTool: 'digital-presence-snapshot',
  attribution: {
    campaign: 'insights-visibility-review',
    entry_page: '/solutions/need/growth-visibility',
    conversion_source: 'insights_campaign',
    signal: 'findability',
    selected_problem: 'website-and-ai-visibility',
  },
  estimate: {
    total: '$12,400 CAD',
    summary: 'Core program + technical SEO sprint',
    lineItems: [
      { label: 'Visibility core', amount: '$9,800 CAD' },
      { label: 'Technical SEO sprint', amount: '$2,600 CAD' },
    ],
    referralCode: 'PARTNER10',
    region: 'ON',
  },
  evidence: {
    toolName: 'digital-presence-snapshot',
    url: 'https://example.com',
    priorities: ['Fix title tags', 'Add social image', 'Improve mobile speed'],
    scores: { mobile: 62, desktop: 81 },
    asOf: '2026-11-13T12:00:00.000Z',
  },
  disclaimer: 'Preliminary planning figures only — non-binding until confirmed in writing.',
}

describe('parseEngagementFromBody', () => {
  it('returns undefined when engagement is absent', () => {
    expect(parseEngagementFromBody(undefined)).toEqual({
      ok: true,
      engagement: undefined,
    })
    expect(parseEngagementFromBody(null)).toEqual({
      ok: true,
      engagement: undefined,
    })
  })

  it('parses a valid engagement packet and truncates oversized fields', () => {
    const hugePriority = 'P'.repeat(ENGAGEMENT_CAPS.priorityLine + 40)
    const result = parseEngagementFromBody({
      ...sampleEngagement,
      estimate: {
        ...sampleEngagement.estimate,
        summary: 'S'.repeat(ENGAGEMENT_CAPS.estimateSummary + 50),
      },
      evidence: {
        ...sampleEngagement.evidence,
        priorities: [hugePriority, 'Keep me', 'x', 'y', 'z', 'a', 'b', 'drop-me'],
      },
    })
    expect(result.ok).toBe(true)
    if (!result.ok || !result.engagement) throw new Error('expected engagement')
    expect(result.engagement.estimate.summary.length).toBe(ENGAGEMENT_CAPS.estimateSummary)
    expect(result.engagement.evidence?.priorities).toHaveLength(ENGAGEMENT_CAPS.priorities)
    expect(result.engagement.evidence?.priorities[0].length).toBe(ENGAGEMENT_CAPS.priorityLine)
  })

  it('rejects oversized serialized packets and invalid kinds', () => {
    expect(parseEngagementFromBody({ kind: 'nope', estimate: { total: '1', summary: 'x' } })).toEqual({
      ok: false,
      error: 'Invalid engagement kind',
    })
    const bloated = {
      kind: 'website-estimate',
      estimate: {
        total: '$1',
        summary: 'ok',
        lineItems: Array.from({ length: 5 }, (_, i) => ({
          label: `Item ${i}`,
          amount: '$1',
        })),
      },
      disclaimer: 'D'.repeat(ENGAGEMENT_CAPS.maxSerializedChars),
    }
    expect(parseEngagementFromBody(bloated)).toEqual({
      ok: false,
      error: 'Engagement packet is too large',
    })
  })
})

describe('assembleEngagementFromContactHandoff', () => {
  it('builds engagement from estimate URL fields + session evidence', () => {
    const engagement = assembleEngagementFromContactHandoff({
      estimateTotal: '$8,200 CAD',
      estimateSummary: 'Email authentication + deliverability setup',
      website: 'mail.example.com',
      fromTool: 'email-reach-brief',
      estimateTool: 'email',
      fromPage: '/email-reach-estimate',
      estimateRegion: 'QC',
      attribution: { campaign: 'insights-visibility-review' },
      evidence: {
        tool: 'email-reach-brief',
        domain: 'mail.example.com',
        priorities: ['SPF', 'DKIM', 'DMARC'],
        asOf: '2026-11-13T12:00:00.000Z',
      },
    })
    expect(engagement?.kind).toBe('email-reach-estimate')
    expect(engagement?.fromTool).toBe('email-reach-brief')
    expect(engagement?.evidence?.priorities).toEqual(['SPF', 'DKIM', 'DMARC'])
    expect(engagement?.estimate.total).toBe('$8,200 CAD')
  })

  it('returns null without estimate total/summary', () => {
    expect(
      assembleEngagementFromContactHandoff({
        fromTool: 'digital-presence-snapshot',
        estimateTool: 'visibility',
      }),
    ).toBeNull()
  })
})

describe('planning report builders', () => {
  it('keeps thin confirmation builders when engagement is absent', () => {
    const salesHtml = buildConsultationSalesEmailHtml(
      baseInquiry,
      labels,
      'Nov 13, 2026',
      'https://www.roalla.com',
      { submissionId: 'CR-1' },
    )
    const userHtml = buildConsultationUserConfirmationHtml(baseInquiry, labels, {
      submissionId: 'CR-1',
    })
    expect(salesHtml).toContain('New Service Inquiry')
    expect(salesHtml).not.toContain('Planning report — internal')
    expect(salesHtml).not.toContain('Evidence snapshot')
    expect(userHtml).toContain('We received your inquiry')
    expect(userHtml).not.toContain('Your preliminary planning report')
    expect(userHtml).not.toContain('What we checked')
  })

  it('renders sales and user planning-report sections when engagement is present', () => {
    const data = { ...baseInquiry, engagement: sampleEngagement }
    const salesHtml = buildPlanningReportSalesHtml(
      data,
      labels,
      'Nov 13, 2026',
      'https://www.roalla.com',
      { submissionId: 'CR-99', discoveryUrl: 'https://www.roalla.com/en/digital-enablement?goal=visibility' },
    )
    const salesText = buildPlanningReportSalesText(
      data,
      labels,
      'Nov 13, 2026',
      'https://www.roalla.com',
      { submissionId: 'CR-99' },
    )
    const userHtml = buildPlanningReportUserHtml(data, labels, {
      submissionId: 'CR-99',
    })
    const userText = buildPlanningReportUserText(data, labels, {
      submissionId: 'CR-99',
    })

    expect(salesHtml).toContain('Planning report — internal')
    expect(salesHtml).toContain('Journey')
    expect(salesHtml).toContain('Evidence snapshot')
    expect(salesHtml).toContain('Preliminary estimate')
    expect(salesHtml).toContain('Prospect note')
    expect(salesHtml).toContain('Visibility core')
    expect(salesHtml).toContain('$12,400 CAD')
    expect(salesHtml).toContain('Fix title tags')
    expect(salesHtml).toContain('insights-visibility-review')
    expect(salesHtml).toContain('Improve findability for qualified inquiries.')
    expect(salesText).toContain('Evidence snapshot')
    expect(salesText).toContain('PARTNER10')

    expect(userHtml).toContain('Your preliminary planning report')
    expect(userHtml).toContain('What we checked')
    expect(userHtml).toContain('Your preliminary estimate')
    expect(userHtml).toContain('What happens next')
    expect(userHtml).toContain('CR-99')
    expect(userHtml).toContain('non-binding')
    expect(userText).toContain('Visibility estimate')
    expect(userText).toContain('Technical SEO sprint')
  })
})
