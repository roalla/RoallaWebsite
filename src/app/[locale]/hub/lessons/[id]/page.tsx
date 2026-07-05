import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import { getHubSession } from '@/lib/hub/auth-session'
import { dbConfigured, dbQuery } from '@/lib/db'
import { canAccessModule, canManageLessons } from '@/lib/hub/permissions'
import LessonDetail from '@/components/hub/LessonDetail'

export const metadata: Metadata = {
  title: 'Lesson | Roalla Internal Hub',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string; id: string }> }

export default async function HubLessonDetailPage({ params }: Props) {
  const { locale, id } = await params
  const session = await getHubSession()
  if (!session.signedIn || !session.user) redirect(`/${locale}/hub/login`)
  if (!canAccessModule(session.user.role, 'lessons')) redirect(`/${locale}/hub`)

  if (!dbConfigured()) notFound()

  const res = await dbQuery(
    `SELECT l.*, c.name AS customer_name, u.name AS author_name
     FROM lessons_learned l
     LEFT JOIN customers c ON c.id = l.customer_id
     LEFT JOIN users u ON u.id = l.author_id
     WHERE l.id = $1`,
    [id],
  )
  if (!res.rowCount) notFound()

  let customers: { id: string; name: string }[] = []
  if (canManageLessons(session.user.role)) {
    const customersRes = await dbQuery(`SELECT id, name FROM customers ORDER BY name ASC`)
    customers = customersRes.rows as typeof customers
  }

  return (
    <LessonDetail
      lesson={res.rows[0] as Parameters<typeof LessonDetail>[0]['lesson']}
      canEdit={canManageLessons(session.user.role)}
      customers={customers}
    />
  )
}
