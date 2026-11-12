import {
  FEATURED_INDUSTRY_HUB_IDS,
  INDUSTRY_HUB_IDS,
  INDUSTRY_SERVICE_TILE_IMAGES,
  SERVICE_KEYS,
  getFeaturedIndustryHubNav,
  getIndustryHub,
  getIndustryHubIndex,
  isIndustryHubId,
  listIndustryHubIds,
  toIndustryOptImageSrc,
} from '@/lib/industry-hub-content'

describe('industry hub content', () => {
  it('exposes all fifteen industry hub ids', () => {
    expect(listIndustryHubIds()).toHaveLength(15)
    expect(INDUSTRY_HUB_IDS).toContain('legal')
    expect(isIndustryHubId('legal')).toBe(true)
    expect(isIndustryHubId('not-real')).toBe(false)
  })

  it('exposes a featured subset for the header', () => {
    expect(FEATURED_INDUSTRY_HUB_IDS).toHaveLength(8)
    expect(getFeaturedIndustryHubNav('en')).toHaveLength(8)
    expect(getFeaturedIndustryHubNav('en').map((item) => item.id)).not.toContain('warehouses')
  })

  it.each(['en', 'fr'] as const)('builds complete hubs for every industry in %s', (locale) => {
    const index = getIndustryHubIndex(locale)
    expect(index.items).toHaveLength(15)
    expect(index.title).toBeTruthy()
    expect(index.lead).toBeTruthy()

    for (const id of INDUSTRY_HUB_IDS) {
      const hub = getIndustryHub(locale, id)
      expect(hub).not.toBeNull()
      expect(hub!.label).toBeTruthy()
      expect(hub!.image.src).toContain('.webp')
      expect(hub!.pressures.length).toBeGreaterThanOrEqual(3)
      expect(hub!.leadServices).toHaveLength(2)
      expect(hub!.relatedServices).toHaveLength(6)
      expect(hub!.startHere.lead).toBeTruthy()
      expect(hub!.proof.label).toBeTruthy()
      expect(hub!.hero.secondaryCta.toLowerCase()).toContain(
        locale === 'fr' ? 'employé ia' : 'ai employee',
      )
      expect(hub!.closer.secondaryCta.toLowerCase()).toMatch(/industr|secteur/)
      for (const key of SERVICE_KEYS) {
        const block = hub!.services[key]
        expect(block.title).toBeTruthy()
        expect(block.lead).toBeTruthy()
        expect(block.points).toHaveLength(3)
        expect(block.href).toBeTruthy()
      }
    }
  })

  it('keeps service titles unique within a locale', () => {
    const titles = INDUSTRY_HUB_IDS.flatMap((id) => {
      const hub = getIndustryHub('en', id)!
      return SERVICE_KEYS.map((key) => hub.services[key].title)
    })
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('maps card/hero library paths to opt tiles', () => {
    expect(toIndustryOptImageSrc('/images/insights/library/it-provider-who-owns-risk.card.webp')).toBe(
      '/images/insights/library/it-provider-who-owns-risk.opt.webp',
    )
    expect(toIndustryOptImageSrc('/images/insights/library/practical-ai-use-cases.hero.webp')).toBe(
      '/images/insights/library/practical-ai-use-cases.opt.webp',
    )
  })

  it('exposes opt.webp tile paths for every service key', () => {
    for (const key of SERVICE_KEYS) {
      expect(INDUSTRY_SERVICE_TILE_IMAGES[key]).toMatch(/\.opt\.webp$/)
    }
  })
})
