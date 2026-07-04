import { NextResponse } from 'next/server'
import { dbConfigured, dbQuery } from '@/lib/db'
import { requireHubSession } from '@/lib/hub/auth-session'

export async function GET() {
  try {
    const { user } = await requireHubSession()
    if (!dbConfigured()) {
      return NextResponse.json({
        stats: { activeCustomers: 0, openEngagements: 0, incompleteChecklistItems: 0 },
        recentActivities: [],
      })
    }

    const activeCustomers = await dbQuery(
      `SELECT COUNT(*)::int AS count FROM customers WHERE stage IN ('scoping', 'active')`,
    )
    const openEngagements = await dbQuery(
      `SELECT COUNT(*)::int AS count FROM engagements WHERE status = 'active'`,
    )
    const playbookRuns = await dbQuery(`SELECT checklist FROM playbook_runs`)
    let incompleteChecklistItems = 0
    for (const row of playbookRuns.rows as { checklist: { done: boolean }[] }[]) {
      const list = row.checklist || []
      incompleteChecklistItems += list.filter((i) => !i.done).length
    }

    const recentActivities = await dbQuery(
      `SELECT ca.*, c.name AS customer_name, u.name AS user_name
       FROM customer_activities ca
       LEFT JOIN customers c ON c.id = ca.customer_id
       LEFT JOIN users u ON u.id = ca.user_id
       ORDER BY ca.created_at DESC LIMIT 10`,
    )

    return NextResponse.json({
      stats: {
        activeCustomers: activeCustomers.rows[0]?.count ?? 0,
        openEngagements: openEngagements.rows[0]?.count ?? 0,
        incompleteChecklistItems,
      },
      recentActivities: recentActivities.rows,
      user,
    })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}
