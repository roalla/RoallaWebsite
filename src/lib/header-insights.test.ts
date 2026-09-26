import { HEADER_INSIGHT_SLUGS } from '@/lib/insights'
import { normalizeHeaderInsightSlugs } from '@/lib/header-insights'

describe('normalizeHeaderInsightSlugs', () => {
  it('accepts five unique published articles in order', () => {
    expect(normalizeHeaderInsightSlugs([...HEADER_INSIGHT_SLUGS])).toEqual([...HEADER_INSIGHT_SLUGS])
  })

  it('rejects the wrong count, duplicates, and unknown slugs', () => {
    expect(normalizeHeaderInsightSlugs(HEADER_INSIGHT_SLUGS.slice(0, 4))).toBeNull()
    expect(normalizeHeaderInsightSlugs([...HEADER_INSIGHT_SLUGS, 'fractional-coo'])).toBeNull()
    const duplicate = [...HEADER_INSIGHT_SLUGS]
    duplicate[4] = duplicate[0]
    expect(normalizeHeaderInsightSlugs(duplicate)).toBeNull()
    expect(normalizeHeaderInsightSlugs([
      ...HEADER_INSIGHT_SLUGS.slice(0, 4),
      'not-an-article',
    ])).toBeNull()
  })
})
