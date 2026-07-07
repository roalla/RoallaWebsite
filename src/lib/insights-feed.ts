import { INSIGHT_PUBLISHED_DATES, INSIGHT_SLUGS, type InsightSlug } from '@/lib/insights'
import { pageUrl } from '@/lib/page-metadata'
import { SITE_URL } from '@/lib/site'

type InsightMessages = {
  insights: {
    metadataDescription: string
    indexTitle: string
    [slug: string]:
      | {
          title: string
          summary: string
          metadataDescription: string
        }
      | string
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function insightCopy(messages: InsightMessages, slug: InsightSlug) {
  const entry = messages.insights[slug]
  if (!entry || typeof entry === 'string') {
    throw new Error(`Missing insight copy for slug: ${slug}`)
  }
  return entry
}

export function buildInsightsRssFeed(locale: 'en' | 'fr', messages: InsightMessages): string {
  const channelTitle =
    locale === 'fr' ? 'Perspectives Roalla' : 'Roalla Insights'
  const channelDescription = messages.insights.metadataDescription
  const channelLink = pageUrl(locale, '/insights')
  const feedSelfUrl = `${SITE_URL}/feed.xml${locale === 'fr' ? '?locale=fr' : ''}`
  const language = locale === 'fr' ? 'fr-ca' : 'en-ca'

  const items = [...INSIGHT_SLUGS]
    .sort(
      (a, b) =>
        new Date(INSIGHT_PUBLISHED_DATES[b]).getTime() -
        new Date(INSIGHT_PUBLISHED_DATES[a]).getTime(),
    )
    .map((slug) => {
      const copy = insightCopy(messages, slug)
      const link = pageUrl(locale, `/insights/${slug}`)
      const pubDate = new Date(INSIGHT_PUBLISHED_DATES[slug]).toUTCString()

      return `    <item>
      <title>${escapeXml(copy.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(copy.summary)}</description>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${channelLink}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>${language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedSelfUrl}" rel="self" type="application/rss+xml" />
    <atom:link href="${SITE_URL}/feed.xml" rel="alternate" type="application/rss+xml" hreflang="en" />
    <atom:link href="${SITE_URL}/feed.xml?locale=fr" rel="alternate" type="application/rss+xml" hreflang="fr" />
${items}
  </channel>
</rss>`
}
