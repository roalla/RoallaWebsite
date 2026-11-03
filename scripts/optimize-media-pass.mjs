/**
 * Generate responsive, compressed .opt.webp siblings for heavy public images
 * and rewrite known content refs to prefer them.
 *
 * Usage: node scripts/optimize-media-pass.mjs
 */
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const root = process.cwd()

function replaceExecutiveGuides() {
  const file = path.join(root, 'src/lib/executive-guides.ts')
  if (!fs.existsSync(file)) return
  let source = fs.readFileSync(file, 'utf8')
  const before = (source.match(/executive-insights\/[^"]+\.png/g) || []).length
  source = source.replace(/(\/images\/executive-insights\/[^"]+)\.png/g, '$1.webp')
  fs.writeFileSync(file, source)
  const after = (source.match(/executive-insights\/[^"]+\.png/g) || []).length
  console.log('executive-guides png refs', before, '->', after)
}

async function writeOptWebp(inputRel, { width = 1200, quality = 68 } = {}) {
  const input = path.join(root, inputRel)
  if (!fs.existsSync(input)) {
    console.log('missing', inputRel)
    return null
  }
  const ext = path.extname(input)
  const out =
    ext.toLowerCase() === '.webp'
      ? input.replace(/\.webp$/i, '.opt.webp')
      : input.replace(/\.(jpe?g|png)$/i, '.opt.webp')
  const before = fs.statSync(input).size
  if (fs.existsSync(out) && fs.statSync(out).size < before * 0.95 && fs.statSync(out).mtimeMs >= fs.statSync(input).mtimeMs) {
    console.log('skip', inputRel, '(opt fresher/smaller)')
    return '/' + path.relative(root, out).replace(/\\/g, '/').replace(/^public\//, '')
  }
  await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toFile(out)
  const after = fs.statSync(out).size
  console.log(
    inputRel,
    Math.round(before / 1024) + 'KB ->',
    Math.round(after / 1024) + 'KB',
    path.relative(root, out),
  )
  return '/' + path.relative(root, out).replace(/\\/g, '/').replace(/^public\//, '')
}

async function optimizeInsightLibrary() {
  const dir = path.join(root, 'public/images/insights/library')
  const files = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.webp') && !name.endsWith('.opt.webp'))
  for (const name of files) {
    const out = path.join(dir, name.replace(/\.webp$/i, '.opt.webp'))
    if (fs.existsSync(out) && fs.statSync(out).size < fs.statSync(path.join(dir, name)).size * 0.95) {
      continue
    }
    await writeOptWebp(`public/images/insights/library/${name}`, { width: 960, quality: 66 })
  }
}

async function optimizeHeavyAssets() {
  const targets = [
    { rel: 'public/ColdBru-Event.jpg', width: 960, quality: 66 },
    { rel: 'public/images/services/digital-outcome-launch.webp', width: 960, quality: 66 },
    { rel: 'public/images/services/digital-outcome-growth.webp', width: 960, quality: 66 },
    { rel: 'public/images/services/digital-outcome-operations.webp', width: 960, quality: 66 },
    { rel: 'public/images/services/search-ai-visibility-hero.webp', width: 1400, quality: 68 },
    { rel: 'public/images/insights/web-development-outlook-2027/hero.webp', width: 1400, quality: 68 },
    { rel: 'public/boothlio-pic.webp', width: 960, quality: 66 },
    // Portfolio / product snapshots (shown in BrowserFrame + tiles)
    { rel: 'public/360visionsnapshot.jpg', width: 960, quality: 66 },
    { rel: 'public/roalla-snapshot.jpg', width: 960, quality: 66 },
    { rel: 'public/careqlo_snapshot.jpg', width: 960, quality: 66 },
    { rel: 'public/pulsavantsolution.jpg', width: 960, quality: 66 },
    { rel: 'public/unjargonitsnapshot.jpg', width: 960, quality: 66 },
    { rel: 'public/businesscocoon_image.jpg', width: 960, quality: 66 },
    { rel: 'public/preflight.jpg', width: 960, quality: 66 },
    { rel: 'public/advisory-board-match.jpg', width: 960, quality: 66 },
    { rel: 'public/Hockeygaze_snapshot.jpg', width: 960, quality: 66 },
    { rel: 'public/outset_snapshot.jpg', width: 960, quality: 66 },
    { rel: 'public/blueprintsnapshot.jpg', width: 960, quality: 66 },
    { rel: 'public/grcstatussnapshot.jpg', width: 960, quality: 66 },
    { rel: 'public/soaring-puck.jpg', width: 960, quality: 66 },
    { rel: 'public/goaliestop_sample.jpg', width: 960, quality: 66 },
    { rel: 'public/wjwellness_snapshot.jpg', width: 960, quality: 66 },
    { rel: 'public/pitchhotshotsnapshot.webp', width: 960, quality: 66 },
    { rel: 'public/kaylankaptures_snapshot.webp', width: 960, quality: 66 },
    { rel: 'public/images/PortfolioPics/Roalla_Hero.webp', width: 1400, quality: 68 },
    { rel: 'public/images/PortfolioPics/Roalla_Hero2.webp', width: 1400, quality: 68 },
    { rel: 'public/images/PortfolioPics/Roalla_hero4.webp', width: 1400, quality: 68 },
    { rel: 'public/images/PortfolioPics/portfolio-hero.jpg', width: 1400, quality: 68 },
    { rel: 'public/images/services/business-advisory-hero.webp', width: 1400, quality: 68 },
    { rel: 'public/images/services/technology-advisory-hero.webp', width: 1400, quality: 68 },
    { rel: 'public/images/services/workshops-hero.webp', width: 1400, quality: 68 },
    { rel: 'public/images/services/website-design-hero.webp', width: 1400, quality: 68 },
    { rel: 'public/images/services/automation-hero.webp', width: 1400, quality: 68 },
    { rel: 'public/images/services/ai-agents-hero.webp', width: 1400, quality: 68 },
    { rel: 'public/images/services/use-cases-hero.webp', width: 1400, quality: 68 },
    { rel: 'public/images/programs/business-outcome-focus.webp', width: 960, quality: 66 },
    { rel: 'public/images/programs/business-outcome-improve.webp', width: 960, quality: 66 },
    { rel: 'public/images/programs/business-outcome-lead.webp', width: 960, quality: 66 },
  ]
  for (const target of targets) {
    await writeOptWebp(target.rel, target)
  }
}

function preferOptInFile(relPath) {
  const file = path.join(root, relPath)
  if (!fs.existsSync(file)) return
  let source = fs.readFileSync(file, 'utf8')
  const before = source

  // Prefer library .opt.webp when the sibling exists on disk
  source = source.replace(
    /(\/images\/insights\/library\/)([A-Za-z0-9._-]+)\.webp/g,
    (match, prefix, slug) => {
      if (slug.endsWith('.opt')) return match
      const optDisk = path.join(root, 'public', 'images', 'insights', 'library', `${slug}.opt.webp`)
      return fs.existsSync(optDisk) ? `${prefix}${slug}.opt.webp` : match
    },
  )

  // Prefer any /path/foo.(jpg|jpeg|png|webp) -> /path/foo.opt.webp when sibling exists
  source = source.replace(
    /(\/[A-Za-z0-9._/-]+)\.(jpe?g|png|webp)/gi,
    (match, base, ext) => {
      if (base.endsWith('.opt') || match.includes('.opt.webp')) return match
      const publicRel = `${base.slice(1)}.opt.webp`
      const optDisk = path.join(root, 'public', publicRel)
      return fs.existsSync(optDisk) ? `${base}.opt.webp` : match
    },
  )

  if (source !== before) {
    fs.writeFileSync(file, source)
    console.log('rewrote refs in', relPath)
  }
}

replaceExecutiveGuides()
await optimizeInsightLibrary()
await optimizeHeavyAssets()

for (const file of [
  'src/lib/outcome-group-panels.ts',
  'src/lib/digitalPortfolio.ts',
  'src/lib/solution-outcome-pages.ts',
  'src/lib/additional-insights.ts',
  'src/lib/insights.ts',
  'src/lib/ai-employee-content.ts',
  'src/components/DigitalEvents.tsx',
  'src/components/solutions/SolutionsByNeedPage.tsx',
  'src/components/services/OutcomeServiceLanding.tsx',
  'src/components/Services.tsx',
  'src/components/DigitalBuilds.tsx',
  'src/components/DigitalCreations.tsx',
  'src/components/Services.tsx',
  'src/components/Workshops.tsx',
  'src/components/WebsiteDesignLanding.tsx',
  'src/components/TechnologyAdvisory.tsx',
]) {
  preferOptInFile(file)
}

console.log('optimize-media-pass complete')
