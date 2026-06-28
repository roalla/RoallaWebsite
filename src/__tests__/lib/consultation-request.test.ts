import {
  validateConsultationRequest,
  parseConsultationIntent,
  parseWebsiteGoal,
  intentFromServiceParam,
  websiteGoalRequiresExistingSite,
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
        websiteGoal: 'automation',
      }),
    ).toBeNull()

    expect(websiteGoalRequiresExistingSite('redesign')).toBe(true)
    expect(websiteGoalRequiresExistingSite('integration')).toBe(false)
  })

  it('rejects honeypot submissions', () => {
    expect(validateConsultationRequest({ ...validBase, website: 'spam' })).toBe('Invalid submission')
  })

  it('maps service query params to intent', () => {
    expect(intentFromServiceParam('websites-brand')).toBe('website')
    expect(intentFromServiceParam('custom-platforms')).toBe('website')
    expect(parseConsultationIntent('unsure')).toBe('unsure')
  })

  it('parses website goal values', () => {
    expect(parseWebsiteGoal('automation')).toBe('automation')
    expect(parseWebsiteGoal('custom-platform')).toBe('custom-platform')
    expect(parseWebsiteGoal('invalid')).toBeNull()
  })
})
