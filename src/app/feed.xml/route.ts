import enMessages from '../../../messages/en.json'
import frMessages from '../../../messages/fr.json'
import { buildInsightsRssFeed } from '@/lib/insights-feed'

export const dynamic = 'force-static'
export const revalidate = 86400

export async function GET(request: Request) {
  const locale = new URL(request.url).searchParams.get('locale') === 'fr' ? 'fr' : 'en'
  const messages = locale === 'fr' ? frMessages : enMessages
  const body = buildInsightsRssFeed(locale, messages)

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
