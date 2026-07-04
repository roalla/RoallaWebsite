import { NextRequest, NextResponse } from 'next/server'
import { dbConfigured, dbQuery } from '@/lib/db'
import { requireHubSession } from '@/lib/hub/auth-session'
import { canManageCustomers, canViewAllCustomers } from '@/lib/hub/permissions'

export async function GET() {
  try {
    const { user } = await requireHubSession()
    if (!canManageCustomers(user.role) && !canViewAllCustomers(user.role)) {
      if (user.role === 'contractor') {
        const res = await dbQuery(
          `SELECT c.* FROM customers c
           INNER JOIN customer_assignments ca ON ca.customer_id = c.id
           WHERE ca.user_id = $1
           ORDER BY c.updated_at DESC`,
          [user.id],
        )
        return NextResponse.json({ customers: res.rows })
      }
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    if (!dbConfigured()) {
      return NextResponse.json({ customers: [] })
    }
    const res = await dbQuery(`SELECT * FROM customers ORDER BY updated_at DESC`)
    return NextResponse.json({ customers: res.rows })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireHubSession()
    if (!canManageCustomers(user.role)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    if (!dbConfigured()) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
    }

    const body = (await request.json()) as {
      name?: string
      stage?: string
      service_line?: string
      primary_contact?: string
      primary_email?: string
      notes?: string
      journey_pillar?: string
    }

    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Customer name required.' }, { status: 400 })
    }

    const res = await dbQuery(
      `INSERT INTO customers (name, stage, service_line, primary_contact, primary_email, notes, journey_pillar, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        body.name.trim(),
        body.stage || 'lead',
        body.service_line || 'digital',
        body.primary_contact || '',
        body.primary_email || '',
        body.notes || '',
        body.journey_pillar || null,
        user.id,
      ],
    )

    const customer = res.rows[0]
    await dbQuery(
      `INSERT INTO customer_activities (customer_id, user_id, activity_type, summary)
       VALUES ($1, $2, 'created', $3)`,
      [customer.id, user.id, `Customer created by ${user.name || user.email}`],
    )

    return NextResponse.json({ customer }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}
