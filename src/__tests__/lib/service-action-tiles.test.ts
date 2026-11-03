import {
  attributedServiceTileHref,
  getServiceActionBand,
  serviceActionBands,
  type ServiceActionServiceId,
} from '@/lib/service-action-tiles'
import { getServiceTrends2027, serviceTrends2027 } from '@/lib/service-trends-2027'

const SERVICE_IDS: ServiceActionServiceId[] = [
  'search-ai-visibility',
  'ai-agents',
  'security',
  'managed-optimization',
  'digital-products',
]

describe('service action tiles', () => {
  it.each(SERVICE_IDS)('defines at least 3 tiles with paths for %s', (serviceId) => {
    const band = getServiceActionBand(serviceId)
    expect(band.tiles.length).toBeGreaterThanOrEqual(3)
    band.tiles.forEach((tile) => {
      expect(tile.id).toBeTruthy()
      expect(tile.href).toMatch(/^\//)
      expect(tile.label.en).toBeTruthy()
      expect(tile.label.fr).toBeTruthy()
      expect(tile.cta.en).toBeTruthy()
      expect(tile.cta.fr).toBeTruthy()
    })
  })

  it('exposes all five services in the registry', () => {
    expect(Object.keys(serviceActionBands).sort()).toEqual([...SERVICE_IDS].sort())
  })

  it('adds attribution query params to tile hrefs', () => {
    const href = attributedServiceTileHref(
      '/website-ai-visibility-review',
      'search-ai-visibility',
      'ai-visibility-review',
    )
    expect(href).toContain('/website-ai-visibility-review?')
    expect(href).toContain('campaign=service-search-ai-visibility')
    expect(href).toContain('conversion_source=service_action_tile')
    expect(href).toContain('signal=ai-visibility-review')
  })
})

describe('service trends 2027', () => {
  it.each(SERVICE_IDS)('defines three trends for %s', (serviceId) => {
    const band = getServiceTrends2027(serviceId)
    expect(band.trends).toHaveLength(3)
    band.trends.forEach((trend) => {
      expect(trend.title.en).toBeTruthy()
      expect(trend.title.fr).toBeTruthy()
      expect(trend.body.en).toBeTruthy()
      expect(trend.body.fr).toBeTruthy()
    })
  })

  it('exposes all five services in the trends registry', () => {
    expect(Object.keys(serviceTrends2027).sort()).toEqual([...SERVICE_IDS].sort())
  })
})
