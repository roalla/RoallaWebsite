/**
 * Converts hero Desktop/Mobile PNG/JPEG sources in public/images/Hero/ to WebP
 * and syncs src/lib/heroSlideshow.ts as paired slides.
 *
 * Naming: files containing "Desktop" / "Mobile" + a number (e.g. "... Desktop 1.png")
 * are paired by that number. Desktop → tablets & up; Mobile → phones.
 *
 * Run: npm run optimize:hero
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const heroDir = path.join(__dirname, '../public/images/Hero')
const manifestPath = path.join(__dirname, '../src/lib/heroSlideshow.ts')

const DESKTOP_MAX_WIDTH = 1920
/** 480 covers ~1x phones; 736 covers PageSpeed's 412px viewport at 1.75 dpr. */
const MOBILE_VARIANTS = [
  { width: 480, quality: 52, avifQuality: 45 },
  { width: 736, quality: 58, avifQuality: 45 },
]
const DESKTOP_QUALITY = 72
const DESKTOP_AVIF_QUALITY = 50
const SOURCE_EXT = new Set(['.png', '.jpg', '.jpeg'])

function slugifyBase(name) {
  return path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseHeroSource(name) {
  const match = name.match(/\b(desktop|mobile)\b(?:\s*|[_-])*(\d+)/i)
  if (!match) return null
  return {
    variant: match[1].toLowerCase(),
    index: Number(match[2]),
    name,
  }
}

function syncManifest(slides) {
  const entries = slides
    .map((slide) => {
      const largest = slide.mobileSources[slide.mobileSources.length - 1]
      const mobileSrcSet = slide.mobileSources
        .map((item) => `/images/Hero/${item.file} ${item.width}w`)
        .join(', ')
      const mobileAvifSrcSet = slide.mobileAvifSources
        .map((item) => `/images/Hero/${item.file} ${item.width}w`)
        .join(', ')
      return `  {
    desktop: '/images/Hero/${slide.desktop}',
    desktopAvif: '/images/Hero/${slide.desktopAvif}',
    mobile: '/images/Hero/${largest.file}',
    mobileSrcSet:
      '${mobileSrcSet}',
    mobileAvifSrcSet:
      '${mobileAvifSrcSet}',
  },`
    })
    .join('\n')

  const content = `/** Optimized WebP hero slides — regenerate with npm run optimize:hero */
export const HERO_SLIDES = [
${entries}
] as const

/** @deprecated Prefer HERO_SLIDES; desktop URLs for preload/fallback */
export const HERO_SLIDESHOW_IMAGES = HERO_SLIDES.map((s) => s.desktop)

export const HERO_SLIDE_INTERVAL_MS = 6000
export const HERO_SLIDE_FADE_MS = 1200

/** Second slide starts fading in just before 5s; fetch it early enough to arrive. */
export const HERO_NEXT_SLIDE_AT_MS = 3500
/** Third slide is not visible until about 11s. */
export const HERO_LAST_SLIDE_AT_MS = 8000

/** Tailwind md — phones use mobile art; tablets & up use desktop */
export const HERO_MOBILE_MAX_WIDTH_PX = 767
`

  fs.writeFileSync(manifestPath, content, 'utf8')
  console.log(
    `\nUpdated ${path.relative(path.join(__dirname, '..'), manifestPath)} (${slides.length} paired slides)`
  )
}

async function convertSource(inputPath, outputPath, maxWidth, quality, format) {
  const before = fs.statSync(inputPath).size
  let pipeline = sharp(inputPath).resize({ width: maxWidth, withoutEnlargement: true })
  pipeline =
    format === 'avif'
      ? pipeline.avif({ quality, effort: 6 })
      : pipeline.webp({ quality, effort: 6 })
  await pipeline.toFile(outputPath)
  const after = fs.statSync(outputPath).size
  return { before, after }
}

async function optimizeHeroImages() {
  if (!fs.existsSync(heroDir)) {
    fs.mkdirSync(heroDir, { recursive: true })
    console.error(`Created ${heroDir} — add Desktop/Mobile PNG/JPEG sources and run again.`)
    process.exit(1)
  }

  const sources = fs
    .readdirSync(heroDir)
    .filter((name) => SOURCE_EXT.has(path.extname(name).toLowerCase()))
    .sort()

  const parsed = sources.map(parseHeroSource).filter(Boolean)

  if (parsed.length === 0) {
    console.error(
      'No Desktop/Mobile hero sources found. Name files like "Roalla Hero Homepage Desktop 1.png".'
    )
    process.exit(1)
  }

  /** @type {Map<number, { desktop?: string, mobile?: string }>} */
  const byIndex = new Map()
  for (const item of parsed) {
    const slot = byIndex.get(item.index) ?? {}
    slot[item.variant] = item.name
    byIndex.set(item.index, slot)
  }

  const indices = [...byIndex.keys()].sort((a, b) => a - b)
  const slides = []
  let totalBefore = 0
  let totalAfter = 0
  const producedWebp = new Set()

  for (const index of indices) {
    const slot = byIndex.get(index)
    if (!slot?.desktop || !slot?.mobile) {
      console.warn(
        `Skipping pair ${index}: missing ${!slot?.desktop ? 'Desktop' : 'Mobile'} source`
      )
      continue
    }

    const desktopSlug = `${slugifyBase(slot.desktop)}.webp`
    const desktopAvifSlug = `${slugifyBase(slot.desktop)}.avif`
    const mobileBase = slugifyBase(slot.mobile)
    const desktopOut = path.join(heroDir, desktopSlug)
    const desktopAvifOut = path.join(heroDir, desktopAvifSlug)

    const desk = await convertSource(path.join(heroDir, slot.desktop), desktopOut, DESKTOP_MAX_WIDTH, DESKTOP_QUALITY, 'webp')
    const deskAvif = await convertSource(
      path.join(heroDir, slot.desktop),
      desktopAvifOut,
      DESKTOP_MAX_WIDTH,
      DESKTOP_AVIF_QUALITY,
      'avif'
    )
    totalBefore += desk.before
    totalAfter += desk.after + deskAvif.after
    producedWebp.add(desktopSlug)
    producedWebp.add(desktopAvifSlug)
    console.log(
      `Pair ${index}: ${slot.desktop} → ${desktopSlug}  ${(desk.before / 1024).toFixed(0)} KB → ${(desk.after / 1024).toFixed(0)} KB`
    )
    console.log(
      `Pair ${index}: ${slot.desktop} → ${desktopAvifSlug}  ${(deskAvif.before / 1024).toFixed(0)} KB → ${(deskAvif.after / 1024).toFixed(0)} KB`
    )

    const mobileSources = []
    const mobileAvifSources = []
    totalBefore += fs.statSync(path.join(heroDir, slot.mobile)).size
    for (const variant of MOBILE_VARIANTS) {
      const file = `${mobileBase}-${variant.width}.webp`
      const avifFile = `${mobileBase}-${variant.width}.avif`
      const mobileOut = path.join(heroDir, file)
      const avifOut = path.join(heroDir, avifFile)
      const mob = await convertSource(
        path.join(heroDir, slot.mobile),
        mobileOut,
        variant.width,
        variant.quality,
        'webp'
      )
      const avif = await convertSource(
        path.join(heroDir, slot.mobile),
        avifOut,
        variant.width,
        variant.avifQuality,
        'avif'
      )
      totalAfter += mob.after + avif.after
      producedWebp.add(file)
      producedWebp.add(avifFile)
      mobileSources.push({ file, width: variant.width })
      mobileAvifSources.push({ file: avifFile, width: variant.width })
      console.log(
        `Pair ${index}: ${slot.mobile} → ${file}  ${(mob.before / 1024).toFixed(0)} KB → ${(mob.after / 1024).toFixed(0)} KB`
      )
      console.log(
        `Pair ${index}: ${slot.mobile} → ${avifFile}  ${(avif.before / 1024).toFixed(0)} KB → ${(avif.after / 1024).toFixed(0)} KB`
      )
    }

    slides.push({
      desktop: desktopSlug,
      desktopAvif: desktopAvifSlug,
      mobileSources,
      mobileAvifSources,
    })
  }

  if (slides.length === 0) {
    console.error('No complete Desktop+Mobile pairs to optimize.')
    process.exit(1)
  }

  // Remove stale WebPs that are not part of the current paired set
  for (const name of fs.readdirSync(heroDir)) {
    const lower = name.toLowerCase()
    if (!lower.endsWith('.webp') && !lower.endsWith('.avif')) continue
    if (producedWebp.has(name)) continue
    fs.unlinkSync(path.join(heroDir, name))
    console.log(`Removed stale ${name}`)
  }

  console.log(
    `\nConverted: ${(totalBefore / 1024 / 1024).toFixed(2)} MB → ${(totalAfter / 1024 / 1024).toFixed(2)} MB (${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller)`
  )

  syncManifest(slides)
}

optimizeHeroImages().catch((err) => {
  console.error(err)
  process.exit(1)
})
