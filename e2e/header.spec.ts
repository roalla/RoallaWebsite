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

  test('digital enablement dropdown lists destinations when open', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/en')

    await page.locator('#digital-dropdown-desktop').click()
    const menu = page.locator('[aria-labelledby="digital-dropdown-desktop"]')
    await expect(menu.locator('a[role="menuitem"]')).toHaveCount(6)
  })

  test('digital portfolio link is in the header', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/en')

    await expect(page.getByRole('link', { name: 'Digital Portfolio' })).toHaveAttribute(
      'href',
      '/en/services/portfolio'
    )
  })

  test('programs dropdown lists program destinations when open', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/en')

    await page.locator('#programs-dropdown-desktop').click()
    const menu = page.locator('[aria-labelledby="programs-dropdown-desktop"]')
    await expect(menu.locator('a[role="menuitem"]')).toHaveCount(2)
  })

  test('primary service routes are reachable', async ({ page }) => {
    await page.goto('/en/programs/business-enablement')
    await expect(page.getByRole('heading', { name: 'Our Services', level: 1 })).toBeVisible()

    await page.goto('/en/services/digital')
    await expect(page.getByRole('heading', { name: 'Digital Enablement', level: 1 })).toBeVisible()

    await page.goto('/en/services/digital-events')
    await expect(page.getByRole('heading', { name: 'Digital Events', level: 1 })).toBeVisible()

    await page.goto('/en/services/portfolio')
    await expect(page.getByRole('heading', { name: 'Digital Portfolio', level: 1 })).toBeVisible()
  })

  test('homepage hides founding client promo link', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/en')

    await expect(page.getByRole('link', { name: /5-page website package/i })).toHaveCount(0)
  })

  test('founding client promo appears on digital routes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/en/services/digital')

    const promo = page.getByRole('link', { name: /5-page website package/i })
    await expect(promo).toBeVisible()
    await expect(promo).toHaveAttribute('href', '/en/website-package')
  })

  test('founding client promo is hidden on the offer page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/en/website-package')

    await expect(page.getByRole('link', { name: /5-page website package/i })).toHaveCount(0)
  })
})
