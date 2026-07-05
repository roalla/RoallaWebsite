import { NextRequest, NextResponse } from 'next/server'
import { dbConfigured, dbQuery } from '@/lib/db'
import { requireHubSession } from '@/lib/hub/auth-session'
import { canAccessModule } from '@/lib/hub/permissions'

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireHubSession()
    const q = request.nextUrl.searchParams.get('q')?.trim()
    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] })
    }
    if (!dbConfigured()) {
      return NextResponse.json({ results: [] })
    }

    const pattern = `%${q.replace(/[%_\\]/g, '\\$&')}%`
    const results: { type: string; id: string; title: string; subtitle?: string }[] = []

    if (canAccessModule(user.role, 'customers')) {
      const customers = await dbQuery(
        `SELECT id, name, stage FROM customers
         WHERE name ILIKE $1 OR primary_contact ILIKE $1
         ORDER BY updated_at DESC LIMIT 8`,
        [pattern],
      )
      for (const row of customers.rows as { id: string; name: string; stage: string }[]) {
        results.push({ type: 'customer', id: row.id, title: row.name, subtitle: row.stage })
      }
    }

    if (canAccessModule(user.role, 'partners')) {
      const partners = await dbQuery(
        `SELECT id, name, organization FROM partners
         WHERE name ILIKE $1 OR organization ILIKE $1
         ORDER BY updated_at DESC LIMIT 8`,
        [pattern],
      )
      for (const row of partners.rows as { id: string; name: string; organization: string }[]) {
        results.push({ type: 'partner', id: row.id, title: row.name, subtitle: row.organization })
      }
    }

    if (canAccessModule(user.role, 'lessons')) {
      const lessons = await dbQuery(
        `SELECT id, title, category FROM lessons_learned
         WHERE title ILIKE $1
         ORDER BY updated_at DESC LIMIT 8`,
        [pattern],
      )
      for (const row of lessons.rows as { id: string; title: string; category: string }[]) {
        results.push({ type: 'lesson', id: row.id, title: row.title, subtitle: row.category })
      }
    }

    return NextResponse.json({ results: results.slice(0, 12) })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}
