import { NextRequest, NextResponse } from 'next/server'
import { dbConfigured } from '@/lib/db'
import { normalizeHeaderInsightSlugs } from '@/lib/header-insights'
import { saveHeaderInsightSlugs } from '@/lib/header-insights-store'
import { requireHubSession } from '@/lib/hub/auth-session'
import { canManageHeaderInsights } from '@/lib/hub/permissions'

export async function PUT(request: NextRequest) {
  try {
    const { user } = await requireHubSession()
    if (!canManageHeaderInsights(user.role)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    if (!dbConfigured()) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
    }

    const body = (await request.json()) as { slugs?: unknown }
    const slugs = normalizeHeaderInsightSlugs(body.slugs)
    if (!slugs) {
      return NextResponse.json({ error: 'Choose exactly five different articles.' }, { status: 400 })
    }

    await saveHeaderInsightSlugs(slugs)
    return NextResponse.json({ slugs })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}
