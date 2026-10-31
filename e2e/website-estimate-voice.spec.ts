import { expect, test } from '@playwright/test'

test.describe('Website estimate business voice option', () => {
  test('starts at no and reveals Canadian partner pricing only when requested', async ({ page }) => {
    await page.goto('/en/website-estimate')

    const noVoice = page.getByRole('radio', { name: 'No business voice line right now' })
    const yesVoice = page.getByRole('radio', { name: 'Yes, compare business voice options' })

    await expect(noVoice).toBeChecked()
    await expect(page.getByText('Zoom Phone — US & CA Unlimited')).toHaveCount(0)

    await page.getByText('Yes, compare business voice options', { exact: true }).click()

    await expect(yesVoice).toBeChecked()
    await expect(page.getByText('CA$21.60/user/month')).toBeVisible()
    await expect(page.getByText('CA$20.00/user/month')).toBeVisible()
    await expect(page.getByText('CA$15.00/user/month')).toBeVisible()
    await expect(page.getByText('$50 one-time ROALLA setup')).toBeVisible()
    await expect(page.getByText(/may receive a commission/i)).toBeVisible()

    await page.getByText('Nextiva NEXT Core', { exact: true }).click()
    await page.getByRole('spinbutton', { name: 'How many people need their own business phone user?' }).fill('2')

    await expect(page.getByText('Nextiva NEXT Core × 2')).toBeVisible()
    await expect(page.getByText('$360.00')).toBeVisible()
    await page.screenshot({ path: 'test-results/website-estimate-voice.png', fullPage: true })

    await page.getByText('No business voice line right now', { exact: true }).click()
    await expect(page.getByText('Zoom Phone — US & CA Unlimited')).toHaveCount(0)
  })
})
