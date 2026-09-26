import {
  validateConsultationRequest,
  parseConsultationIntent,
  parseWebsiteGoal,
  intentFromServiceParam,
  intentFromNeedParam,
  parseWorkshopTopic,
  parseConsultingFocus,
  websiteGoalRequiresExistingSite,
  hasIntentSubSelection,
  isDigitalIntent,
  resolveSkippedStep2Defaults,
  buildConsultationSalesEmailHtml,
  buildConsultationUserConfirmationHtml,
  LIGHT_MODE_DEFAULT_GOAL,
} from '@/lib/consultation-request'
import {
  buildDigitalEnablementUrl,
  enablementGoalFromIntent,
  resolveDiscoveryUrl,
  shouldUseDigitalDiscoveryFunnel,
  DIGITAL_ENABLEMENT_BASE_URL,
  DIGITAL_DISCOVERY_BASE_URL,
} from '@/lib/discovery-funnel'

describe('consultation-request', () => {
  const validBase = {
    intent: 'consulting' as const,
    goal: 'We need help scaling operations across teams.',
    timeline: '1to3',
    consultingFocus: 'operations',
    name: 'Jane Doe',
    email: 'jane@example.com',
  }

  it('accepts a valid consulting request', () => {
    expect(validateConsultationRequest(validBase)).toBeNull()
    expect(parseConsultingFocus('technology')).toBe('technology')
  })

  it('requires website-specific fields', () => {
    expect(
      validateConsultationRequest({
        ...validBase,
        intent: 'website',
        consultingFocus: undefined,
      }),
    ).toBe('Please select what you need')
  })

  it('requires platform type for platform intent', () => {
    expect(
      validateConsultationRequest({
        ...validBase,
        intent: 'platform',
        consultingFocus: undefined,
      }),
    ).toBe('Please select a platform type')
  })

  it('requires automation goal for automation intent', () => {
    expect(
      validateConsultationRequest({
        ...validBase,
        intent: 'automation',
        consultingFocus: undefined,
        automationGoal: 'workflow',
      }),
    ).toBeNull()
  })

  it('requires existing site only for website goals', () => {
    expect(
      validateConsultationRequest({
        ...validBase,
        intent: 'website',
        consultingFocus: undefined,
        websiteGoal: 'new',
      }),
    ).toBe('Please indicate if you have an existing website')

    expect(
      validateConsultationRequest({
        ...validBase,
        intent: 'website',
        consultingFocus: undefined,
        websiteGoal: 'landing-booking',
        hasExistingSite: 'no',
      }),
    ).toBeNull()

    expect(websiteGoalRequiresExistingSite('redesign')).toBe(true)
    expect(websiteGoalRequiresExistingSite('landing-booking')).toBe(true)
  })

  it('rejects honeypot submissions', () => {
    expect(validateConsultationRequest({ ...validBase, website: 'spam' })).toBe('Invalid submission')
  })

  it('accepts slim digital light-mode requests without discovery fields', () => {
    expect(
      validateConsultationRequest({
        intent: 'website',
        lightMode: true,
        name: 'Alex Roe',
        email: 'alex@example.com',
      }),
    ).toBeNull()

    expect(
      validateConsultationRequest({
        intent: 'platform',
        lightMode: true,
        name: 'Alex Roe',
        email: 'alex@example.com',
        goal: 'Need a client portal',
        company: 'Acme',
      }),
    ).toBeNull()

    expect(
      validateConsultationRequest({
        intent: 'consulting',
        lightMode: true,
        name: 'Alex Roe',
        email: 'alex@example.com',
      }),
    ).toBe('Light mode is only available for digital service requests')
  })

  it('maps service query params to intent', () => {
    expect(intentFromServiceParam('websites-brand')).toBe('website')
    expect(intentFromServiceParam('custom-platforms')).toBe('platform')
    expect(intentFromServiceParam('digital-events')).toBe('digital-events')
    expect(intentFromServiceParam('workshops')).toBe('workshop')
    expect(parseConsultationIntent('unsure')).toBe('unsure')
  })

  it('maps need query params to intent', () => {
    expect(intentFromNeedParam('automation')).toBe('automation')
    expect(intentFromNeedParam('ai-support')).toBe('ai-support')
    expect(intentFromNeedParam('custom-platform')).toBe('platform')
    expect(intentFromNeedParam('new')).toBe('website')
    expect(intentFromNeedParam('maintain')).toBe('website')
    expect(intentFromNeedParam('client-portal')).toBe('platform')
    expect(intentFromNeedParam('branding')).toBe('workshop')
    expect(parseConsultationIntent('workshop')).toBe('workshop')
  })

  it('parses website goal values', () => {
    expect(parseWebsiteGoal('landing-booking')).toBe('landing-booking')
    expect(parseWebsiteGoal('custom-platform')).toBeNull()
    expect(parseWebsiteGoal('invalid')).toBeNull()
  })

  it('identifies digital intents', () => {
    expect(isDigitalIntent('website')).toBe(true)
    expect(isDigitalIntent('consulting')).toBe(false)
  })

  it('requires workshop topic for workshop intent', () => {
    expect(
      validateConsultationRequest({
        ...validBase,
        intent: 'workshop',
        consultingFocus: undefined,
        workshopTopic: 'sales',
      }),
    ).toBeNull()
  })

  it('parses workshop topic values', () => {
    expect(parseWorkshopTopic('ideation')).toBe('ideation')
    expect(parseWorkshopTopic('focus-circle')).toBe('focus-circle')
    expect(parseWorkshopTopic('workload-conversation')).toBe('workload-conversation')
    expect(parseWorkshopTopic('digital-calm')).toBe('digital-calm')
    expect(parseWorkshopTopic('decision-hour')).toBe('decision-hour')
    expect(parseWorkshopTopic('offer-page')).toBe('offer-page')
    expect(parseWorkshopTopic('first-offer')).toBe('first-offer')
    expect(parseWorkshopTopic('invalid')).toBeNull()
  })

  it('checks intent sub-selection', () => {
    expect(
      hasIntentSubSelection('platform', { platformType: 'internal' }),
    ).toBe(true)
    expect(hasIntentSubSelection('platform', {})).toBe(false)
  })

  it('fills step-2 defaults when founding offer skips to contact step', () => {
    expect(
      resolveSkippedStep2Defaults(
        'website',
        { websiteGoal: 'new' },
        { foundingOffer: true },
      ),
    ).toEqual({ timeline: '1to3', hasExistingSite: 'no' })
  })

  it('embeds enablement discovery URL in sales and user emails', () => {
    const discoveryUrl = buildDigitalEnablementUrl('website', {
      name: 'Jane Doe',
      email: 'jane@example.com',
      company: 'Acme',
      sourceRef: 'CR-123',
    })
    const labels: Record<string, string> = {
      emailHeading: 'New Service Inquiry',
      emailIntro: 'Intro',
      intent: 'Request type',
      intent_website: 'Website project',
      goal: 'Goal',
      timeline: 'Timeline',
      timeline_exploring: 'Just exploring',
      name: 'Name',
      email: 'Email',
      company: 'Company',
      phone: 'Phone',
      notProvided: 'Not provided',
      submittedAt: 'Submitted',
      source: 'Website',
      submissionId: 'Reference',
      discoveryUrl: 'Suggested discovery URL',
      discoveryHeading: 'Suggested discovery link',
      discoverySalesHint: 'Share enablement',
      reminderSalesHint: 'Nudge at T+2',
      userHtmlHeading: 'Request Received',
      userGreeting: 'Thanks',
      userBody: 'We got it.',
      userUrgent: 'Call us',
      userDiscoveryEyebrow: 'Optional next step',
      userDiscoveryBody: 'Start a brief',
      userDiscoveryCta: 'Start your digital brief',
    }
    const salesHtml = buildConsultationSalesEmailHtml(
      {
        intent: 'website',
        goal: LIGHT_MODE_DEFAULT_GOAL,
        timeline: 'exploring',
        lightMode: true,
        name: 'Jane Doe',
        email: 'jane@example.com',
      },
      labels,
      'Sep 25, 2026',
      'https://www.roalla.com',
      { discoveryUrl, submissionId: 'CR-123' },
    )
    const userHtml = buildConsultationUserConfirmationHtml(
      {
        intent: 'website',
        goal: LIGHT_MODE_DEFAULT_GOAL,
        timeline: 'exploring',
        lightMode: true,
        name: 'Jane Doe',
        email: 'jane@example.com',
      },
      labels,
      { discoveryUrl },
    )

    expect(salesHtml).toContain(DIGITAL_ENABLEMENT_BASE_URL)
    expect(salesHtml).toContain('goal=website')
    expect(salesHtml).not.toContain(DIGITAL_DISCOVERY_BASE_URL)
    expect(salesHtml).toContain('ROALLA')
    expect(salesHtml).toContain('Roalla Business Enablement Group')
    expect(salesHtml).toContain('Burlington, Ontario, Canada')
    expect(salesHtml).toContain('https://www.roalla.com/email/roalla-mark.png')
    expect(userHtml).toContain('Start your digital brief')
    expect(userHtml).toContain('goal=website')
    expect(userHtml).not.toContain('/digitaldiscovery')
    expect(userHtml).toContain('What happens next')
    expect(userHtml).toContain('https://www.roalla.com/en/privacy')
    expect(userHtml).toContain('sales@roalla.com')
  })
})

describe('discovery-funnel', () => {
  it('routes digital intents to enablement, never cold digitaldiscovery', () => {
    expect(shouldUseDigitalDiscoveryFunnel('website')).toBe(true)
    expect(shouldUseDigitalDiscoveryFunnel('consulting')).toBe(false)
    expect(enablementGoalFromIntent('platform')).toBe('app')
    expect(enablementGoalFromIntent('ai-support')).toBe('ai')

    const url = resolveDiscoveryUrl('visibility', {
      name: 'Pat',
      email: 'pat@example.com',
      company: 'Co',
      sourceRef: 'CR-9',
      locale: 'en',
    })
    expect(url).toContain(DIGITAL_ENABLEMENT_BASE_URL)
    expect(url).toContain('goal=visibility')
    expect(url).toContain('source=roalla.com')
    expect(url).toContain('name=Pat')
    expect(url).toContain('email=pat%40example.com')
    expect(url).toContain('company=Co')
    expect(url).toContain('cr=CR-9')
    expect(url).not.toContain('digitaldiscovery')
    expect(resolveDiscoveryUrl('workshop')).toBeNull()
  })
})
