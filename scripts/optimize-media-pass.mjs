import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const root = process.cwd()

function replaceExecutiveGuides() {
  const file = path.join(root, 'src/lib/executive-guides.ts')
  let source = fs.readFileSync(file, 'utf8')
  const before = (source.match(/executive-insights\/[^"]+\.png/g) || []).length
  source = source.replace(/(\/images\/executive-insights\/[^"]+)\.png/g, '$1.webp')
  fs.writeFileSync(file, source)
  const after = (source.match(/executive-insights\/[^"]+\.png/g) || []).length
  console.log('executive-guides png refs', before, '->', after)
}

async function optimizeInsightHeroes() {
  const targets = [
    'public/images/insights/library/networking-roi-solopreneurs-small-business.webp',
    'public/images/insights/web-development-outlook-2027/hero.webp',
  ]
  for (const rel of targets) {
    const input = path.join(root, rel)
    if (!fs.existsSync(input)) {
      console.log('missing', rel)
      continue
    }
    const out = input.replace(/\.webp$/i, '.opt.webp')
    const before = fs.statSync(input).size
    await sharp(input)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 68 })
      .toFile(out)
    const after = fs.statSync(out).size
    console.log(rel, Math.round(before / 1024) + 'KB ->', Math.round(after / 1024) + 'KB', '(wrote .opt.webp)')
  }
}

replaceExecutiveGuides()
await optimizeInsightHeroes()
