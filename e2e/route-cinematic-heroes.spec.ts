import { expect, test } from '@playwright/test'

const routes = [
  ['/en/solutions/need/growth-visibility', 'growth-visibility'],
  ['/en/solutions/need/automation-ai', 'automation-ai'],
  ['/en/solutions/need/execution', 'execution'],
  ['/en/solutions/need/experience-products', 'experience-products'],
  ['/en/solutions/need/security-compliance', 'security-compliance'],
  ['/en/services/digital-products', 'digital-products'],
  ['/en/services/ai-agents', 'ai-agents'],
  ['/en/services/security-risk-compliance', 'security-risk-compliance'],
  ['/en/services/managed-optimization', 'managed-optimization'],
] as const

test.describe('route cinematic heroes', () => {
  for (const [path, variant] of routes) {
    test(`${variant} renders its own animated artwork`, async ({ page }) => {
      await page.goto(path)
      const artwork = page.locator(`[data-hero-variant="${variant}"]`)
      await expect(artwork).toBeVisible()
      await expect(artwork.locator('svg')).toBeVisible()
      await expect(artwork.locator('.cinematic-flow path').first()).toHaveCSS('animation-name', 'cinematic-flow')
      await expect(page.locator('h1')).toBeVisible()
    })
  }

  test('mobile keeps the right-weighted artwork behind readable hero copy', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/en/solutions/need/growth-visibility')
    await expect(page.locator('[data-hero-variant="growth-visibility"] svg')).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()
  })

  test('reduced motion preserves a still artwork', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/en/services/ai-agents')
    const artwork = page.locator('[data-hero-variant="ai-agents"]')
    await expect(artwork).toBeVisible()
    await expect(artwork.locator('.cinematic-flow path').first()).toHaveCSS('animation-name', 'none')
  })
})
