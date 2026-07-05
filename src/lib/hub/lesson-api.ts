import {
  LESSON_RICH_TEXT_FIELDS,
  validateLessonPayload,
  type LessonFormValues,
} from '@/lib/hub/lesson-types'
import {
  normalizeAdditionalRecommendations,
  normalizeRichTextFields,
  richTextIsEmpty,
  sanitizeRichText,
} from '@/lib/hub/rich-text'
import {
  newRecommendation,
  normalizeRecommendations,
  syncLegacyRecommendationFields,
} from '@/lib/hub/lesson-recommendations'

export type LessonInput = {
  title: string
  body: string
  context: string
  what_happened: string
  what_worked: string
  what_didnt_work: string
  root_cause: string
  recommendation: string
  additional_recommendations: string[]
  recommendations: ReturnType<typeof normalizeRecommendations>
  impact: string
  category: string
  customer_id: string | null
  service_line: string | null
}

function recommendationsFromRaw(raw: Record<string, unknown>) {
  let recommendations = normalizeRecommendations(raw.recommendations)
  if (recommendations.length > 0) return recommendations

  const primary = sanitizeRichText(String(raw.recommendation ?? ''))
  const additional = normalizeAdditionalRecommendations(raw.additional_recommendations)
  const bodies = [primary, ...additional].filter((body) => !richTextIsEmpty(body))

  return bodies.map((body) => newRecommendation({ body }))
}

export function prepareLessonInput(raw: Record<string, unknown>): { payload: LessonInput | null; error: string | null } {
  const withRichText = normalizeRichTextFields(raw, [...LESSON_RICH_TEXT_FIELDS])
  const recommendations = recommendationsFromRaw(raw)
  const synced = syncLegacyRecommendationFields(recommendations)

  const payload: LessonInput = {
    title: String(raw.title ?? '').trim(),
    body: '',
    context: String(withRichText.context ?? ''),
    what_happened: String(withRichText.what_happened ?? ''),
    what_worked: String(withRichText.what_worked ?? ''),
    what_didnt_work: String(withRichText.what_didnt_work ?? ''),
    root_cause: String(withRichText.root_cause ?? ''),
    recommendation: synced.recommendation,
    additional_recommendations: synced.additional_recommendations,
    recommendations: synced.recommendations,
    impact: String(raw.impact ?? 'medium'),
    category: String(raw.category ?? 'general'),
    customer_id: raw.customer_id ? String(raw.customer_id) : null,
    service_line: raw.service_line ? String(raw.service_line).trim() || null : null,
  }

  const error = validateLessonPayload({
    ...payload,
    recommendations: payload.recommendations,
  } as Partial<LessonFormValues>)
  if (error) return { payload: null, error }

  return { payload, error: null }
}
