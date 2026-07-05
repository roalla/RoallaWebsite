import { NextRequest, NextResponse } from 'next/server'
import { dbConfigured, dbQuery } from '@/lib/db'
import { requireHubSession } from '@/lib/hub/auth-session'
import { canAccessModule, canManageLessons } from '@/lib/hub/permissions'

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

    const body = (await request.json()) as Record<string, string | null | undefined>
    const fields: string[] = []
    const values: unknown[] = []
    let idx = 1

    for (const key of ['title', 'body', 'category', 'customer_id', 'service_line'] as const) {
      if (key in body) {
        fields.push(`${key} = $${idx++}`)
        values.push(body[key] ?? null)
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No fields to update.' }, { status: 400 })
    }

    fields.push(`updated_at = NOW()`)
    values.push(id)

    const res = await dbQuery(
      `UPDATE lessons_learned SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
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
