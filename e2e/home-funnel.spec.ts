import { test, expect } from '@playwright/test'

test.describe('Homepage funnel', () => {
  test('hero offers three service paths', async ({ page }) => {
    await page.goto('/en')
    await expect(page.getByRole('link', { name: /Explore Business Enablement/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Explore Digital Creations/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /View live portfolio/i }).first()).toBeVisible()
  })

  test('what we do appears before proof band', async ({ page }) => {
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
