import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getHubSession } from '@/lib/hub/auth-session'
import { dbConfigured, dbQuery } from '@/lib/db'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = {
  title: 'Dashboard | Roalla Internal Hub',
  robots: { index: false, follow: false },
}

type Props = { params: Promise<{ locale: string }> }

export default async function HubDashboardPage({ params }: Props) {
  const { locale } = await params
  const session = await getHubSession()
  if (!session.signedIn) redirect(`/${locale}/hub/login`)

  const t = await getTranslations('hub')

  let stats = { activeCustomers: 0, openEngagements: 0, incompleteChecklistItems: 0 }
  let recentActivities: {
    summary: string
    customer_name?: string
    created_at: string
  }[] = []

  if (dbConfigured()) {
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
    stats = {
      activeCustomers: activeRes.rows[0]?.count ?? 0,
      openEngagements: engRes.rows[0]?.count ?? 0,
      incompleteChecklistItems: incomplete,
    }
    const actRes = await dbQuery(
      `SELECT ca.summary, ca.created_at, c.name AS customer_name
       FROM customer_activities ca
       LEFT JOIN customers c ON c.id = ca.customer_id
       ORDER BY ca.created_at DESC LIMIT 8`,
    )
    recentActivities = actRes.rows as typeof recentActivities
  }

  const displayName = String(session.user?.name || session.auth?.email || 'there')

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        {t('welcome', { name: displayName })}
      </h1>
      <p className="text-slate-600 text-sm mb-8">{t('dashboardSubtitle')}</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: t('statActiveCustomers'), value: stats.activeCustomers },
          { label: t('statOpenEngagements'), value: stats.openEngagements },
          { label: t('statChecklistItems'), value: stats.incompleteChecklistItems },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border bg-white p-5">
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-600">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="rounded-xl border bg-white p-6">
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

        <section className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold mb-4">{t('quickLinks')}</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/hub/customers" className="text-amber-800 hover:underline">
                {t('navCustomers')}
              </Link>
            </li>
            <li>
              <Link href="/hub/playbooks" className="text-amber-800 hover:underline">
                {t('navPlaybooks')}
              </Link>
            </li>
            <li>
              <Link href="/hub/tools" className="text-amber-800 hover:underline">
                {t('navTools')}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
