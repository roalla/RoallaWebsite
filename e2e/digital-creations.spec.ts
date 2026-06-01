import { test, expect } from '@playwright/test'

test.describe('Digital creations portfolio order', () => {
  test('hero, jump nav, and all projects list platforms first', async ({ page }) => {
    await page.goto('/en/digital-creations')

    const heroLinks = page.locator('main header a[href^="https://"]')
    await expect(heroLinks.nth(0)).toContainText('businesscocoon.com')
    await expect(heroLinks.nth(1)).toContainText('soaringpuck.com')
    await expect(heroLinks.nth(2)).toContainText('keneffect.com')
    await expect(heroLinks.nth(3)).toContainText('roalla.com')

    const jumpNav = page.getByRole('navigation', { name: 'Jump to project' })
    const jumpLinks = jumpNav.getByRole('link')
    await expect(jumpLinks.nth(0)).toHaveText(/Business Cocoon/i)
    await expect(jumpLinks.nth(1)).toHaveText(/Soaring Puck/i)
    await expect(jumpLinks.nth(2)).toHaveText(/Ken Effect/i)
    await expect(jumpLinks.nth(3)).toHaveText(/ROALLA/i)

    const projectCards = page.locator('#digital-creations article h3')
    await expect(projectCards.nth(0)).toHaveText(/Soaring Puck/i)
    await expect(projectCards.nth(1)).toHaveText(/Ken Effect/i)
    await expect(projectCards.nth(2)).toHaveText(/ROALLA/i)
  })
})
