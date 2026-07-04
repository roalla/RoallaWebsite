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

  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i)
  const urlLike = iframeMatch?.[1] || trimmed

  const bare = urlLike.match(/^([a-f0-9]{32})$/i)
  if (bare) return bare[1].toLowerCase()

  const dashed = urlLike.match(
    /^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i,
  )
  if (dashed) return dashed[1].toLowerCase()

  try {
    const url = new URL(urlLike)

    const p = url.searchParams.get('p')
    if (p) {
      const fromP = p.replace(/-/g, '').match(/([a-f0-9]{32})$/i)
      if (fromP) return fromP[1].toLowerCase()
    }

    const pageId = url.searchParams.get('pageId') || url.searchParams.get('page_id')
    if (pageId) {
      const fromParam = pageId.replace(/-/g, '').match(/([a-f0-9]{32})/i)
      if (fromParam) return fromParam[1].toLowerCase()
    }

    const pathMatch = url.pathname.match(/([a-f0-9]{32})(?:\/)?$/i)
    if (pathMatch) return pathMatch[1].toLowerCase()

    const segments = url.pathname.split('/').filter(Boolean)
    for (let i = segments.length - 1; i >= 0; i--) {
      const segmentMatch = segments[i].replace(/-/g, '').match(/([a-f0-9]{32})$/i)
      if (segmentMatch) return segmentMatch[1].toLowerCase()
    }
  } catch {
    const fallback = urlLike.replace(/-/g, '').match(/([a-f0-9]{32})/i)
    if (fallback) return fallback[1].toLowerCase()
  }

  return null
}

/** Strip iframe HTML and v2 embed wrappers; return the human-facing Notion URL. */
export function notionViewUrl(raw: string): string {
  const trimmed = cleanEnv(raw)
  if (!trimmed) return ''

  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i)
  let url = (iframeMatch?.[1] || trimmed).trim()

  if (/v2\.notion\.(so|site)/i.test(url)) {
    const pageId = extractNotionPageId(url)
    if (pageId) {
      // Best-effort view link when only embed code was pasted.
      return `https://www.notion.so/${formatNotionUuid(pageId).replace(/-/g, '')}`
    }
  }

  try {
    const parsed = new URL(url)
    parsed.searchParams.delete('embed')
    url = parsed.toString()
  } catch {
    /* keep as-is */
  }

  return url
}

export type NotionPageUrls = {
  viewUrl: string
  embedUrl: string
}

/** Build view + iframe URLs from env (share link, publish link, or embed code). */
export function resolveNotionPageUrls(raw: string): NotionPageUrls {
  const trimmed = cleanEnv(raw)
  if (!trimmed) return { viewUrl: '', embedUrl: '' }

  const viewUrl = notionViewUrl(trimmed)
  const pageId = extractNotionPageId(trimmed)

  if (/v2\.notion\.(so|site)/i.test(trimmed)) {
    const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i)
    const embedUrl = iframeMatch?.[1]?.trim() || trimmed
    return { viewUrl: viewUrl || embedUrl, embedUrl }
  }

  if (pageId) {
    const uuid = formatNotionUuid(pageId)
    return {
      viewUrl: viewUrl || `https://www.notion.so/${pageId}`,
      embedUrl: `https://v2.notion.site/v1/embed/${uuid}`,
    }
  }

  return { viewUrl, embedUrl: viewUrl }
}

export function notionLessonsUrls(): NotionPageUrls {
  const raw =
    cleanEnv(process.env.NOTION_LESSONS_URL) || cleanEnv(process.env.NEXT_PUBLIC_NOTION_LESSONS_URL)
  return resolveNotionPageUrls(raw)
}

export function notionPartnersUrls(): NotionPageUrls {
  const raw =
    cleanEnv(process.env.NOTION_PARTNERS_URL) || cleanEnv(process.env.NEXT_PUBLIC_NOTION_PARTNERS_URL)
  return resolveNotionPageUrls(raw)
}
