import { NextRequest, NextResponse } from 'next/server'
import { dbConfigured, dbQuery } from '@/lib/db'
import { requireHubSession } from '@/lib/hub/auth-session'
import { canAccessModule, canManageLessons } from '@/lib/hub/permissions'

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

    const body = (await request.json()) as {
      title?: string
      body?: string
      category?: string
      customer_id?: string | null
      service_line?: string | null
    }

    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title required.' }, { status: 400 })
    }

    const res = await dbQuery(
      `INSERT INTO lessons_learned (title, body, category, customer_id, service_line, author_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        body.title.trim(),
        body.body?.trim() || '',
        body.category || 'general',
        body.customer_id || null,
        body.service_line || null,
        user.id,
      ],
    )

    return NextResponse.json({ lesson: res.rows[0] }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}
