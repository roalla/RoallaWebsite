import {
  USE_CASES,
  USE_CASE_CATEGORIES,
  USE_CASE_INDUSTRIES,
  USE_CASE_SERVICE_HREFS,
  USE_CASE_TECHNOLOGIES,
  categoryForUseCase,
  isUseCaseId,
} from '@/lib/use-cases'
import {
  DEFAULT_USE_CASE_FACETS,
  INDUSTRY_FACET_LABELS,
  OUTCOME_GROUP_FACET_LABELS,
  TECHNOLOGY_FACET_LABELS,
  filterUseCases,
  parseUseCaseFacets,
  serializeUseCaseFacets,
} from '@/lib/use-case-facets'
import { OUTCOME_GROUP_IDS } from '@/lib/solution-outcome-pages'
import { SOLUTION_PATH_IDS } from '@/lib/solutions-by-need'
import { useCaseItemListJsonLd } from '@/lib/structured-data'

describe('outcome-led use cases', () => {
  it('keeps every scenario uniquely addressable and assigned to a populated outcome', () => {
    const ids = USE_CASES.map((item) => item.id)

    expect(new Set(ids).size).toBe(ids.length)
    expect(USE_CASES).toHaveLength(32)

    for (const category of USE_CASE_CATEGORIES) {
      expect(USE_CASES.some((item) => item.category === category)).toBe(true)
    }

    for (const item of USE_CASES) {
      expect(isUseCaseId(item.id)).toBe(true)
      expect(categoryForUseCase(item.id)).toBe(item.category)
      expect(USE_CASE_SERVICE_HREFS[item.service]).toMatch(/^\//)
    }
  })

  it('assigns every scenario an outcome group, industries, and technologies from controlled lists', () => {
    for (const item of USE_CASES) {
      expect(OUTCOME_GROUP_IDS as readonly string[]).toContain(item.outcomeGroup)
      if ('pathwaySlug' in item) {
        expect(SOLUTION_PATH_IDS as readonly string[]).toContain(item.pathwaySlug)
      }
      expect(item.industries.length).toBeGreaterThan(0)
      for (const industry of item.industries) {
        expect(USE_CASE_INDUSTRIES as readonly string[]).toContain(industry)
      }
      for (const tech of item.technologies) {
        expect(USE_CASE_TECHNOLOGIES as readonly string[]).toContain(tech)
      }
    }

    for (const group of OUTCOME_GROUP_IDS) {
      expect(USE_CASES.some((item) => item.outcomeGroup === group)).toBe(true)
    }
  })

  it('maps the planned scenarios to their outcome groups', () => {
    const groupOf = (id: string) => USE_CASES.find((item) => item.id === id)?.outcomeGroup
    expect(groupOf('search-ai-visibility')).toBe('growth-visibility')
    expect(groupOf('website-refresh')).toBe('experience-products')
    expect(groupOf('ai-workflows')).toBe('automation-ai')
    expect(groupOf('cybersecurity-sourcing')).toBe('security-compliance')
    expect(groupOf('strategic-priorities')).toBe('execution')
  })

  it('provides EN and FR labels for every facet value', () => {
    for (const locale of ['en', 'fr'] as const) {
      for (const group of OUTCOME_GROUP_IDS) expect(OUTCOME_GROUP_FACET_LABELS[locale][group]).toBeTruthy()
      for (const industry of USE_CASE_INDUSTRIES) expect(INDUSTRY_FACET_LABELS[locale][industry]).toBeTruthy()
      for (const tech of USE_CASE_TECHNOLOGIES) expect(TECHNOLOGY_FACET_LABELS[locale][tech]).toBeTruthy()
    }
  })

  it('combines facet filters with AND and round-trips the URL query', () => {
    expect(filterUseCases(DEFAULT_USE_CASE_FACETS)).toHaveLength(32)

    const state = parseUseCaseFacets('?group=growth-visibility&industry=trades-field&tech=websites')
    expect(state).toEqual({ group: 'growth-visibility', industry: 'trades-field', tech: 'websites' })
    const results = filterUseCases(state)
    expect(results.length).toBeGreaterThan(0)
    for (const item of results) {
      expect(item.outcomeGroup).toBe('growth-visibility')
      expect(item.industries as readonly string[]).toContain('trades-field')
      expect(item.technologies as readonly string[]).toContain('websites')
    }
    expect(serializeUseCaseFacets(state)).toBe('group=growth-visibility&industry=trades-field&tech=websites')

    expect(parseUseCaseFacets('?group=nope&industry=&tech=bogus')).toEqual(DEFAULT_USE_CASE_FACETS)
    expect(serializeUseCaseFacets(DEFAULT_USE_CASE_FACETS)).toBe('')
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
    expect(schema.numberOfItems).toBe(32)
    expect(schema.itemListElement[0]).toMatchObject({
      '@type': 'ListItem',
      position: 1,
    })
    expect(schema.itemListElement[0].url).toMatch(/#strategic-priorities$/)
  })
})
