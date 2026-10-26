import { assertEcosystemPublicIntegrity, ecosystemGovernance } from '@/lib/ecosystem-governance'
import { ecosystemKeys } from '@/lib/technologyEcosystem'

describe('ecosystem governance integrity', () => {
  it('covers every ecosystem key', () => {
    expect(Object.keys(ecosystemGovernance).sort()).toEqual([...ecosystemKeys].sort())
  })

  it('keeps public logos on disk and external CTAs on https', () => {
    expect(assertEcosystemPublicIntegrity()).toEqual([])
  })

  it('marks all relationships non-exclusive', () => {
    for (const key of ecosystemKeys) {
      expect(ecosystemGovernance[key].exclusivity).toBe('non_exclusive')
    }
  })
})
