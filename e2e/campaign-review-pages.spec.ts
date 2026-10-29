import { expect, test } from '@playwright/test'
import { campaignReviewContent, campaignReviewIds } from '../src/lib/campaign-review-content'

test.describe('Campaign review landing pages', () => {
  for (const locale of ['en', 'fr'] as const) {
    test(`${locale} campaign routes are complete and actionable`, async ({ page }) => {
      for (const id of campaignReviewIds) {
        const content = campaignReviewContent[id][locale]
        await page.goto(`/${locale}/${id}`)

        await expect(page.getByRole('heading', { level: 1, name: content.title })).toBeVisible()
        const primaryHref = await page.getByRole('link', { name: content.primaryCta }).first().getAttribute('href')
        const primaryUrl = new URL(primaryHref!, 'https://www.roalla.com')
        expect(primaryUrl.pathname).toBe(`/${locale}${content.toolPath}`)
        expect(primaryUrl.searchParams.get('campaign')).toBe(id)
        await expect(page.getByRole('link', { name: content.serviceCta })).toHaveAttribute(
          'href',
          `/${locale}${content.servicePath}`,
        )
      }
    })
  }

  test('campaign CTAs preserve UTM context through the inquiry', async ({ page }) => {
    await page.goto('/en/communications-modernization-review?utm_source=linkedin&utm_medium=paid-social&utm_campaign=comms-renewal&utm_content=operations-leader')
    const inquiryLink = page.getByRole('link', { name: 'Request a requirements review' }).first()
    await expect(inquiryLink).toHaveAttribute('href', /utm_source=linkedin/)
    const href = await inquiryLink.getAttribute('href')
    const inquiry = new URL(href!, 'https://www.roalla.com')

    expect(inquiry.pathname).toBe('/en/contact')
    expect(inquiry.searchParams.get('campaign')).toBe('communications-modernization-review')
    expect(inquiry.searchParams.get('offer')).toBe('Communications Modernization Review')
    expect(inquiry.searchParams.get('conversion_source')).toBe('campaign_page')
    expect(inquiry.searchParams.get('utm_source')).toBe('linkedin')
    expect(inquiry.searchParams.get('utm_medium')).toBe('paid-social')
    expect(inquiry.searchParams.get('utm_campaign')).toBe('comms-renewal')
    expect(inquiry.searchParams.get('utm_content')).toBe('operations-leader')
    expect(inquiry.searchParams.get('entry_page')).toBe('/en/communications-modernization-review')
    expect(inquiry.searchParams.get('selected_problem')).toBe('communications-modernization-review')
  })
})
