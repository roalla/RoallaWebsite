import { NextRequest, NextResponse } from 'next/server'
import { dbConfigured, dbQuery } from '@/lib/db'
import { requireHubSession } from '@/lib/hub/auth-session'
import { canManageCustomers, canViewAllCustomers } from '@/lib/hub/permissions'

type RouteContext = { params: Promise<{ id: string }> }

async function canAccessCustomer(userId: string, role: string, customerId: string): Promise<boolean> {
  if (canViewAllCustomers(role as Parameters<typeof canViewAllCustomers>[0])) return true
  if (role === 'contractor') {
    const res = await dbQuery(
      `SELECT 1 FROM customer_assignments WHERE customer_id = $1 AND user_id = $2`,
      [customerId, userId],
    )
    return (res.rowCount ?? 0) > 0
  }
  return false
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireHubSession()
    const { id } = await context.params
    if (!dbConfigured()) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
    }

    const allowed = await canAccessCustomer(user.id, user.role, id)
    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }

    const customerRes = await dbQuery(`SELECT * FROM customers WHERE id = $1`, [id])
    if (!customerRes.rowCount) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 })
    }

    const activities = await dbQuery(
      `SELECT ca.*, u.name AS user_name FROM customer_activities ca
       LEFT JOIN users u ON u.id = ca.user_id
       WHERE ca.customer_id = $1 ORDER BY ca.created_at DESC`,
      [id],
    )
    const engagements = await dbQuery(
      `SELECT * FROM engagements WHERE customer_id = $1 ORDER BY created_at DESC`,
      [id],
    )
    const playbookRuns = await dbQuery(
      `SELECT * FROM playbook_runs WHERE customer_id = $1 ORDER BY created_at DESC`,
      [id],
    )

    return NextResponse.json({
      customer: customerRes.rows[0],
      activities: activities.rows,
      engagements: engagements.rows,
      playbookRuns: playbookRuns.rows,
    })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireHubSession()
    if (!canManageCustomers(user.role)) {
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
      'stage',
      'service_line',
      'primary_contact',
      'primary_email',
      'notes',
      'journey_pillar',
      'owner_id',
    ] as const) {
      if (key in body) {
        fields.push(`${key} = $${idx++}`)
        values.push(body[key] ?? null)
      }
    }

    if (!fields.length) {
      return NextResponse.json({ error: 'No fields to update.' }, { status: 400 })
    }

    fields.push(`updated_at = NOW()`)
    values.push(id)

    const res = await dbQuery(
      `UPDATE customers SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    )
    if (!res.rowCount) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 })
    }

    if (body.stage) {
      await dbQuery(
        `INSERT INTO customer_activities (customer_id, user_id, activity_type, summary)
         VALUES ($1, $2, 'status', $3)`,
        [id, user.id, `Stage updated to ${body.stage}`],
      )
    }

    return NextResponse.json({ customer: res.rows[0] })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireHubSession()
    if (!canManageCustomers(user.role)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    const { id } = await context.params
    await dbQuery(`DELETE FROM customers WHERE id = $1`, [id])
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}
