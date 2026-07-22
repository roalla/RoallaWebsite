import { test, expect } from '@playwright/test'

test.describe('Homepage brand journey', () => {
  test('site shows business outcomes and what we build section', async ({ page }) => {
    await page.goto('/en')

    await expect(page.getByRole('heading', { name: 'Digital assets should create business value.' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'What we build' })).toBeVisible()
    await expect(page.locator('#services')).toBeVisible()
  })

  test('programs strip links to business enablement', async ({ page }) => {
    await page.goto('/en')
    await page.getByRole('link', { name: 'Business Enablement' }).first().click()
    await expect(page).toHaveURL(/\/programs\/business-enablement/)
    await expect(page.getByRole('heading', { name: 'Our Services', level: 1 })).toBeVisible()
  })
})
