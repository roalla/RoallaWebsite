import { NextRequest, NextResponse } from 'next/server'
import { dbConfigured, dbQuery } from '@/lib/db'
import { requireHubSession } from '@/lib/hub/auth-session'
import { canAccessModule, canManagePartners } from '@/lib/hub/permissions'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireHubSession()
    if (!canAccessModule(user.role, 'partners')) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    const { id } = await context.params
    if (!dbConfigured()) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
    }

    const res = await dbQuery(
      `SELECT p.*, u.name AS owner_name
       FROM partners p
       LEFT JOIN users u ON u.id = p.owner_id
       WHERE p.id = $1`,
      [id],
    )
    if (!res.rowCount) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 })
    }

    return NextResponse.json({ partner: res.rows[0] })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireHubSession()
    if (!canManagePartners(user.role)) {
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

    for (const key of [
      'name',
      'organization',
      'contact_name',
      'contact_email',
      'contact_phone',
      'status',
      'notes',
    ] as const) {
      if (key in body) {
        fields.push(`${key} = $${idx++}`)
        values.push(body[key] ?? '')
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No fields to update.' }, { status: 400 })
    }

    fields.push(`updated_at = NOW()`)
    values.push(id)

    const res = await dbQuery(
      `UPDATE partners SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    )
    if (!res.rowCount) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 })
    }

    return NextResponse.json({ partner: res.rows[0] })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireHubSession()
    if (!canManagePartners(user.role)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    const { id } = await context.params
    if (!dbConfigured()) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
    }

    const res = await dbQuery(`DELETE FROM partners WHERE id = $1 RETURNING id`, [id])
    if (!res.rowCount) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}
