import { test, expect } from '@playwright/test'

test.describe('Homepage funnel', () => {
  test('hero offers digital intent paths and programs link', async ({ page }) => {
    await page.goto('/en')
    await expect(page.getByRole('link', { name: /Website or redesign/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Custom app or platform/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Integrate, automate, or add AI/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /See Programs/i }).first()).toBeVisible()
  })

  test('what we do appears before our work section', async ({ page }) => {
    await page.goto('/en')
    const whatWeDo = page.locator('#services')
    const ourWork = page.locator('#our-work')
    const whatBox = await whatWeDo.boundingBox()
    const workBox = await ourWork.boundingBox()
    expect(whatBox).not.toBeNull()
    expect(workBox).not.toBeNull()
    expect(whatBox!.y).toBeLessThan(workBox!.y)
  })
})
