/**
 * Converts hero PNG/JPEG sources in public/images/Hero/ to WebP (max 1920px, q80).
 * Run: npm run optimize:hero
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const heroDir = path.join(__dirname, '../public/images/Hero')
const MAX_WIDTH = 1920
const QUALITY = 80

const SOURCE_EXT = new Set(['.png', '.jpg', '.jpeg'])

async function optimizeHeroImages() {
  if (!fs.existsSync(heroDir)) {
    console.error(`Hero directory not found: ${heroDir}`)
    process.exit(1)
  }

  const sources = fs
    .readdirSync(heroDir)
    .filter((name) => SOURCE_EXT.has(path.extname(name).toLowerCase()))
    .sort()

  if (sources.length === 0) {
    console.log('No PNG/JPEG sources found in public/images/Hero/')
    return
  }

  let totalBefore = 0
  let totalAfter = 0

  for (const name of sources) {
    const inputPath = path.join(heroDir, name)
    const base = path.basename(name, path.extname(name))
    const outputPath = path.join(heroDir, `${base}.webp`)

    const before = fs.statSync(inputPath).size
    totalBefore += before

    await sharp(inputPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outputPath)

    const after = fs.statSync(outputPath).size
    totalAfter += after

    console.log(
      `${name} → ${base}.webp  ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB`
    )
  }

  console.log(
    `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)} MB → ${(totalAfter / 1024 / 1024).toFixed(2)} MB (${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller)`
  )
}

optimizeHeroImages().catch((err) => {
  console.error(err)
  process.exit(1)
})
