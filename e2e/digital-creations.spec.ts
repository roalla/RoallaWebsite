import { test, expect } from '@playwright/test'

test.describe('Digital creations portfolio', () => {
  test('hero chips lead with Pitch Hotshots and featured case is Pitch Hotshots', async ({ page }) => {
    await page.goto('/en/services/portfolio')

    const heroChips = page.getByTestId('hero-live-chips').locator('a[href^="https://"]')
    await expect(heroChips.nth(0)).toContainText('pitchhotshot.com')

    await expect(page.locator('#featured-case').getByRole('heading', { name: /Pitch Hotshots/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Digital Portfolio', level: 1 })).toBeVisible()
    await expect(page.getByText("What you'll find")).toHaveCount(0)

    const projectCards = page.locator('#portfolio-grid article h3')
    await expect(projectCards.first()).toBeVisible()
  })

  test('origin filter shows client sites only', async ({ page }) => {
    await page.goto('/en/services/portfolio')
    await page.getByRole('tab', { name: 'Client sites' }).click()
    await expect(page).toHaveURL(/origin=client/)
    await expect(page.locator('#portfolio-grid').getByText('Client project').first()).toBeVisible()
    await expect(page.locator('#portfolio-grid').getByText('Roalla product')).toHaveCount(0)
  })
})
