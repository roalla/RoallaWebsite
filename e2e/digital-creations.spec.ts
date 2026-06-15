import { test, expect } from '@playwright/test'

test.describe('Digital creations portfolio order', () => {
  test('hero, jump nav, and all projects list platforms first', async ({ page }) => {
    await page.goto('/en/services/portfolio')

    const heroLinks = page.locator('main header a[href^="https://"]')
    await expect(heroLinks.nth(0)).toContainText('businesscocoon.com')
    await expect(heroLinks.nth(1)).toContainText('4theblueprint.com')
    await expect(heroLinks.nth(2)).toContainText('soaringpuck.com')
    await expect(heroLinks.nth(3)).toContainText('keneffect.com')
    await expect(heroLinks.nth(4)).toContainText('coldbru.dejabru.ca')
    await expect(heroLinks.nth(5)).toContainText('k3green-production.up.railway.app')
    await expect(heroLinks.nth(6)).toContainText('roalla.com')

    const jumpNav = page.getByRole('navigation', { name: 'Jump to project' })
    const jumpLinks = jumpNav.getByRole('link')
    await expect(jumpLinks.nth(0)).toHaveText(/Business Cocoon/i)
    await expect(jumpLinks.nth(1)).toHaveText(/4 The Blueprint/i)
    await expect(jumpLinks.nth(2)).toHaveText(/Soaring Puck/i)
    await expect(jumpLinks.nth(3)).toHaveText(/Ken Effect/i)
    await expect(jumpLinks.nth(4)).toHaveText(/Cold Deja Bru/i)
    await expect(jumpLinks.nth(5)).toHaveText(/Pulsavant Solutions/i)
    await expect(jumpLinks.nth(6)).toHaveText(/ROALLA/i)

    const projectCards = page.locator('#portfolio article h3')
    await expect(projectCards.nth(0)).toHaveText(/4 The Blueprint/i)
    await expect(projectCards.nth(1)).toHaveText(/Soaring Puck/i)
    await expect(projectCards.nth(2)).toHaveText(/Ken Effect/i)
    await expect(projectCards.nth(3)).toHaveText(/Cold Deja Bru/i)
    await expect(projectCards.nth(4)).toHaveText(/Pulsavant Solutions/i)
    await expect(projectCards.nth(5)).toHaveText(/ROALLA/i)
  })
})
