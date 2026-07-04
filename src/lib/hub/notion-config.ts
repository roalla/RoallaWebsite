/** Trim quotes Railway sometimes adds around env values. */
function cleanEnv(value: string | undefined): string {
  return (value || '').trim().replace(/^["']|["']$/g, '')
}

/** Prefer server runtime vars; fall back to NEXT_PUBLIC for local dev. */
export function notionLessonsEmbedUrl(): string {
  return cleanEnv(process.env.NOTION_LESSONS_URL) || cleanEnv(process.env.NEXT_PUBLIC_NOTION_LESSONS_URL)
}

export function notionPartnersEmbedUrl(): string {
  return cleanEnv(process.env.NOTION_PARTNERS_URL) || cleanEnv(process.env.NEXT_PUBLIC_NOTION_PARTNERS_URL)
}
