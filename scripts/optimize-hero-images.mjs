/**
 * Converts hero PNG/JPEG sources in public/images/Hero/ to WebP (max 1920px, q80)
 * and syncs src/lib/heroSlideshow.ts from all .webp files in that folder.
 * Run: npm run optimize:hero
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const heroDir = path.join(__dirname, '../public/images/Hero')
const manifestPath = path.join(__dirname, '../src/lib/heroSlideshow.ts')
const MAX_WIDTH = 1920
const QUALITY = 80

const SOURCE_EXT = new Set(['.png', '.jpg', '.jpeg'])

function syncManifest(webpFiles) {
  const paths = webpFiles.map((name) => `  '/images/Hero/${name}',`).join('\n')
  const content = `/** Optimized WebP slides in public/images/Hero/ — regenerate with npm run optimize:hero */
export const HERO_SLIDESHOW_IMAGES = [
${paths}
] as const

export const HERO_SLIDE_INTERVAL_MS = 6000
export const HERO_SLIDE_FADE_MS = 1200
`
  fs.writeFileSync(manifestPath, content, 'utf8')
  console.log(`\nUpdated ${path.relative(path.join(__dirname, '..'), manifestPath)} (${webpFiles.length} slides)`)
}

async function optimizeHeroImages() {
  if (!fs.existsSync(heroDir)) {
    fs.mkdirSync(heroDir, { recursive: true })
    console.error(`Created ${heroDir} — add PNG/JPEG sources and run again.`)
    process.exit(1)
  }

  const sources = fs
    .readdirSync(heroDir)
    .filter((name) => SOURCE_EXT.has(path.extname(name).toLowerCase()))
    .sort()

  if (sources.length > 0) {
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
      `\nConverted: ${(totalBefore / 1024 / 1024).toFixed(2)} MB → ${(totalAfter / 1024 / 1024).toFixed(2)} MB (${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller)`
    )
  } else {
    console.log('No PNG/JPEG sources found — syncing manifest from existing .webp files.')
  }

  const webpFiles = fs
    .readdirSync(heroDir)
    .filter((name) => name.toLowerCase().endsWith('.webp'))
    .sort()

  if (webpFiles.length === 0) {
    console.error('No .webp files in public/images/Hero/. Add sources and run again.')
    process.exit(1)
  }

  syncManifest(webpFiles)
}

optimizeHeroImages().catch((err) => {
  console.error(err)
  process.exit(1)
})
