import { expect, test } from '@playwright/test'
import { campaignReviewContent, campaignReviewIds } from '../src/lib/campaign-review-content'

test.describe('Campaign review landing pages', () => {
  for (const locale of ['en', 'fr'] as const) {
    test(`${locale} campaign routes are complete and actionable`, async ({ page }) => {
      for (const id of campaignReviewIds) {
        const content = campaignReviewContent[id][locale]
        await page.goto(`/${locale}/${id}`)

        await expect(page.getByRole('heading', { level: 1, name: content.title })).toBeVisible()
        await expect(page.getByRole('link', { name: content.primaryCta }).first()).toHaveAttribute(
          'href',
          `/${locale}${content.toolPath}`,
        )
        await expect(page.getByRole('link', { name: content.serviceCta })).toHaveAttribute(
          'href',
          `/${locale}${content.servicePath}`,
        )
      }
    })
  }
})
