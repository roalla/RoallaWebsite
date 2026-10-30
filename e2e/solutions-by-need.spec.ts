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

  test('central page presents guided outcomes linked to dedicated pages', async ({ page }) => {
    await page.goto('/en/solutions')

    await expect(page.getByRole('heading', { level: 1, name: 'What does your business need to do next?' })).toBeVisible()
    await expect(page.locator('main img[alt^="My360Vision"]')).toHaveCount(2)
    await expect(page.locator('a[href="#published-work"]')).toHaveAttribute('href', '#published-work')
    await expect(page.getByRole('heading', { level: 2, name: 'See what ROALLA has built.' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'View the case study' }).first()).toHaveAttribute('href', '/en/services/portfolio/grcstatus')
    await expect(page.getByRole('link', { name: 'Explore all websites and applications' })).toHaveAttribute('href', '/en/services/portfolio')
    await page.locator('#growth-visibility > summary').click()
    await page.locator('#growth-visibility').getByRole('button', { name: /Buyers can’t find us/ }).click()
    await expect(page.getByRole('link', { name: 'Improve visibility and conversion' })).toHaveAttribute('href', '/en/solutions/visibility')
    await page.locator('#execution > summary').click()
    await page.locator('#execution').getByRole('button', { name: /Too many priorities are competing/ }).click()
    await expect(page.getByRole('link', { name: 'Set direction and priorities' })).toHaveAttribute('href', '/en/solutions/strategy')
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
    await expect(page.locator('main img[src*="what-to-automate-first"]')).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'A clear route from friction to progress' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 3, name: 'Custom integration and governed enablement' })).toBeVisible()
    await page.locator('#outcome-contact').scrollIntoViewIfNeeded()
    await expect(page.locator('#outcome-contact textarea')).toHaveValue(/Automate work with control/)
    await expect(page.locator('#outcome-contact input[type="email"]')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  })

  test('growth and visibility tiles change guidance and reserve the website checker for findability', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/en/solutions/need/growth-visibility')

    await expect(page.getByLabel('Your website address')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Buyers can’t find us', exact: true })).toBeVisible()
    await expect(page.getByText('Typical causes')).toBeVisible()

    await page.getByRole('button', { name: /Traffic doesn’t convert/ }).click()
    await expect(page.getByRole('heading', { name: 'Traffic doesn’t convert', exact: true })).toBeVisible()
    await expect(page.getByText('The offer or next step is hard to understand quickly.')).toBeVisible()
    await expect(page.getByText('Review the conversion path')).toBeVisible()
    await expect(page.getByLabel('Your website address')).toHaveCount(0)

    await page.getByRole('button', { name: /Search or AI misunderstands us/ }).click()
    await expect(page.getByRole('heading', { name: 'Search or AI misunderstands us', exact: true })).toBeVisible()
    await expect(page.getByText('Services, expertise, and entity signals lack clear structure.')).toBeVisible()
    await expect(page.getByText('Clarify our public story')).toBeVisible()
    await expect(page.getByLabel('Your website address')).toHaveCount(0)

    await page.getByRole('button', { name: /Campaign emails aren’t reaching customers/ }).click()
    await expect(page.getByRole('heading', { name: 'Campaign emails aren’t reaching customers', exact: true })).toBeVisible()
    await expect(page.getByText('SPF, DKIM, or DMARC is incomplete or misaligned.')).toBeVisible()
    await expect(page.getByText('Review email deliverability')).toBeVisible()
    await expect(page.getByLabel('Your website address')).toHaveCount(0)

    await page.getByRole('button', { name: /Buyers can’t find us/ }).click()
    await expect(page.getByLabel('Your website address')).toBeVisible()
    await expect(page.getByRole('button', { name: /Check my website/ })).toBeVisible()
  })
})
