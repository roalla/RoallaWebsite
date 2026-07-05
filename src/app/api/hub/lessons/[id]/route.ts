import { NextRequest, NextResponse } from 'next/server'
import { dbConfigured, dbQuery } from '@/lib/db'
import { requireHubSession } from '@/lib/hub/auth-session'
import { canAccessModule, canManageLessons } from '@/lib/hub/permissions'
import { prepareLessonInput } from '@/lib/hub/lesson-api'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireHubSession()
    if (!canAccessModule(user.role, 'lessons')) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    const { id } = await context.params
    if (!dbConfigured()) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
    }

    const res = await dbQuery(
      `SELECT l.*, c.name AS customer_name, u.name AS author_name
       FROM lessons_learned l
       LEFT JOIN customers c ON c.id = l.customer_id
       LEFT JOIN users u ON u.id = l.author_id
       WHERE l.id = $1`,
      [id],
    )
    if (!res.rowCount) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 })
    }

    return NextResponse.json({ lesson: res.rows[0] })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireHubSession()
    if (!canManageLessons(user.role)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    const { id } = await context.params
    if (!dbConfigured()) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
    }

    const raw = (await request.json()) as Record<string, unknown>
    const { payload, error } = prepareLessonInput(raw)
    if (error || !payload) {
      return NextResponse.json({ error: error || 'Invalid payload.' }, { status: 400 })
    }

    const res = await dbQuery(
      `UPDATE lessons_learned SET
         title = $1,
         body = $2,
         context = $3,
         what_happened = $4,
         what_worked = $5,
         what_didnt_work = $6,
         root_cause = $7,
         recommendation = $8,
         additional_recommendations = $9::jsonb,
         recommendations = $10::jsonb,
         impact = $11,
         category = $12,
         customer_id = $13,
         service_line = $14,
         updated_at = NOW()
       WHERE id = $15
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
        id,
      ],
    )
    if (!res.rowCount) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 })
    }

    return NextResponse.json({ lesson: res.rows[0] })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireHubSession()
    if (!canManageLessons(user.role)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    const { id } = await context.params
    if (!dbConfigured()) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
    }

    const res = await dbQuery(`DELETE FROM lessons_learned WHERE id = $1 RETURNING id`, [id])
    if (!res.rowCount) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}
