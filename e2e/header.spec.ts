import { test, expect } from '@playwright/test'

test.describe('Header', () => {
  test('homepage has skip link and main content', async ({ page }) => {
    await page.goto('/')
    const skip = page.getByRole('link', { name: /skip to main content/i })
    await expect(skip).toHaveAttribute('href', '#main-content')
    await skip.focus()
    await expect(skip).toBeFocused()
    await expect(page.locator('#main-content')).toBeVisible()
  })

  test('services dropdown links to business enablement and websites pages', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Services', exact: true }).click()
    await expect(page.getByRole('menuitem', { name: 'Business Enablement' })).toBeVisible()
    await page.getByRole('menuitem', { name: 'Websites & Digital' }).click()
    await expect(page).toHaveURL(/\/services\/digital/)
    await expect(page.getByRole('heading', { name: 'Websites & Digital' })).toBeVisible()
  })

  test('our work link navigates to digital creations portfolio', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Our Work' }).click()
    await expect(page).toHaveURL(/\/digital-creations/)
    await expect(page.getByRole('heading', { name: /Our Work/i })).toBeVisible()
  })
})
