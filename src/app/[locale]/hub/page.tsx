import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getHubSession } from '@/lib/hub/auth-session'
import { dbQuery } from '@/lib/db'
import { getHubDatabaseState } from '@/lib/hub/database-state'
import { flattenLessonRecommendations } from '@/lib/hub/lesson-recommendations'
import type { HubRole } from '@/lib/hub/roles'
import HubDashboardExtras from '@/components/hub/HubDashboardExtras'
import HubDatabaseNotice from '@/components/hub/HubDatabaseNotice'

export const metadata: Metadata = {
  title: 'Dashboard | Roalla Internal Hub',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

export default async function HubDashboardPage({ params }: Props) {
  const { locale } = await params
  const session = await getHubSession()
  if (!session.signedIn) redirect(`/${locale}/hub/login`)

  const t = await getTranslations('hub')
  const role = (session.user?.role || 'contractor') as HubRole

  let stats = {
    activeCustomers: 0,
    openEngagements: 0,
    incompleteChecklistItems: 0,
    openRecommendations: 0,
  }
  let recentActivities: {
    summary: string
    customer_name?: string
    created_at: string
  }[] = []
  let databaseState = await getHubDatabaseState()

  if (databaseState.available) {
    try {
      const activeRes = await dbQuery(
        `SELECT COUNT(*)::int AS count FROM customers WHERE stage IN ('scoping', 'active')`,
      )
      const engRes = await dbQuery(
        `SELECT COUNT(*)::int AS count FROM engagements WHERE status = 'active'`,
      )
      const runs = await dbQuery(`SELECT checklist FROM playbook_runs`)
      let incomplete = 0
      for (const row of runs.rows as { checklist: { done: boolean }[] }[]) {
        incomplete += (row.checklist || []).filter((i) => !i.done).length
      }

      const lessonsRes = await dbQuery(
        `SELECT l.*, c.name AS customer_name FROM lessons_learned l
         LEFT JOIN customers c ON c.id = l.customer_id`,
      )
      const openRecs = flattenLessonRecommendations(
        lessonsRes.rows as Parameters<typeof flattenLessonRecommendations>[0],
        'open',
      )

      stats = {
        activeCustomers: activeRes.rows[0]?.count ?? 0,
        openEngagements: engRes.rows[0]?.count ?? 0,
        incompleteChecklistItems: incomplete,
        openRecommendations: openRecs.length,
      }
      const actRes = await dbQuery(
        `SELECT ca.summary, ca.created_at, c.name AS customer_name
         FROM customer_activities ca
         LEFT JOIN customers c ON c.id = ca.customer_id
         ORDER BY ca.created_at DESC LIMIT 8`,
      )
      recentActivities = actRes.rows as typeof recentActivities
    } catch (err) {
      console.error('Hub dashboard database query failed', err)
      databaseState = { ...databaseState, available: false, reason: 'unreachable' }
    }
  }

  const displayName = String(session.user?.name || session.auth?.email || 'there')
  const isEmpty =
    stats.activeCustomers === 0 &&
    stats.openEngagements === 0 &&
    recentActivities.length === 0 &&
    stats.openRecommendations === 0

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        {t('welcome', { name: displayName })}
      </h1>
      <p className="text-slate-600 text-sm mb-8">{t('dashboardSubtitle')}</p>

      {!databaseState.available && (
        <HubDatabaseNotice
          className="mb-6"
          reason={databaseState.reason}
          invalidSources={databaseState.invalidSources}
          env={databaseState.env}
        />
      )}

      <HubDashboardExtras role={role} stats={stats} isEmpty={isEmpty} />

      <section className="rounded-xl border bg-white p-6 mt-8">
        <h2 className="font-semibold mb-4">{t('recentActivity')}</h2>
        {recentActivities.length === 0 ? (
          <p className="text-sm text-slate-500">{t('noActivity')}</p>
        ) : (
          <ul className="space-y-3">
            {recentActivities.map((a, i) => (
              <li key={i} className="text-sm border-b pb-2 last:border-0">
                <p>{a.summary}</p>
                <p className="text-xs text-slate-500">
                  {a.customer_name ? `${a.customer_name} · ` : ''}
                  {new Date(a.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
