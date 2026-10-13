import { expect, test } from '@playwright/test'

test.describe('Solutions by Need', () => {
  test('Solutions preserves outcome-first and technology-first discovery', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/en')

    await page.getByLabel('Main navigation').getByRole('button', { name: 'Solutions' }).click()
    const menu = page.getByRole('menu', { name: 'Solutions' })
    await expect(menu.getByText('What You Want to Achieve', { exact: true })).toBeVisible()
    await expect(menu.getByText('Explore Technologies', { exact: true })).toBeVisible()
    await expect(menu.getByRole('menuitem')).toHaveCount(17)
    await expect(menu.getByRole('menuitem', { name: /Set direction and priorities/ })).toHaveAttribute('href', '/en/solutions/strategy')
    await expect(menu.getByRole('menuitem', { name: /Explore Your Options/ })).toHaveAttribute('href', '/en/assessment')
  })

  test('central page presents nine outcome pathways linked to dedicated pages', async ({ page }) => {
    await page.goto('/en/solutions')

    await expect(page.getByRole('heading', { level: 1, name: 'Start with the outcome you need—not a service name.' })).toBeVisible()
    await expect(page.locator('a#strategy')).toHaveAttribute('href', '/en/solutions/strategy')
    await expect(page.locator('a#visibility')).toHaveAttribute('href', '/en/solutions/visibility')
    await expect(page.getByRole('link', { name: 'Find your starting point' }).first()).toHaveAttribute('href', '/en/assessment')
  })

  test('mobile navigation exposes the responsive needs menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/en')
    await page.getByRole('button', { name: 'Open menu' }).click()
    const mobileMenu = page.getByRole('dialog', { name: 'Mobile navigation' })
    await mobileMenu.getByRole('button', { name: 'Solutions' }).click()
    await expect(mobileMenu.getByText('What You Want to Achieve', { exact: true })).toBeVisible()
    await expect(mobileMenu.getByText('Explore Technologies', { exact: true })).toBeVisible()
    await expect(mobileMenu.getByRole('link', { name: /Build a digital experience/ })).toHaveAttribute('href', '/en/solutions/digital-experience')
  })

  test('dedicated outcome page is visual, concise, and preserves context in its quick inquiry', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/en/solutions/automation-ai')

    await expect(page.getByRole('heading', { level: 1, name: /Reduce manual effort/ })).toBeVisible()
    await expect(page.locator('main img').first()).toHaveAttribute('alt', /responsible automation workflow/i)
    await expect(page.getByRole('heading', { level: 2, name: 'A clear route from friction to progress' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 3, name: 'Custom integration and governed enablement' })).toBeVisible()
    await page.locator('#outcome-contact').scrollIntoViewIfNeeded()
    await expect(page.locator('#outcome-contact textarea')).toHaveValue(/Automate work with control/)
    await expect(page.locator('#outcome-contact input[type="email"]')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  })
})
