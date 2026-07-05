import { NextRequest, NextResponse } from 'next/server'
import { dbConfigured, dbQuery } from '@/lib/db'
import { requireHubSession } from '@/lib/hub/auth-session'
import { canAccessModule, canManageLessons } from '@/lib/hub/permissions'
import { prepareLessonInput } from '@/lib/hub/lesson-api'

export async function GET() {
  try {
    const { user } = await requireHubSession()
    if (!canAccessModule(user.role, 'lessons')) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    if (!dbConfigured()) {
      return NextResponse.json({ lessons: [] })
    }

    const res = await dbQuery(
      `SELECT l.*, c.name AS customer_name, u.name AS author_name
       FROM lessons_learned l
       LEFT JOIN customers c ON c.id = l.customer_id
       LEFT JOIN users u ON u.id = l.author_id
       ORDER BY l.updated_at DESC`,
    )
    return NextResponse.json({ lessons: res.rows })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireHubSession()
    if (!canManageLessons(user.role)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    if (!dbConfigured()) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
    }

    const raw = (await request.json()) as Record<string, unknown>
    const { payload, error } = prepareLessonInput(raw)
    if (error || !payload) {
      return NextResponse.json({ error: error || 'Invalid payload.' }, { status: 400 })
    }

    const res = await dbQuery(
       `INSERT INTO lessons_learned (
         title, body, context, what_happened, what_worked, what_didnt_work,
         root_cause, recommendation, additional_recommendations, recommendations,
         impact, category, customer_id, service_line, author_id
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, $11, $12, $13, $14, $15)
       RETURNING *`,
      [
        payload.title,
        payload.body,
        payload.context,
        payload.what_happened,
        payload.what_worked,
        payload.what_didnt_work,
        payload.root_cause,
        payload.recommendation,
        JSON.stringify(payload.additional_recommendations),
        JSON.stringify(payload.recommendations),
        payload.impact,
        payload.category,
        payload.customer_id,
        payload.service_line,
        user.id,
      ],
    )

    return NextResponse.json({ lesson: res.rows[0] }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}
