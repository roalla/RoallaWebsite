import { test, expect } from '@playwright/test'

test.describe('Digital creations portfolio order', () => {
  test('hero live chips, industry jump nav, and all projects list platforms first', async ({ page }) => {
    await page.goto('/en/services/portfolio')

    const heroChips = page.getByTestId('hero-live-chips').locator('a[href^="https://"]')
    await expect(heroChips.nth(0)).toContainText('businesscocoon.com')
    await expect(heroChips.nth(1)).toContainText('grcstatus.com')
    await expect(heroChips.nth(2)).toContainText('4theblueprint.com')
    await expect(heroChips.nth(3)).toContainText('unjargonit.com')
    await expect(heroChips.nth(4)).toContainText('boothlio.com')
    await expect(heroChips.nth(5)).toContainText('valentir.ca')
    await expect(heroChips.nth(6)).toContainText('my360vision.com')
    await expect(heroChips.nth(7)).toContainText('soaringpuck.com')

    const jumpNav = page.getByRole('navigation', { name: 'Browse by industry' })
    const jumpLinks = jumpNav.getByRole('link')
    await expect(jumpLinks.nth(0)).toHaveText(/Fleet & logistics/i)
    await expect(jumpLinks.nth(1)).toHaveText(/Sports & recreation/i)
    await expect(jumpLinks.nth(2)).toHaveText(/Events & trade shows/i)
    await expect(jumpLinks.nth(3)).toHaveText(/Education & training/i)
    await expect(jumpLinks.nth(4)).toHaveText(/Professional services/i)
    await expect(jumpLinks.nth(5)).toHaveText(/Business platforms/i)

    const projectCards = page.locator('#all-examples article h3')
    await expect(projectCards.nth(0)).toHaveText(/GRCStatus/i)
    await expect(projectCards.nth(1)).toHaveText(/4 The Blueprint/i)
    await expect(projectCards.nth(2)).toHaveText(/Unjargonit/i)
    await expect(projectCards.nth(3)).toHaveText(/Boothlio/i)
    await expect(projectCards.nth(4)).toHaveText(/My360Vision/i)
    await expect(projectCards.nth(5)).toHaveText(/Soaring Puck/i)
    await expect(projectCards.nth(6)).toHaveText(/Pitch Hotshots/i)
    await expect(projectCards.nth(7)).toHaveText(/Ken Effect/i)
    await expect(projectCards.nth(8)).toHaveText(/Goalie Stop/i)
    await expect(projectCards.nth(9)).toHaveText(/Cold Deja Bru/i)
    await expect(projectCards.nth(10)).toHaveText(/ROALLA/i)
  })
})
