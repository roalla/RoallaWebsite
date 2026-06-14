import { test, expect } from '@playwright/test'

test.describe('Homepage brand journey', () => {
  test('hero keeps three-phase journey line; site shows Prepare → Transform → Emerge → Soar elsewhere', async ({ page }) => {
    await page.goto('/en')

    await expect(page.getByText(/Transform.*Emerge.*Soar/).first()).toBeVisible()
    await expect(page.getByText(/Prepare → Transform → Emerge → Soar/)).toBeVisible()
    await expect(page.getByRole('heading', { name: 'What we do' })).toBeVisible()
    await expect(page.locator('#services')).toBeVisible()
  })

  test('journey teaser links to services', async ({ page }) => {
    await page.goto('/en')
    await page.getByRole('link', { name: 'Explore our approach' }).click()
    await expect(page).toHaveURL(/\/services/)
    await expect(page.locator('#pillar-prepare')).toBeVisible()
  })
})
