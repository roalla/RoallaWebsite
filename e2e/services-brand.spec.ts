import { test, expect } from '@playwright/test'

test.describe('Services brand journey', () => {
  test('consulting page shows Prepare → Transform → Emerge → Soar pillars', async ({ page }) => {
    await page.goto('/en/services')

    await expect(page.locator('#services').getByText(/Prepare.*Transform.*Emerge.*Soar/).first()).toBeVisible()
    await expect(page.locator('#pillar-prepare')).toBeVisible()
    await expect(page.locator('#pillar-transform')).toBeVisible()
    await expect(page.locator('#pillar-emerge')).toBeVisible()
    await expect(page.locator('#pillar-soar')).toBeVisible()

    await expect(page.getByRole('heading', { name: 'Strategic Planning', level: 3 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Team Development', level: 3 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Innovation & Growth', level: 3 })).toBeVisible()
  })

  test('digital page shows pillar sections and build offers', async ({ page }) => {
    await page.goto('/en/services/digital')

    await expect(page.locator('#digital-builds').getByText(/Prepare.*Transform.*Emerge.*Soar/).first()).toBeVisible()
    await expect(page.locator('#pillar-prepare')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Websites & Brand Presence', level: 3 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Custom Platforms & Digital Tools', level: 3 })).toBeVisible()
  })

  test('pillar anchor nav scrolls to section', async ({ page }) => {
    await page.goto('/en/services')
    await page.getByRole('link', { name: 'Emerge', exact: true }).first().click()
    await expect(page.locator('#pillar-emerge')).toBeInViewport()
  })
})
