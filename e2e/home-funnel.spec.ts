import { test, expect } from '@playwright/test'

test.describe('Homepage funnel', () => {
  test('hero shows unified technology positioning and primary CTAs', async ({ page }) => {
    await page.goto('/en')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Choose the right technology/i)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Get it implemented/i)
    await expect(page.getByRole('link', { name: /Tell us what needs to change/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /See common problems we solve/i }).first()).toHaveAttribute('href', '#choose-your-situation')
  })

  test('customer situations and proof appear before the ecosystem', async ({ page }) => {
    await page.goto('/en')
    const situations = page.locator('#choose-your-situation')
    const ourWork = page.locator('#our-work')
    const ecosystem = page.getByRole('heading', { name: 'The right relationship, clearly explained.' })
    const situationsBox = await situations.boundingBox()
    const workBox = await ourWork.boundingBox()
    const ecosystemBox = await ecosystem.boundingBox()
    expect(situationsBox).not.toBeNull()
    expect(workBox).not.toBeNull()
    expect(ecosystemBox).not.toBeNull()
    expect(situationsBox!.y).toBeLessThan(ecosystemBox!.y)
    expect(workBox!.y).toBeLessThan(ecosystemBox!.y)
  })

  test('business outcomes and visibility positioning are present in English', async ({ page }) => {
    await page.goto('/en')

    await expect(page.getByRole('heading', { name: 'I need to make a technology decision' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'I need more customers or a better digital experience' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'I need to automate inefficient work' })).toBeVisible()
    await expect(page.locator('#choose-your-situation').getByRole('heading', { level: 3 })).toHaveCount(3)
  })

  test('new homepage positioning has French parity', async ({ page }) => {
    await page.goto('/fr')

    await expect(page.getByRole('heading', { name: 'Je dois prendre une décision technologique' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Je veux plus de clients ou une meilleure expérience numérique' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Je dois automatiser un travail inefficace' })).toBeVisible()
    await expect(page.locator('#choose-your-situation').getByRole('heading', { level: 3 })).toHaveCount(3)
  })
})
