import sanitizeHtml from 'sanitize-html'

const allowedTags = [
  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'a', 'ul', 'ol', 'li',
  'blockquote', 'h1', 'h2', 'h3', 'h4', 'span', 'div',
]
const allowedAttributes: Record<string, string[]> = {
  a: ['href', 'title', 'target', 'rel'],
  span: ['class'],
  div: ['class'],
}

export function sanitizeRichText(html: string): string {
  if (!html || typeof html !== 'string') return ''
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ['http', 'https', 'mailto'],
  })
}
