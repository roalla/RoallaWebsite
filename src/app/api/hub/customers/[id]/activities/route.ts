import { NextRequest, NextResponse } from 'next/server'
import { dbConfigured, dbQuery } from '@/lib/db'
import { requireHubSession } from '@/lib/hub/auth-session'
import { canManageCustomers, canViewAllCustomers } from '@/lib/hub/permissions'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireHubSession()
    const { id: customerId } = await context.params

    if (
      !canManageCustomers(user.role) &&
      !canViewAllCustomers(user.role) &&
      user.role !== 'contractor'
    ) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }

    if (!dbConfigured()) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
    }

    const body = (await request.json()) as { summary?: string; activity_type?: string }
    if (!body.summary?.trim()) {
      return NextResponse.json({ error: 'Summary required.' }, { status: 400 })
    }

    const res = await dbQuery(
      `INSERT INTO customer_activities (customer_id, user_id, activity_type, summary)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [customerId, user.id, body.activity_type || 'note', body.summary.trim()],
    )

    await dbQuery(`UPDATE customers SET updated_at = NOW() WHERE id = $1`, [customerId])

    return NextResponse.json({ activity: res.rows[0] }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}
