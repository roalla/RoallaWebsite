import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const logoBuffer = readFileSync(join(root, 'public', 'favicon.png'))

const overlay = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0f172a"/>
  <rect x="0" y="560" width="1200" height="70" fill="#00b4c5" opacity="0.15"/>
  <text x="340" y="280" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700">Roalla</text>
  <text x="340" y="340" fill="#94a3b8" font-family="Arial, Helvetica, sans-serif" font-size="28">Digital Enablement</text>
  <text x="340" y="400" fill="#cbd5e1" font-family="Arial, Helvetica, sans-serif" font-size="22">Websites · Custom Apps · Automation · AI</text>
  <text x="340" y="480" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="18">www.roalla.com · Burlington, ON · Global clients</text>
</svg>`

const base = await sharp(Buffer.from(overlay)).png().toBuffer()
const output = await sharp(base)
  .composite([{ input: logoBuffer, top: 190, left: 100 }])
  .jpeg({ quality: 90 })
  .toBuffer()

writeFileSync(join(root, 'public', 'og-image.jpg'), output)
console.log('Generated public/og-image.jpg')
