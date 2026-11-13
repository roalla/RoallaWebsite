import {
  estimateWizardStorageKey,
  resolveEstimateWizardMode,
} from '@/lib/estimate-wizard-mode'

describe('estimate wizard mode', () => {
  it('builds a per-tool storage key', () => {
    expect(estimateWizardStorageKey('workshop')).toBe('roalla-estimate-wizard-workshop')
  })

  it('prefers URL wizard=1 over storage', () => {
    expect(resolveEstimateWizardMode('?wizard=1', 'form')).toBe('wizard')
    expect(resolveEstimateWizardMode('wizard=0', 'wizard')).toBe('form')
  })

  it('falls back to storage then form', () => {
    expect(resolveEstimateWizardMode('', 'wizard')).toBe('wizard')
    expect(resolveEstimateWizardMode('', null)).toBe('form')
  })
})
