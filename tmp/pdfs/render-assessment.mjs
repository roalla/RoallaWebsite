import { chromium } from '@playwright/test'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

await page.goto('http://localhost:3011/en/assessment', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'An AI agent that can act across approved systems and workflows' }).click()
await page.getByRole('button', { name: 'Clear strategy reviewed regularly' }).click()
await page.getByRole('button', { name: 'Efficient with clear owners' }).click()
await page.getByRole('button', { name: 'Strong leadership cadence' }).click()
await page.getByRole('button', { name: 'Reliable measures support regular decisions' }).click()
await page.getByRole('button', { name: 'Pilots and change are managed deliberately' }).click()
await page.getByText('Recommended action: Agentic', { exact: true }).waitFor({ state: 'visible' })

await page.emulateMedia({ media: 'print' })
await page.pdf({
  path: 'tmp/pdfs/assessment-branded.pdf',
  format: 'Letter',
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: false,
})

await browser.close()
