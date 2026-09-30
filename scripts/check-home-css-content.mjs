import { readFileSync, existsSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const fastGlob = require('fast-glob')
const { homeContent } = require('../tailwind.content.js')

const root = process.cwd()
const exts = ['.tsx', '.ts', '.jsx', '.js']
const entries = ['src/app/layout.tsx', 'src/app/[locale]/layout.tsx', 'src/app/[locale]/page.tsx']
const seen = new Set()

function resolveImport(fromFile, spec) {
  let base
  if (spec.startsWith('@/')) base = path.join(root, 'src', spec.slice(2))
  else if (spec.startsWith('.')) base = path.resolve(path.dirname(fromFile), spec)
  else return null
  const candidates = [...exts.map((ext) => base + ext), ...exts.map((ext) => path.join(base, 'index' + ext))]
  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile()) || null
}

function walk(file) {
  const rel = path.relative(root, file).replace(/\\/g, '/')
  if (seen.has(rel)) return
  seen.add(rel)
  const text = readFileSync(file, 'utf8')
  for (const match of text.matchAll(/from\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/g)) {
    const next = resolveImport(file, match[1] || match[2])
    if (next) walk(next)
  }
}

for (const entry of entries) walk(path.join(root, entry))

const scanned = new Set(
  (await fastGlob(homeContent, { cwd: root, onlyFiles: true })).map((file) =>
    file.replace(/\\/g, '/').replace(/^\.\//, ''),
  ),
)

const missing = []
for (const rel of seen) {
  if (!/\.(tsx|jsx)$/.test(rel)) continue
  const text = readFileSync(path.join(root, rel), 'utf8')
  if (!text.includes('className')) continue
  if (!scanned.has(rel)) missing.push(rel)
}

if (missing.length) {
  console.error('Homepage className files missing from tailwind.content.js homeContent:')
  for (const file of missing) console.error('  ' + file)
  process.exit(1)
}

console.log(`Homepage CSS content covers ${scanned.size} files`)
