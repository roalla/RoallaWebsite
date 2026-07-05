import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import { getHubSession } from '@/lib/hub/auth-session'
import { dbConfigured, dbQuery } from '@/lib/db'
import { canAccessModule, canManagePartners } from '@/lib/hub/permissions'
import PartnerDetail from '@/components/hub/PartnerDetail'

export const metadata: Metadata = {
  title: 'Partner | Roalla Internal Hub',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string; id: string }> }

export default async function HubPartnerDetailPage({ params }: Props) {
  const { locale, id } = await params
  const session = await getHubSession()
  if (!session.signedIn || !session.user) redirect(`/${locale}/hub/login`)
  if (!canAccessModule(session.user.role, 'partners')) redirect(`/${locale}/hub`)

  if (!dbConfigured()) notFound()

  const res = await dbQuery(`SELECT * FROM partners WHERE id = $1`, [id])
  if (!res.rowCount) notFound()

  return (
    <PartnerDetail
      partner={res.rows[0] as Parameters<typeof PartnerDetail>[0]['partner']}
      canEdit={canManagePartners(session.user.role)}
    />
  )
}
