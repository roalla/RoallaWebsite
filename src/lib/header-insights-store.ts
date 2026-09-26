import { unstable_cache, revalidateTag } from 'next/cache'
import { dbConfigured, dbQuery } from '@/lib/db'
import {
  defaultHeaderInsightSlugs,
  normalizeHeaderInsightSlugs,
} from '@/lib/header-insights'
import type { InsightSlug } from '@/lib/insights'

export async function loadHeaderInsightSlugs(): Promise<InsightSlug[]> {
  try {
    if (!dbConfigured()) return defaultHeaderInsightSlugs()
    const res = await dbQuery(
      `SELECT slug FROM header_insight_selection ORDER BY position ASC`,
    )
    return normalizeHeaderInsightSlugs(res.rows.map((row) => String(row.slug))) ?? defaultHeaderInsightSlugs()
  } catch {
    return defaultHeaderInsightSlugs()
  }
}

export const getHeaderInsightSlugs = unstable_cache(
  async () => loadHeaderInsightSlugs(),
  ['header-insight-slugs'],
  { revalidate: 300, tags: ['header-insights'] },
)

export async function saveHeaderInsightSlugs(slugs: InsightSlug[]): Promise<void> {
  const positions = slugs.map((_, index) => index + 1)
  await dbQuery(
    `WITH cleared AS (DELETE FROM header_insight_selection)
     INSERT INTO header_insight_selection (position, slug)
     SELECT pos, slug FROM UNNEST($1::int[], $2::text[]) AS selection(pos, slug)`,
    [positions, slugs],
  )
  revalidateTag('header-insights')
}
