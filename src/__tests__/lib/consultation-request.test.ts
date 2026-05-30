import {
  validateConsultationRequest,
  parseConsultationIntent,
  intentFromServiceParam,
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
    ).toBe('Please select a website goal')
  })

  it('rejects honeypot submissions', () => {
    expect(validateConsultationRequest({ ...validBase, website: 'spam' })).toBe('Invalid submission')
  })

  it('maps service query params to intent', () => {
    expect(intentFromServiceParam('websites-brand')).toBe('website')
    expect(intentFromServiceParam('custom-platforms')).toBe('platform')
    expect(parseConsultationIntent('unsure')).toBe('unsure')
  })
})
