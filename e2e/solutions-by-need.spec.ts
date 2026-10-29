import { expect, test } from '@playwright/test'

test.describe('Solutions by Need', () => {
  test('Advisory & Workshops begins with outcomes and retains engagement options', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/en')

    await page.getByLabel('Main navigation').getByRole('button', { name: 'Advisory & Workshops' }).click()
    const menu = page.locator('[aria-labelledby="workshops-dropdown-desktop"]')
    await expect(menu.getByText('Advisory Outcomes', { exact: true })).toBeVisible()
    await expect(menu.getByText('Ways to Work With Us', { exact: true })).toBeVisible()
    await expect(menu.getByRole('menuitem', { name: /Set direction and priorities/ })).toHaveAttribute('href', '/en/services/business-advisory')
    await expect(menu.getByRole('menuitem', { name: /Turn an idea into an actionable plan/ })).toHaveAttribute('href', '/en/programs/workshops/ideation')
    await expect(menu.getByRole('menuitem', { name: /Business Advisory/ })).toHaveAttribute('href', '/en/services/business-advisory')
    await expect(menu.getByRole('menuitem', { name: /Team Workshops/ })).toHaveAttribute('href', '/en/programs/workshops')
  })

  test('How We Help leads with five outcomes and preserves detailed capabilities', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/en')

    await page.getByLabel('Main navigation').getByRole('button', { name: 'How We Help' }).click()
    const menu = page.locator('[aria-labelledby="digital-dropdown-desktop"]')
    await expect(menu.getByText('What needs to change next?', { exact: true })).toBeVisible()
    await expect(menu.getByText('Browse by Business Outcome', { exact: true })).toBeVisible()
    await expect(menu.getByRole('menuitem', { name: /Be Easier to Find and Win More Customers/ })).toHaveAttribute('href', '/en/solutions/need/growth-visibility')
    await expect(menu.getByRole('menuitem', { name: /Reduce Risk, Strengthen Security/ })).toHaveAttribute('href', '/en/solutions/need/security-compliance')
    await expect(menu.getByRole('menuitem', { name: /Technology Advisory & Solution Sourcing/ })).toHaveAttribute('href', '/en/services/technology-advisory')
    await expect(menu.getByRole('menuitem', { name: /Security, Risk & Compliance/ })).toHaveAttribute('href', '/en/services/security-risk-compliance')
    await expect(menu.getByRole('menuitem', { name: /View all outcome pathways/ })).toHaveAttribute('href', '/en/solutions')
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
    await mobileMenu.getByRole('button', { name: 'How We Help' }).click()
    await expect(mobileMenu.getByText('What needs to change next?', { exact: true })).toBeVisible()
    await expect(mobileMenu.getByText('Browse by Business Outcome', { exact: true })).toBeVisible()
    await expect(mobileMenu.getByRole('link', { name: /Improve an Experience or Launch Something New/ })).toHaveAttribute('href', '/en/solutions/need/experience-products')
    await expect(mobileMenu.getByRole('link', { name: /Security, Risk & Compliance/ })).toHaveAttribute('href', '/en/services/security-risk-compliance')
    await expect(mobileMenu.getByRole('link', { name: /Browse by Business Outcome/ })).toHaveAttribute('href', '/en/solutions')
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
