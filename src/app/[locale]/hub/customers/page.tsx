import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getHubSession } from '@/lib/hub/auth-session'
import { dbConfigured, dbQuery } from '@/lib/db'
import { canManageCustomers, canViewAllCustomers } from '@/lib/hub/permissions'
import CustomersList from '@/components/hub/CustomersList'

export const metadata: Metadata = {
  title: 'Customers | Roalla Internal Hub',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

export default async function HubCustomersPage({ params }: Props) {
  const { locale } = await params
  const session = await getHubSession()
  if (!session.signedIn || !session.user) redirect(`/${locale}/hub/login`)

  const role = session.user.role
  if (!canManageCustomers(role) && !canViewAllCustomers(role) && role !== 'contractor') {
    redirect(`/${locale}/hub`)
  }

  let customers: Parameters<typeof CustomersList>[0]['initialCustomers'] = []
  if (dbConfigured()) {
    if (canViewAllCustomers(role) || canManageCustomers(role)) {
      const res = await dbQuery(`SELECT * FROM customers ORDER BY updated_at DESC`)
      customers = res.rows as typeof customers
    } else if (role === 'contractor') {
      const res = await dbQuery(
        `SELECT c.* FROM customers c
         INNER JOIN customer_assignments ca ON ca.customer_id = c.id
         WHERE ca.user_id = $1 ORDER BY c.updated_at DESC`,
        [session.user.id],
      )
      customers = res.rows as typeof customers
    }
  }

  return (
    <CustomersList initialCustomers={customers} canCreate={canManageCustomers(role)} />
  )
}
