import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import HeaderInsightsEditor, { type HeaderInsightChoice } from '@/components/hub/HeaderInsightsEditor'
import { dbConfigured } from '@/lib/db'
import { loadHeaderInsightSlugs } from '@/lib/header-insights-store'
import { getHubSession } from '@/lib/hub/auth-session'
import { canManageHeaderInsights } from '@/lib/hub/permissions'
import { INSIGHT_GROUPS, type InsightGroup, type InsightSlug } from '@/lib/insights'

export const metadata: Metadata = {
  title: 'Insights menu | Roalla Internal Hub',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

export default async function HubHeaderInsightsPage({ params }: Props) {
  const { locale } = await params
  const session = await getHubSession()
  if (!session.signedIn || !session.user) redirect(`/${locale}/hub/login`)
  if (!canManageHeaderInsights(session.user.role)) redirect(`/${locale}/hub`)

  const t = await getTranslations({ locale, namespace: 'insights' })
  const catalog: HeaderInsightChoice[] = (['digital', 'advisory'] as const).flatMap((group: InsightGroup) =>
    INSIGHT_GROUPS[group].map((slug) => ({
      slug,
      group,
      title: t(`${slug}.title`),
      summary: t(`${slug}.summary`),
    })),
  )
  const initialSlugs: InsightSlug[] = await loadHeaderInsightSlugs()

  return (
    <HeaderInsightsEditor
      catalog={catalog}
      initialSlugs={initialSlugs}
      groupLabels={{ digital: t('groupDigital'), advisory: t('groupAdvisory') }}
      otherLabel={t('groupOther')}
      databaseReady={dbConfigured()}
    />
  )
}
