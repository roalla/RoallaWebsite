import { aiEmployeeContent } from '@/lib/ai-employee-content'
import {
  appendAttributionToHref,
  readAttributionFromSearch,
} from '@/lib/conversion-attribution'

describe('ai employee content', () => {
  it.each(['en', 'fr'] as const)('provides hero, how-step, industry, and related images for %s', (locale) => {
    const copy = aiEmployeeContent[locale]

    expect(copy.brandName).toBe('ROALLA')
    expect(copy.heroImage.src).toContain('practical-ai-use-cases.opt.webp')
    expect(copy.heroImage.alt).toBeTruthy()
    expect(copy.howSteps).toHaveLength(4)
    expect(copy.howSteps.every((step) => Boolean(step.image?.src && step.image.alt))).toBe(true)
    expect(copy.industries).toHaveLength(15)
    expect(copy.industries.every((item) => Boolean(item.image?.src && item.image.alt))).toBe(true)
    expect(copy.industries.every((item) => item.image.src.endsWith('.opt.webp'))).toBe(true)
    expect(copy.relatedLinks.every((item) => Boolean(item.image?.src && item.image.alt))).toBe(true)
    expect(copy.industries[0].id).toBe('it-msp')
    expect(copy.industries[0].image.src).toContain('it-provider-who-owns-risk.opt.webp')
    expect(copy.industries[1].id).toBe('recruiting-staffing')
    expect(copy.industries.find((item) => item.id === 'recruiting-staffing')?.audiences).toHaveLength(2)
  })

  it('preserves solutions attribution on fit and contact handoffs', () => {
    const inbound = readAttributionFromSearch(
      '?campaign=solutions-automation-ai&conversion_source=solutions_group_interactive&entry_page=%2Fsolutions%2Fneed%2Fautomation-ai&signal=ai-employee&selected_problem=ai-employee',
    )

    const fitHref = appendAttributionToHref(
      '/en/ai-employee-fit-review?offer=AI%20Employee%20Fit%20Review',
      inbound,
      {
        campaign: 'ai-employee-fit-review',
        conversion_source: 'ai_employee_page',
        entry_page: '/ai-employee',
      },
    )
    const contactHref = appendAttributionToHref('/en/contact?intent=consulting&from_page=%2Fai-employee', inbound, {
      campaign: 'ai-employee',
      conversion_source: 'ai_employee_page',
      entry_page: '/ai-employee',
    })

    expect(fitHref).toContain('campaign=solutions-automation-ai')
    expect(fitHref).toContain('conversion_source=solutions_group_interactive')
    expect(fitHref).toContain('entry_page=%2Fsolutions%2Fneed%2Fautomation-ai')
    expect(fitHref).toContain('signal=ai-employee')
    expect(contactHref).toContain('campaign=solutions-automation-ai')
    expect(contactHref).toContain('entry_page=%2Fsolutions%2Fneed%2Fautomation-ai')
    expect(contactHref).toContain('selected_problem=ai-employee')
  })
})
