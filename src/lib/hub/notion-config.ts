/** Trim quotes Railway sometimes adds around env values. */
function cleanEnv(value: string | undefined): string {
  return (value || '').trim().replace(/^["']|["']$/g, '')
}

/** Extract src= from pasted iframe HTML, or return the URL as-is. */
export function normalizeNotionEmbedUrl(raw: string): string {
  const trimmed = cleanEnv(raw)
  if (!trimmed) return ''

  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i)
  if (iframeMatch?.[1]) return iframeMatch[1].trim()

  return trimmed
}

/** Share/publish links block iframes — embed URL from Notion starts with v2.notion.* */
export function isLikelyNotionShareUrl(url: string): boolean {
  if (!url) return false
  if (/v2\.notion\.(so|site)/i.test(url)) return false
  return /notion\.(so|site)/i.test(url)
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
