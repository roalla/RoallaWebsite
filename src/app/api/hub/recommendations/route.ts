import { NextResponse } from 'next/server'
import { dbConfigured, dbQuery } from '@/lib/db'
import { requireHubSession } from '@/lib/hub/auth-session'
import { canAccessModule } from '@/lib/hub/permissions'
import { flattenLessonRecommendations } from '@/lib/hub/lesson-recommendations'

export async function GET(request: Request) {
  try {
    const { user } = await requireHubSession()
    if (!canAccessModule(user.role, 'lessons')) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    if (!dbConfigured()) {
      return NextResponse.json({ recommendations: [] })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const res = await dbQuery(
      `SELECT l.*, c.name AS customer_name
       FROM lessons_learned l
       LEFT JOIN customers c ON c.id = l.customer_id
       ORDER BY l.updated_at DESC`,
    )

    const recommendations = flattenLessonRecommendations(
      res.rows as Parameters<typeof flattenLessonRecommendations>[0],
      status === 'open' || status === 'in_progress' || status === 'done' ? status : undefined,
    )

    return NextResponse.json({ recommendations })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}
