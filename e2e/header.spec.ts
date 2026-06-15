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

  test('services dropdown lists destinations when open', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/en')

    await page.locator('#services-dropdown-desktop').click()
    const menu = page.locator('[aria-labelledby="services-dropdown-desktop"]')
    await expect(menu.locator('a[role="menuitem"]')).toHaveCount(4)
  })

  test('digital portfolio link is in the header', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/en')

    await expect(page.getByRole('link', { name: 'Digital Portfolio' })).toHaveAttribute(
      'href',
      '/en/services/portfolio'
    )
  })

  test('apps dropdown lists company apps when open', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/en')

    await page.locator('#apps-dropdown-desktop').click()
    const menu = page.locator('[aria-labelledby="apps-dropdown-desktop"]')
    await expect(menu.locator('a[role="menuitem"]')).toHaveCount(2)
    await expect(menu.getByRole('menuitem', { name: /Business Cocoon/i })).toHaveAttribute(
      'href',
      'https://www.businesscocoon.com'
    )
    await expect(menu.getByRole('menuitem', { name: /4 The Blueprint/i })).toHaveAttribute(
      'href',
      'https://www.4theblueprint.com'
    )
  })

  test('primary service routes are reachable', async ({ page }) => {
    await page.goto('/en/services')
    await expect(page.getByRole('heading', { name: 'Our Services', level: 1 })).toBeVisible()

    await page.goto('/en/services/digital')
    await expect(page.getByRole('heading', { name: 'Digital Creations', level: 1 })).toBeVisible()

    await page.goto('/en/services/digital-events')
    await expect(page.getByRole('heading', { name: 'Digital Events', level: 1 })).toBeVisible()

    await page.goto('/en/services/portfolio')
    await expect(page.getByRole('heading', { name: 'Digital Portfolio', level: 1 })).toBeVisible()
  })
})
