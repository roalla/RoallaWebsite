import sanitizeHtml from 'sanitize-html'

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a'],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
  },
  transformTags: {
    a: (_tagName, attribs) => ({
      tagName: 'a',
      attribs: {
        ...attribs,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    }),
  },
}

export function sanitizeRichText(html: string): string {
  if (!html?.trim()) return ''
  return sanitizeHtml(html, SANITIZE_OPTIONS).trim()
}

export function stripRichText(html: string): string {
  if (!html?.trim()) return ''
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, ' ')
    .trim()
}

export function richTextIsEmpty(html: string): boolean {
  return !stripRichText(html)
}

export function normalizeRichTextFields(values: Record<string, unknown>, keys: string[]) {
  const out = { ...values }
  for (const key of keys) {
    if (typeof out[key] === 'string') {
      out[key] = sanitizeRichText(out[key] as string)
    }
  }
  return out
}

export function normalizeAdditionalRecommendations(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => sanitizeRichText(item))
    .filter((item) => !richTextIsEmpty(item))
}
