import { getTechnologyAdvisoryCopy } from '@/lib/technology-advisory-content'

describe('technology advisory content', () => {
  it.each(['en', 'fr'] as const)('exposes conversion copy for %s', (locale) => {
    const copy = getTechnologyAdvisoryCopy(locale)
    expect(copy.hero.primary).toBeTruthy()
    expect(copy.hero.secondary).toBeTruthy()
    expect(copy.trust.disclosureLine).toBeTruthy()
    expect(copy.trust.partnersCta).toBeTruthy()
    expect(copy.journeys.selectHint).toBeTruthy()
    expect(copy.journeys.selectedLabel).toBeTruthy()
    expect(copy.journeys.advisorNeeds[0].id).toBe('growth')
    expect(copy.journeys.categories[0].id).toBe('cloud-infrastructure')
    expect(copy.midCta.primary).toBeTruthy()
    expect(copy.midCta.secondary).toBeTruthy()
  })
})
