import {
  USE_CASES,
  USE_CASE_CATEGORIES,
  USE_CASE_SERVICE_HREFS,
  categoryForUseCase,
  isUseCaseId,
} from '@/lib/use-cases'
import { useCaseItemListJsonLd } from '@/lib/structured-data'

describe('outcome-led use cases', () => {
  it('keeps every scenario uniquely addressable and assigned to a populated outcome', () => {
    const ids = USE_CASES.map((item) => item.id)

    expect(new Set(ids).size).toBe(ids.length)
    expect(USE_CASES).toHaveLength(26)

    for (const category of USE_CASE_CATEGORIES) {
      expect(USE_CASES.some((item) => item.category === category)).toBe(true)
    }

    for (const item of USE_CASES) {
      expect(isUseCaseId(item.id)).toBe(true)
      expect(categoryForUseCase(item.id)).toBe(item.category)
      expect(USE_CASE_SERVICE_HREFS[item.service]).toMatch(/^\//)
    }
  })

  it('builds item-level structured data with stable scenario anchors', () => {
    const schema = useCaseItemListJsonLd(
      'en',
      'Start with the outcome you need',
      USE_CASES.map((item) => ({
        id: item.id,
        name: item.id,
        description: `Outcome for ${item.id}`,
      })),
    )

    expect(schema['@type']).toBe('ItemList')
    expect(schema.numberOfItems).toBe(26)
    expect(schema.itemListElement[0]).toMatchObject({
      '@type': 'ListItem',
      position: 1,
    })
    expect(schema.itemListElement[0].url).toMatch(/#strategic-priorities$/)
  })
})
