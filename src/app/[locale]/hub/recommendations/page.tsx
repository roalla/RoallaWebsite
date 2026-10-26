import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getHubSession } from '@/lib/hub/auth-session'
import { dbConfigured, dbQuery } from '@/lib/db'
import { canAccessModule, canManageLessons } from '@/lib/hub/permissions'
import { flattenLessonRecommendations } from '@/lib/hub/lesson-recommendations'
import RecommendationsList from '@/components/hub/RecommendationsList'
import { SSO_HOME_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Recommendations | Website CMS (legacy)',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

export default async function HubRecommendationsPage({ params }: Props) {
  const { locale } = await params
  const session = await getHubSession()
  if (!session.signedIn || !session.user) redirect(SSO_HOME_URL)
  if (!canAccessModule(session.user.role, 'lessons')) redirect(`/${locale}/hub`)

  let items: Parameters<typeof RecommendationsList>[0]['initialItems'] = []
  if (dbConfigured()) {
    const res = await dbQuery(
      `SELECT l.*, c.name AS customer_name
       FROM lessons_learned l
       LEFT JOIN customers c ON c.id = l.customer_id
       ORDER BY l.updated_at DESC`,
    )
    items = flattenLessonRecommendations(res.rows as Parameters<typeof flattenLessonRecommendations>[0])
  }

  return (
    <RecommendationsList
      initialItems={items}
      canManage={canManageLessons(session.user.role)}
    />
  )
}
