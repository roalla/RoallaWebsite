import { expect, test } from '@playwright/test'

const motionExamples = [
  {
    path: '/en/services/ai-agents',
    label: 'Animated example of an AI agent workflow',
    screenshot: 'ai-agents',
  },
  {
    path: '/en',
    label: 'Animated journey from decision to outcome',
    screenshot: 'home-journey',
  },
  {
    path: '/en/services/technology-advisory',
    label: 'Animated technology decision map',
    screenshot: 'technology-decision',
  },
  {
    path: '/en/services/portfolio/grcstatus',
    label: 'Illustrative project walkthrough for GRC Status',
    screenshot: 'portfolio-project',
  },
] as const

test.describe('Operational motion', () => {
  for (const example of motionExamples) {
    test(`${example.path} presents its motion story without horizontal overflow`, async ({ page }) => {
      await page.goto(example.path)

      const motion = page.locator(`figure[aria-label="${example.label}"]`)
      await motion.scrollIntoViewIfNeeded()
      await expect(motion).toBeVisible()
      await expect(motion).toHaveAttribute('data-active', 'true')
      await motion.screenshot({ path: `test-results/operational-motion-${example.screenshot}.png` })

      const widths = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
      }))
      expect(widths.document).toBeLessThanOrEqual(widths.viewport)
    })
  }

  test('the AI workflow remains readable at a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/en/services/ai-agents')

    const motion = page.locator('figure[aria-label="Animated example of an AI agent workflow"]')
    await motion.scrollIntoViewIfNeeded()
    await expect(motion).toBeVisible()

    const box = await motion.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(390)
  })
})
