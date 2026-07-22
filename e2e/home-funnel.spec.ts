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

  test('business outcomes and visibility positioning are present in English', async ({ page }) => {
    await page.goto('/en')

    await expect(
      page.getByRole('heading', { name: 'Digital assets should create business value.' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Applications & Digital Products' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Become easier to find, understand, and trust' }),
    ).toBeVisible()
    await expect(page.getByText('5 websites · 9 digital products · 14 verified examples')).toBeVisible()
  })

  test('new homepage positioning has French parity', async ({ page }) => {
    await page.goto('/fr')

    await expect(
      page.getByRole('heading', {
        name: "Les actifs numériques doivent créer de la valeur d'affaires.",
      }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Applications et produits numériques' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', {
        name: 'Devenez plus facile à trouver, à comprendre et à reconnaître',
      }),
    ).toBeVisible()
  })
})
