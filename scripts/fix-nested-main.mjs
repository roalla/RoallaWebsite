import fs from 'fs'
import path from 'path'

const roots = [
  'src/app/[locale]/(site)/tools',
  'src/app/[locale]/(site)/partners',
  'src/app/[locale]/(site)/website-estimate',
  'src/app/[locale]/(site)/email-reach-estimate',
  'src/app/[locale]/(site)/visibility-improvement-estimate',
  'src/app/[locale]/(site)/website-ai-visibility-review',
]

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.name.endsWith('.tsx')) out.push(full)
  }
  return out
}

let changed = 0
for (const root of roots) {
  for (const file of walk(root)) {
    let source = fs.readFileSync(file, 'utf8')
    if (!source.includes('<main')) continue
    const next = source
      .replace(/<main(\s|>)/g, '<div$1')
      .replace(/<\/main>/g, '</div>')
    if (next !== source) {
      fs.writeFileSync(file, next)
      changed += 1
      console.log('fixed', file)
    }
  }
}
console.log('files', changed)
