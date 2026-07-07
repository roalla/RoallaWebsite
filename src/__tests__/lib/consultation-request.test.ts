import {
  validateConsultationRequest,
  parseConsultationIntent,
  parseWebsiteGoal,
  intentFromServiceParam,
  intentFromNeedParam,
  parseWorkshopTopic,
  websiteGoalRequiresExistingSite,
  hasIntentSubSelection,
  isDigitalIntent,
  resolveSkippedStep2Defaults,
} from '@/lib/consultation-request'

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
})
