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

  test('services dropdown links to business enablement and websites pages', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/en')

    const servicesButton = page.locator('#services-dropdown-desktop')
    await expect(servicesButton).toBeVisible()
    await servicesButton.click()

    const menu = page.locator('[aria-labelledby="services-dropdown-desktop"]')
    await expect(menu.getByRole('menuitem', { name: 'Business Enablement' })).toBeVisible()
    await menu.getByRole('menuitem', { name: 'Digital Creations' }).click()
    await expect(page).toHaveURL(/\/services\/digital/)
    await expect(page.getByRole('heading', { name: 'Digital Creations', level: 1 })).toBeVisible()
  })

  test('services menu includes portfolio link to digital creations', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/en')

    const servicesButton = page.locator('#services-dropdown-desktop')
    await servicesButton.click()

    const menu = page.locator('[aria-labelledby="services-dropdown-desktop"]')
    await expect(menu.locator('a[href*="/digital-creations"]')).toBeVisible()
    await menu.locator('a[href*="/digital-creations"]').click()
    await expect(page).toHaveURL(/\/digital-creations/)
    await expect(page.getByRole('heading', { name: 'Our Digital Work', level: 1 })).toBeVisible()
  })
})
