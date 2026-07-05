import { NextRequest, NextResponse } from 'next/server'
import { dbConfigured, dbQuery } from '@/lib/db'
import { requireHubSession } from '@/lib/hub/auth-session'
import { canManageLessons } from '@/lib/hub/permissions'
import { prepareLessonInput } from '@/lib/hub/lesson-api'
import {
  normalizeRecommendations,
  recommendationsFromRecord,
  syncLegacyRecommendationFields,
  type RecommendationStatus,
} from '@/lib/hub/lesson-recommendations'

type RouteContext = { params: Promise<{ lessonId: string }> }

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireHubSession()
    if (!canManageLessons(user.role)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }
    const { lessonId } = await context.params
    if (!dbConfigured()) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
    }

    const body = (await request.json()) as {
      recommendation_id?: string
      status?: RecommendationStatus
    }

    if (!body.recommendation_id || !body.status) {
      return NextResponse.json({ error: 'recommendation_id and status required.' }, { status: 400 })
    }

    const existing = await dbQuery(`SELECT * FROM lessons_learned WHERE id = $1`, [lessonId])
    if (!existing.rowCount) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 })
    }

    const row = existing.rows[0] as Record<string, unknown>
    const recommendations = recommendationsFromRecord(row as Parameters<typeof recommendationsFromRecord>[0])
    const updated = recommendations.map((rec) =>
      rec.id === body.recommendation_id ? { ...rec, status: body.status! } : rec,
    )

    if (!updated.some((r) => r.id === body.recommendation_id)) {
      return NextResponse.json({ error: 'Recommendation not found.' }, { status: 404 })
    }

    const synced = syncLegacyRecommendationFields(normalizeRecommendations(updated))
    const payload = {
      title: row.title,
      context: row.context,
      what_happened: row.what_happened,
      what_worked: row.what_worked,
      what_didnt_work: row.what_didnt_work,
      root_cause: row.root_cause,
      recommendation: synced.recommendation,
      additional_recommendations: synced.additional_recommendations,
      recommendations: synced.recommendations,
      impact: row.impact,
      category: row.category,
      customer_id: row.customer_id,
      service_line: row.service_line,
    }

    const { error } = prepareLessonInput(payload as Record<string, unknown>)
    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    const res = await dbQuery(
      `UPDATE lessons_learned SET
         recommendation = $1,
         additional_recommendations = $2::jsonb,
         recommendations = $3::jsonb,
         updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [
        synced.recommendation,
        JSON.stringify(synced.additional_recommendations),
        JSON.stringify(synced.recommendations),
        lessonId,
      ],
    )

    return NextResponse.json({ lesson: res.rows[0] })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}
