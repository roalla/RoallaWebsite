import { test, expect } from '@playwright/test'

test.describe('Header', () => {
  test('homepage has skip link and main content', async ({ page }) => {
    await page.goto('/')
    const skip = page.getByRole('link', { name: /skip to main content/i })
    await expect(skip).toHaveAttribute('href', '#main-content')
    await skip.focus()
    await expect(skip).toBeFocused()
    await expect(page.locator('#main-content')).toBeVisible()
  })

  test('services dropdown lists three destinations when open', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/en')

    await page.locator('#services-dropdown-desktop').click()
    const menu = page.locator('[aria-labelledby="services-dropdown-desktop"]')
    await expect(menu.locator('a[role="menuitem"]')).toHaveCount(3)
  })

  test('primary service routes are reachable', async ({ page }) => {
    await page.goto('/en/services')
    await expect(page.getByRole('heading', { name: 'Our Services', level: 1 })).toBeVisible()

    await page.goto('/en/services/digital')
    await expect(page.getByRole('heading', { name: 'Digital Creations', level: 1 })).toBeVisible()

    await page.goto('/en/digital-creations')
    await expect(page.getByRole('heading', { name: 'Our Digital Work', level: 1 })).toBeVisible()
  })
})
