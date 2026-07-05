import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getHubSession } from '@/lib/hub/auth-session'
import { dbConfigured, dbQuery } from '@/lib/db'
import { canAccessModule, canManageLessons } from '@/lib/hub/permissions'
import LessonsList from '@/components/hub/LessonsList'

export const metadata: Metadata = {
  title: 'Lessons Learned | Roalla Internal Hub',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

export default async function HubLessonsPage({ params }: Props) {
  const { locale } = await params
  const session = await getHubSession()
  if (!session.signedIn || !session.user) redirect(`/${locale}/hub/login`)
  if (!canAccessModule(session.user.role, 'lessons')) redirect(`/${locale}/hub`)

  let lessons: Parameters<typeof LessonsList>[0]['initialLessons'] = []
  let customers: { id: string; name: string }[] = []
  if (dbConfigured()) {
    const [lessonsRes, customersRes] = await Promise.all([
      dbQuery(
        `SELECT l.*, c.name AS customer_name, u.name AS author_name
         FROM lessons_learned l
         LEFT JOIN customers c ON c.id = l.customer_id
         LEFT JOIN users u ON u.id = l.author_id
         ORDER BY l.updated_at DESC`,
      ),
      canManageLessons(session.user.role)
        ? dbQuery(`SELECT id, name FROM customers ORDER BY name ASC`)
        : Promise.resolve({ rows: [] as { id: string; name: string }[] }),
    ])
    lessons = lessonsRes.rows as typeof lessons
    customers = customersRes.rows as typeof customers
  }

  return (
    <LessonsList
      initialLessons={lessons}
      canCreate={canManageLessons(session.user.role)}
      customers={customers}
    />
  )
}
