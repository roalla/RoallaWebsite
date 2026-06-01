import { test, expect } from '@playwright/test'

test.describe('Service pages', () => {
  test('business enablement page loads with pillar sections', async ({ page }) => {
    await page.goto('/en/services')
    await expect(page.getByRole('heading', { name: 'Our Services', level: 1 })).toBeVisible()
    await expect(page.locator('#pillar-transform')).toBeVisible()
    await expect(page.getByText(/Not sure which lane fits/i)).toBeVisible()
  })

  test('digital creations service page links to portfolio', async ({ page }) => {
    await page.goto('/en/services/digital')
    await expect(page.getByRole('heading', { name: 'Digital Creations', level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: /View full portfolio/i })).toBeVisible()
  })

  test('schedule page shows business enablement intent', async ({ page }) => {
    await page.goto('/en/schedule')
    await expect(page.getByRole('heading', { name: /Service Inquiry/i, level: 1 })).toBeVisible()
    await expect(page.getByRole('button', { name: /Business Enablement/i })).toBeVisible()
  })
})
