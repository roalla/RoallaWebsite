import { test, expect } from '@playwright/test'

test.describe('Homepage funnel', () => {
  test('hero shows unified technology positioning and primary CTAs', async ({ page }) => {
    await page.goto('/en')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Business outcomes first/i)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Practical solutions delivered/i)
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

    await expect(page.getByRole('heading', { name: 'Be easier to find—and win more customers' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Improve an experience—or launch something new' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Automate valuable work—and apply AI with human control' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Reduce risk, strengthen security, and support compliance' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Turn priorities into focused, measurable execution' })).toBeVisible()
    await expect(page.locator('#choose-your-situation').getByRole('heading', { level: 3 })).toHaveCount(5)
  })

  test('new homepage positioning has French parity', async ({ page }) => {
    await page.goto('/fr')

    await expect(page.getByRole('heading', { name: 'Être plus facile à trouver—et gagner plus de clients' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Améliorer une expérience—ou lancer quelque chose de nouveau' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Automatiser le travail utile—et appliquer l’IA avec contrôle humain' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Réduire le risque, renforcer la sécurité et soutenir la conformité' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Transformer les priorités en exécution ciblée et mesurable' })).toBeVisible()
    await expect(page.locator('#choose-your-situation').getByRole('heading', { level: 3 })).toHaveCount(5)
  })
})
