import { test, expect } from '@playwright/test'

test.describe('Homepage brand journey', () => {
  test('hero and how-we-work show Transform → Emerge → Soar', async ({ page }) => {
    await page.goto('/en')

    await expect(page.getByText('Transform → Emerge → Soar').first()).toBeVisible()
    await expect(page.getByRole('heading', { name: 'How we work with you' })).toBeVisible()
    await expect(page.getByText('Transform', { exact: true }).first()).toBeVisible()
  })

  test('how we work links to services', async ({ page }) => {
    await page.goto('/en')
    await page.getByRole('link', { name: 'Explore services by phase' }).click()
    await expect(page).toHaveURL(/\/services/)
    await expect(page.locator('#pillar-transform')).toBeVisible()
  })
})
