import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import { getHubSession } from '@/lib/hub/auth-session'
import { dbConfigured, dbQuery } from '@/lib/db'
import { canManageCustomers, canViewAllCustomers } from '@/lib/hub/permissions'
import CustomerDetail from '@/components/hub/CustomerDetail'

export const metadata: Metadata = {
  title: 'Customer | Roalla Internal Hub',
  robots: { index: false, follow: false },
}

type Props = { params: Promise<{ locale: string; id: string }> }

export default async function HubCustomerDetailPage({ params }: Props) {
  const { locale, id } = await params
  const session = await getHubSession()
  if (!session.signedIn || !session.user) redirect(`/${locale}/hub/login`)

  if (!dbConfigured()) notFound()

  const customerRes = await dbQuery(`SELECT * FROM customers WHERE id = $1`, [id])
  if (!customerRes.rowCount) notFound()

  const role = session.user.role
  if (!canViewAllCustomers(role) && !canManageCustomers(role)) {
    if (role === 'contractor') {
      const assign = await dbQuery(
        `SELECT 1 FROM customer_assignments WHERE customer_id = $1 AND user_id = $2`,
        [id, session.user.id],
      )
      if (!assign.rowCount) redirect(`/${locale}/hub`)
    } else {
      redirect(`/${locale}/hub`)
    }
  }

  const activities = await dbQuery(
    `SELECT ca.*, u.name AS user_name FROM customer_activities ca
     LEFT JOIN users u ON u.id = ca.user_id
     WHERE ca.customer_id = $1 ORDER BY ca.created_at DESC`,
    [id],
  )

  return (
    <CustomerDetail
      customer={customerRes.rows[0] as Parameters<typeof CustomerDetail>[0]['customer']}
      activities={activities.rows as Parameters<typeof CustomerDetail>[0]['activities']}
      canEdit={canManageCustomers(role)}
    />
  )
}
