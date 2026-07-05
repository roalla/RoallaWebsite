import { richTextIsEmpty, sanitizeRichText, stripRichText } from '@/lib/hub/rich-text'
import {
  normalizeRecommendations,
  recommendationsFromRecord,
  syncLegacyRecommendationFields,
  validateRecommendations,
  newRecommendation,
  type LessonRecommendation,
} from '@/lib/hub/lesson-recommendations'

export const LESSON_CATEGORIES = ['general', 'delivery', 'client', 'internal'] as const
export type LessonCategory = (typeof LESSON_CATEGORIES)[number]

export const LESSON_IMPACTS = ['low', 'medium', 'high'] as const
export type LessonImpact = (typeof LESSON_IMPACTS)[number]

export const LESSON_RICH_TEXT_FIELDS = [
  'context',
  'what_happened',
  'what_worked',
  'what_didnt_work',
  'root_cause',
] as const

export type LessonRecord = {
  id: string
  title: string
  body?: string
  context: string
  what_happened: string
  what_worked: string
  what_didnt_work: string
  root_cause: string
  recommendation: string
  additional_recommendations?: string[]
  recommendations?: LessonRecommendation[]
  impact: string
  category: string
  service_line?: string | null
  customer_id?: string | null
  customer_name?: string | null
  author_name?: string | null
  updated_at: string
}

export type LessonFormValues = {
  title: string
  context: string
  what_happened: string
  what_worked: string
  what_didnt_work: string
  root_cause: string
  recommendations: LessonRecommendation[]
  impact: LessonImpact
  category: LessonCategory
  service_line: string
  customer_id: string
}

export const EMPTY_LESSON_FORM: LessonFormValues = {
  title: '',
  context: '',
  what_happened: '',
  what_worked: '',
  what_didnt_work: '',
  root_cause: '',
  recommendations: [newRecommendation()],
  impact: 'medium',
  category: 'general',
  service_line: '',
  customer_id: '',
}

export function lessonFromRecord(row: Partial<LessonRecord>): LessonFormValues {
  const recs = recommendationsFromRecord(row)
  const hasStructured =
    row.context ||
    row.what_happened ||
    row.what_worked ||
    row.what_didnt_work ||
    row.root_cause ||
    recs.length > 0

  return {
    title: row.title || '',
    context: row.context || '',
    what_happened: row.what_happened || (hasStructured ? '' : row.body || ''),
    what_worked: row.what_worked || '',
    what_didnt_work: row.what_didnt_work || '',
    root_cause: row.root_cause || '',
    recommendations: recs.length > 0 ? recs : [newRecommendation()],
    impact: (LESSON_IMPACTS.includes(row.impact as LessonImpact) ? row.impact : 'medium') as LessonImpact,
    category: (LESSON_CATEGORIES.includes(row.category as LessonCategory)
      ? row.category
      : 'general') as LessonCategory,
    service_line: row.service_line || '',
    customer_id: row.customer_id || '',
  }
}

export function validateLessonPayload(values: Partial<LessonFormValues>): string | null {
  if (!values.title?.trim()) return 'Title required.'
  const recError = validateRecommendations(values.recommendations || [])
  if (recError) return recError
  if (richTextIsEmpty(values.what_happened || '') && richTextIsEmpty(values.what_didnt_work || '')) {
    return 'Describe what happened or what did not work.'
  }
  return null
}

export function lessonPayloadFromForm(form: LessonFormValues) {
  const synced = syncLegacyRecommendationFields(form.recommendations)

  return {
    title: form.title.trim(),
    context: sanitizeRichText(form.context),
    what_happened: sanitizeRichText(form.what_happened),
    what_worked: sanitizeRichText(form.what_worked),
    what_didnt_work: sanitizeRichText(form.what_didnt_work),
    root_cause: sanitizeRichText(form.root_cause),
    recommendation: synced.recommendation,
    additional_recommendations: synced.additional_recommendations,
    recommendations: synced.recommendations,
    impact: form.impact,
    category: form.category,
    service_line: form.service_line.trim() || null,
    customer_id: form.customer_id || null,
    body: '',
  }
}

export function lessonListPreview(lesson: Partial<LessonRecord>): string {
  const recs = recommendationsFromRecord(lesson)
  const raw =
    recs[0]?.body ||
    lesson.recommendation ||
    lesson.what_didnt_work ||
    lesson.what_happened ||
    lesson.body ||
    ''
  return stripRichText(raw)
}

export { type LessonRecommendation } from '@/lib/hub/lesson-recommendations'
