import { NextRequest, NextResponse } from 'next/server'
import { dbConfigured, dbQuery } from '@/lib/db'
import { requireHubSession } from '@/lib/hub/auth-session'
import { canWritePlaybooks } from '@/lib/hub/permissions'
import {
  getPlaybookTemplate,
  templateToChecklist,
} from '@/lib/hub/playbook-templates'
import type { ChecklistItem } from '@/lib/db/schema'

export async function GET() {
  try {
    await requireHubSession()
    if (!dbConfigured()) return NextResponse.json({ runs: [] })
    const res = await dbQuery(`SELECT * FROM playbook_runs ORDER BY updated_at DESC`)
    return NextResponse.json({ runs: res.rows })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireHubSession()
    if (!canWritePlaybooks(user.role)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    if (!dbConfigured()) {
      return NextResponse.json(
        {
          error:
            'Database not configured. Add DATABASE_URL on Railway (link your Postgres service to this web service).',
        },
        { status: 503 },
      )
    }

    const body = (await request.json()) as {
      template_id?: string
      customer_id?: string
      engagement_id?: string
      title?: string
    }

    const template = body.template_id ? getPlaybookTemplate(body.template_id) : undefined
    if (!template) {
      return NextResponse.json({ error: 'Invalid playbook template.' }, { status: 400 })
    }

    const checklist = templateToChecklist(template)
    const res = await dbQuery(
      `INSERT INTO playbook_runs (template_id, title, checklist, customer_id, engagement_id, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        template.id,
        body.title || template.title,
        JSON.stringify(checklist),
        body.customer_id || null,
        body.engagement_id || null,
        user.id,
      ],
    )

    return NextResponse.json({ run: res.rows[0] }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user } = await requireHubSession()
    if (!canWritePlaybooks(user.role)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    if (!dbConfigured()) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
    }

    const body = (await request.json()) as {
      id?: string
      checklist?: ChecklistItem[]
    }

    if (!body.id || !body.checklist) {
      return NextResponse.json({ error: 'Run id and checklist required.' }, { status: 400 })
    }

    const res = await dbQuery(
      `UPDATE playbook_runs SET checklist = $1, updated_at = NOW(), owner_id = COALESCE(owner_id, $3)
       WHERE id = $2 RETURNING *`,
      [JSON.stringify(body.checklist), body.id, user.id],
    )

    if (!res.rowCount) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 })
    }

    return NextResponse.json({ run: res.rows[0] })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}
