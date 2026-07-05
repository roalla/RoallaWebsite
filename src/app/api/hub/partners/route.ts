import { NextRequest, NextResponse } from 'next/server'
import { dbConfigured, dbQuery } from '@/lib/db'
import { requireHubSession } from '@/lib/hub/auth-session'
import { canAccessModule, canManagePartners } from '@/lib/hub/permissions'

export async function GET() {
  try {
    const { user } = await requireHubSession()
    if (!canAccessModule(user.role, 'partners')) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    if (!dbConfigured()) {
      return NextResponse.json({ partners: [] })
    }

    const res = await dbQuery(
      `SELECT p.*, u.name AS owner_name
       FROM partners p
       LEFT JOIN users u ON u.id = p.owner_id
       ORDER BY p.updated_at DESC`,
    )
    return NextResponse.json({ partners: res.rows })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireHubSession()
    if (!canManagePartners(user.role)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    if (!dbConfigured()) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
    }

    const body = (await request.json()) as {
      name?: string
      organization?: string
      contact_name?: string
      contact_email?: string
      contact_phone?: string
      status?: string
      notes?: string
    }

    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Partner name required.' }, { status: 400 })
    }

    const res = await dbQuery(
      `INSERT INTO partners (name, organization, contact_name, contact_email, contact_phone, status, notes, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        body.name.trim(),
        body.organization?.trim() || '',
        body.contact_name?.trim() || '',
        body.contact_email?.trim() || '',
        body.contact_phone?.trim() || '',
        body.status || 'active',
        body.notes?.trim() || '',
        user.id,
      ],
    )

    return NextResponse.json({ partner: res.rows[0] }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}
