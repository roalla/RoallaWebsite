import { test, expect } from '@playwright/test'

test.describe('Homepage funnel', () => {
  test('hero shows journey headline and primary CTAs', async ({ page }) => {
    await page.goto('/en')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Prepare\. Transform\. Emerge\./i)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Soar\./i)
    await expect(page.getByRole('link', { name: /Scope your project/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /View our work/i }).first()).toBeVisible()
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
