import { expect, test } from '@playwright/test'

const heroRoutes = [
  { path: '/en', testId: 'connected-intelligence-hero' },
  { path: '/en/services/technology-advisory', testId: 'digital-command-centre-hero' },
  { path: '/en/services/automation', testId: 'digital-transformation-hero' },
] as const

test.describe('ROALLA animated heroes', () => {
  for (const { path, testId } of heroRoutes) {
    test(`${testId} is responsive without horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(path)

      await expect(page.getByTestId(testId)).toBeVisible()
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
