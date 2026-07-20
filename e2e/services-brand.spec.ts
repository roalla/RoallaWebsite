import { test, expect } from '@playwright/test'

test.describe('Services brand journey', () => {
  test('consulting page shows plain services and how we work', async ({ page }) => {
    await page.goto('/en/programs/business-enablement')

    await expect(page.getByRole('heading', { name: 'Our Services', level: 1 })).toBeVisible()
    await expect(page.getByText(/Prepare.*Transform.*Emerge.*Soar/)).toHaveCount(0)
    await expect(page.locator('#pillar-prepare')).toHaveCount(0)
    await expect(page.locator('#pillar-transform')).toHaveCount(0)
    await expect(page.locator('#pillar-emerge')).toHaveCount(0)
    await expect(page.locator('#pillar-soar')).toHaveCount(0)

    await expect(page.getByRole('heading', { name: 'Strategic Planning', level: 3 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Process Optimization', level: 3 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Team Development', level: 3 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Data Analytics', level: 3 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Innovation & Growth', level: 3 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Digital Transformation', level: 3 })).toBeVisible()

    await expect(page.getByRole('heading', { name: 'How we work with you', level: 2 })).toBeVisible()
    await expect(page.getByText('Discovery call to align on goals, constraints, and urgency.')).toBeVisible()
  })

  test('digital page leads with build offers and process line', async ({ page }) => {
    await page.goto('/en/services/digital')

    await expect(page.getByRole('heading', { name: 'Websites & Brand Presence', level: 3 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Custom Platforms & Digital Tools', level: 3 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Workflow Automation & Integrations', level: 3 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'AI Support & Intelligent Workflows', level: 3 })).toBeVisible()
    await expect(page.locator('#websites')).toBeVisible()
    await expect(page.locator('#ai-support')).toBeVisible()
    await expect(page.locator('#digital-builds').getByText(/Prepare.*Transform.*Emerge.*Soar/).first()).toBeVisible()
  })

  test('service jump nav scrolls to section', async ({ page }) => {
    await page.goto('/en/programs/business-enablement')
    await page.getByRole('link', { name: 'Team Development', exact: true }).first().click()
    await expect(page.locator('#people')).toBeInViewport()
  })
})
