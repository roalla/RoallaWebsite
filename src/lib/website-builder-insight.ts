import 'server-only'

import fs from 'node:fs'
import path from 'node:path'

export const WEBSITE_BUILDER_INSIGHT_SLUG = 'is-your-website-builder-limiting-growth' as const

export type LongFormBlock =
  | { type: 'paragraph' | 'blockquote'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'unordered-list' | 'ordered-list'; items: string[] }

function parseLongFormMarkdown(markdown: string): LongFormBlock[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks: LongFormBlock[] = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim()
    if (!line || line.startsWith('# ')) continue

    if (line.startsWith('## ')) {
      blocks.push({ type: 'heading', level: 2, text: line.slice(3) })
      continue
    }
    if (line.startsWith('### ')) {
      blocks.push({ type: 'heading', level: 3, text: line.slice(4) })
      continue
    }
    if (line.startsWith('> ')) {
      blocks.push({ type: 'blockquote', text: line.slice(2) })
      continue
    }
    if (line.startsWith('- ')) {
      const items = [line.slice(2)]
      while (index + 1 < lines.length && lines[index + 1].trim().startsWith('- ')) {
        index += 1
        items.push(lines[index].trim().slice(2))
      }
      blocks.push({ type: 'unordered-list', items })
      continue
    }
    if (/^\d+\.\s/.test(line)) {
      const items = [line.replace(/^\d+\.\s/, '')]
      while (index + 1 < lines.length && /^\d+\.\s/.test(lines[index + 1].trim())) {
        index += 1
        items.push(lines[index].trim().replace(/^\d+\.\s/, ''))
      }
      blocks.push({ type: 'ordered-list', items })
      continue
    }

    blocks.push({ type: 'paragraph', text: line })
  }

  return blocks
}

export function getWebsiteBuilderInsight(locale: string): LongFormBlock[] {
  const language = locale === 'fr' ? 'fr' : 'en'
  const filePath = path.join(
    process.cwd(),
    'content',
    'insights',
    `${WEBSITE_BUILDER_INSIGHT_SLUG}.${language}.md`,
  )
  return parseLongFormMarkdown(fs.readFileSync(filePath, 'utf8'))
}
