/** Trim quotes Railway sometimes adds around env values. */
function cleanEnv(value: string | undefined): string {
  return (value || '').trim().replace(/^["']|["']$/g, '')
}

function formatNotionUuid(hex32: string): string {
  const h = hex32.replace(/-/g, '').toLowerCase()
  if (h.length !== 32) return hex32
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

/** Pull a 32-char page/database id from a Notion URL or id string. */
export function extractNotionPageId(raw: string): string | null {
  const trimmed = cleanEnv(raw)
  if (!trimmed) return null

  const bare = trimmed.match(/^([a-f0-9]{32})$/i)
  if (bare) return bare[1].toLowerCase()

  const dashed = trimmed.match(
    /^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i,
  )
  if (dashed) return dashed[1].toLowerCase()

  try {
    const url = new URL(trimmed)
    const p = url.searchParams.get('p')
    if (p) {
      const fromP = p.replace(/-/g, '').match(/([a-f0-9]{32})$/i)
      if (fromP) return fromP[1].toLowerCase()
    }

    const pathMatch = url.pathname.match(/([a-f0-9]{32})(?:\/)?$/i)
    if (pathMatch) return pathMatch[1].toLowerCase()

    const lastSegment = url.pathname.split('/').filter(Boolean).pop() || ''
    const segmentMatch = lastSegment.replace(/-/g, '').match(/([a-f0-9]{32})$/i)
    if (segmentMatch) return segmentMatch[1].toLowerCase()
  } catch {
    const fallback = trimmed.replace(/-/g, '').match(/([a-f0-9]{32})$/i)
    if (fallback) return fallback[1].toLowerCase()
  }

  return null
}

export function notionShareUrlToEmbedUrl(shareUrl: string): string | null {
  const pageId = extractNotionPageId(shareUrl)
  if (!pageId) return null
  return `https://v2.notion.so/v1/embed/${formatNotionUuid(pageId)}`
}

/** Extract src= from pasted iframe HTML, or return the URL as-is. */
export function normalizeNotionEmbedUrl(raw: string): string {
  const trimmed = cleanEnv(raw)
  if (!trimmed) return ''

  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i)
  const url = (iframeMatch?.[1] || trimmed).trim()

  if (/v2\.notion\.(so|site)/i.test(url)) return url

  const converted = notionShareUrlToEmbedUrl(url)
  if (converted) return converted

  return url
}

/** True when we could not convert a Notion link to an embed URL. */
export function isUnembeddableNotionUrl(url: string): boolean {
  if (!url) return false
  if (/v2\.notion\.(so|site)/i.test(url)) return false
  return /notion\.(so|site)/i.test(url) && !notionShareUrlToEmbedUrl(url)
}

/** Prefer server runtime vars; fall back to NEXT_PUBLIC for local dev. */
export function notionLessonsEmbedUrl(): string {
  const raw =
    cleanEnv(process.env.NOTION_LESSONS_URL) || cleanEnv(process.env.NEXT_PUBLIC_NOTION_LESSONS_URL)
  return normalizeNotionEmbedUrl(raw)
}

export function notionPartnersEmbedUrl(): string {
  const raw =
    cleanEnv(process.env.NOTION_PARTNERS_URL) || cleanEnv(process.env.NEXT_PUBLIC_NOTION_PARTNERS_URL)
  return normalizeNotionEmbedUrl(raw)
}
