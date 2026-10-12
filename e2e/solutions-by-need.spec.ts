import { expect, test } from '@playwright/test'

test.describe('Solutions by Need', () => {
  test('Technology Solutions groups business needs, capabilities, and the assessment', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/en')

    await page.getByLabel('Main navigation').getByRole('button', { name: 'Technology Solutions' }).click()
    const menu = page.getByRole('menu', { name: 'Technology Solutions' })
    await expect(menu.getByText('By Business Need', { exact: true })).toBeVisible()
    await expect(menu.getByText('By Technology & Capability', { exact: true })).toBeVisible()
    await expect(menu.getByRole('menuitem')).toHaveCount(15)
    await expect(menu.getByRole('menuitem', { name: /Set direction and priorities/ })).toHaveAttribute('href', '/en/solutions#strategy')
    await expect(menu.getByRole('menuitem', { name: /Find Your Starting Point/ })).toHaveAttribute('href', '/en/assessment')
  })

  test('central page presents eight outcome pathways linked to existing services', async ({ page }) => {
    await page.goto('/en/solutions')

    await expect(page.getByRole('heading', { level: 1, name: 'Start with the outcome you need—not a service name.' })).toBeVisible()
    await expect(page.locator('article')).toHaveCount(8)
    await expect(page.locator('#strategy').getByRole('link', { name: /Business Advisory/ })).toHaveAttribute('href', '/en/programs/business-enablement')
    await expect(page.locator('#optimization').getByRole('link', { name: /Managed Optimization/ })).toHaveAttribute('href', '/en/services/managed-optimization')
    await expect(page.getByRole('link', { name: 'Find your starting point' }).first()).toHaveAttribute('href', '/en/assessment')
  })

  test('mobile navigation exposes the responsive needs menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/en')
    await page.getByRole('button', { name: 'Open menu' }).click()
    const mobileMenu = page.getByRole('dialog', { name: 'Mobile navigation' })
    await mobileMenu.getByRole('button', { name: 'Technology Solutions' }).click()
    await expect(mobileMenu.getByText('By Business Need', { exact: true })).toBeVisible()
    await expect(mobileMenu.getByText('By Technology & Capability', { exact: true })).toBeVisible()
    await expect(mobileMenu.getByRole('link', { name: /Build a digital experience/ })).toHaveAttribute('href', '/en/solutions#digital-experience')
  })
})
