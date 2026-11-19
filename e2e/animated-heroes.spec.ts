import { expect, test } from '@playwright/test'

const heroRoutes = [
  { path: '/en', testId: 'connected-intelligence-hero', image: 'roalla-hero-homepage-desktop-1.webp' },
  { path: '/en/services/technology-advisory', testId: 'digital-command-centre-hero', image: 'technology-advisory-hero.opt.webp' },
  { path: '/en/services/automation', testId: 'digital-transformation-hero', image: 'automation-hero.opt.webp' },
] as const

test.describe('ROALLA animated heroes', () => {
  for (const { path, testId, image } of heroRoutes) {
    test(`${testId} is responsive without horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(path)

      await expect(page.getByTestId(testId)).toBeVisible()
      await expect(page.getByTestId(testId).locator('img')).toHaveAttribute('src', new RegExp(`${image.replaceAll('.', '\\.')}$`))
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }))
      expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport)
    })
  }

  test('hero motion respects reduced-motion preferences', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/en')

    const animationNames = await page
      .getByTestId('connected-intelligence-hero')
      .locator('*')
      .evaluateAll((elements) => elements.map((element) => getComputedStyle(element).animationName))
    expect(animationNames.every((name) => name === 'none')).toBe(true)
  })
})
