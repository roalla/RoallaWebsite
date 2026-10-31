import {
  appendAttributionToHref,
  mergeCampaignAttribution,
  readAttributionFromSearch,
} from '@/lib/conversion-attribution'
import { capArrayStorage, prunePrefixedKeys, setLruJsonItem } from '@/lib/local-storage-lru'

describe('conversion attribution', () => {
  it('reads inbound solutions params from a query string', () => {
    const bag = readAttributionFromSearch(
      '?campaign=solutions-experience-products&signal=communications&entry_page=%2Fsolutions%2Fneed%2Fexperience-products&scope=cc',
    )
    expect(bag).toMatchObject({
      campaign: 'solutions-experience-products',
      signal: 'communications',
      entry_page: '/solutions/need/experience-products',
      scope: 'cc',
    })
  })

  it('preserves inbound entry_page when merging campaign defaults', () => {
    const merged = mergeCampaignAttribution(
      {
        campaign: 'solutions-growth-visibility',
        conversion_source: 'solutions_group_interactive',
        entry_page: '/solutions/need/growth-visibility',
        signal: 'findability',
      },
      {
        campaign: 'website-ai-visibility-review',
        conversion_source: 'campaign_page',
        entry_page: '/website-ai-visibility-review',
        selected_problem: 'website-ai-visibility-review',
      },
    )
    expect(merged.campaign).toBe('solutions-growth-visibility')
    expect(merged.conversion_source).toBe('solutions_group_interactive')
    expect(merged.entry_page).toBe('/solutions/need/growth-visibility')
    expect(merged.signal).toBe('findability')
  })

  it('appends attribution into contact from_page', () => {
    const href = appendAttributionToHref(
      '/en/contact?intent=consulting&from_page=%2Ftools%2Fcommunications-value-brief',
      {
        campaign: 'solutions-experience-products',
        entry_page: '/solutions/need/experience-products',
        signal: 'communications',
        conversion_source: 'solutions_group_interactive',
      },
    )
    expect(href).toContain('campaign=solutions-experience-products')
    expect(href).toContain('signal=communications')
    expect(decodeURIComponent(href)).toContain('entry_page=/solutions/need/experience-products')
  })
})

describe('local storage LRU', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('prunes oldest prefixed keys beyond the cap', () => {
    for (let i = 0; i < 5; i++) {
      setLruJsonItem(`roalla-digital-snapshot:https://example.com/${i}`, {
        savedAt: new Date(Date.UTC(2024, 0, i + 1)).toISOString(),
      }, { maxEntries: 3 })
    }
    const keys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index)).filter(
      (key): key is string => Boolean(key?.startsWith('roalla-digital-snapshot:')),
    )
    expect(keys.length).toBeLessThanOrEqual(3)
  })

  it('caps array storage length', () => {
    const capped = capArrayStorage('roalla-execution-dashboard', [1, 2, 3, 4, 5], 3)
    expect(capped).toEqual([3, 4, 5])
    expect(JSON.parse(localStorage.getItem('roalla-execution-dashboard') || '[]')).toEqual([3, 4, 5])
  })

  it('exposes prune helper for empty prefix safely', () => {
    expect(() => prunePrefixedKeys(null, 2)).not.toThrow()
  })
})
