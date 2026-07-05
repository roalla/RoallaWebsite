import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getHubSession } from '@/lib/hub/auth-session'
import { dbConfigured, dbQuery } from '@/lib/db'
import { canAccessModule, canManagePartners } from '@/lib/hub/permissions'
import PartnersList from '@/components/hub/PartnersList'

export const metadata: Metadata = {
  title: 'Partners | Roalla Internal Hub',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

export default async function HubPartnersPage({ params }: Props) {
  const { locale } = await params
  const session = await getHubSession()
  if (!session.signedIn || !session.user) redirect(`/${locale}/hub/login`)
  if (!canAccessModule(session.user.role, 'partners')) redirect(`/${locale}/hub`)

  let partners: Parameters<typeof PartnersList>[0]['initialPartners'] = []
  if (dbConfigured()) {
    const res = await dbQuery(`SELECT * FROM partners ORDER BY updated_at DESC`)
    partners = res.rows as typeof partners
  }

  return (
    <PartnersList initialPartners={partners} canCreate={canManagePartners(session.user.role)} />
  )
}
