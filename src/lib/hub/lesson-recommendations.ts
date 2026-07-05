import { richTextIsEmpty, sanitizeRichText } from '@/lib/hub/rich-text'

export const RECOMMENDATION_PRIORITIES = ['low', 'medium', 'high'] as const
export type RecommendationPriority = (typeof RECOMMENDATION_PRIORITIES)[number]

export const RECOMMENDATION_STATUSES = ['open', 'in_progress', 'done'] as const
export type RecommendationStatus = (typeof RECOMMENDATION_STATUSES)[number]

export type LessonRecommendation = {
  id: string
  body: string
  priority: RecommendationPriority
  status: RecommendationStatus
  owner: string
}

export function newRecommendation(overrides: Partial<LessonRecommendation> = {}): LessonRecommendation {
  const id =
    overrides.id ||
    (typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `rec-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`)

  return {
    id,
    body: overrides.body || '',
    priority: overrides.priority || 'medium',
    status: overrides.status || 'open',
    owner: overrides.owner || '',
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseRecommendationItem(raw: unknown): LessonRecommendation | null {
  if (!isRecord(raw)) return null
  const body = typeof raw.body === 'string' ? raw.body : ''
  if (richTextIsEmpty(body)) return null

  const priority = RECOMMENDATION_PRIORITIES.includes(raw.priority as RecommendationPriority)
    ? (raw.priority as RecommendationPriority)
    : 'medium'
  const status = RECOMMENDATION_STATUSES.includes(raw.status as RecommendationStatus)
    ? (raw.status as RecommendationStatus)
    : 'open'

  return newRecommendation({
    id: typeof raw.id === 'string' ? raw.id : crypto.randomUUID(),
    body,
    priority,
    status,
    owner: typeof raw.owner === 'string' ? raw.owner : '',
  })
}

export function parseRecommendations(value: unknown): LessonRecommendation[] {
  if (Array.isArray(value)) {
    return value.map(parseRecommendationItem).filter((item): item is LessonRecommendation => item !== null)
  }
  if (typeof value === 'string' && value.trim()) {
    try {
      return parseRecommendations(JSON.parse(value) as unknown)
    } catch {
      return []
    }
  }
  return []
}

export function recommendationsFromLegacy(row: {
  recommendation?: string | null
  additional_recommendations?: unknown
  body?: string | null
}): LessonRecommendation[] {
  const items: LessonRecommendation[] = []

  if (row.recommendation && !richTextIsEmpty(row.recommendation)) {
    items.push(newRecommendation({ id: 'legacy-primary', body: row.recommendation }))
  }

  const additional = Array.isArray(row.additional_recommendations)
    ? row.additional_recommendations.filter((item): item is string => typeof item === 'string')
    : []

  for (const body of additional) {
    if (!richTextIsEmpty(body)) {
      items.push(newRecommendation({ body }))
    }
  }

  if (items.length === 0 && row.body && !richTextIsEmpty(row.body)) {
    items.push(newRecommendation({ body: row.body }))
  }

  return items
}

export function recommendationsFromRecord(row: {
  recommendations?: unknown
  recommendation?: string | null
  additional_recommendations?: unknown
  body?: string | null
}): LessonRecommendation[] {
  const structured = parseRecommendations(row.recommendations)
  if (structured.length > 0) return structured
  return recommendationsFromLegacy(row)
}

export function normalizeRecommendations(items: unknown): LessonRecommendation[] {
  if (!Array.isArray(items)) return []
  return items
    .map((item) => {
      if (!isRecord(item)) return null
      return newRecommendation({
        id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
        body: sanitizeRichText(String(item.body ?? '')),
        priority: RECOMMENDATION_PRIORITIES.includes(item.priority as RecommendationPriority)
          ? (item.priority as RecommendationPriority)
          : 'medium',
        status: RECOMMENDATION_STATUSES.includes(item.status as RecommendationStatus)
          ? (item.status as RecommendationStatus)
          : 'open',
        owner: String(item.owner ?? '').trim(),
      })
    })
    .filter((item): item is LessonRecommendation => item !== null && !richTextIsEmpty(item.body))
}

export function validateRecommendations(items: LessonRecommendation[]): string | null {
  const valid = items.filter((item) => !richTextIsEmpty(item.body))
  if (valid.length === 0) return 'At least one recommendation required.'
  return null
}

export function syncLegacyRecommendationFields(items: LessonRecommendation[]) {
  const normalized = normalizeRecommendations(items)
  return {
    recommendations: normalized,
    recommendation: normalized[0]?.body || '',
    additional_recommendations: normalized.slice(1).map((item) => item.body),
  }
}

export type FlatRecommendation = LessonRecommendation & {
  lesson_id: string
  lesson_title: string
  lesson_category: string
  lesson_impact: string
  lesson_updated_at: string
  customer_name?: string | null
}

export function flattenLessonRecommendations(
  lessons: Array<{
    id: string
    title: string
    category: string
    impact: string
    updated_at: string
    customer_name?: string | null
    recommendations?: unknown
    recommendation?: string | null
    additional_recommendations?: unknown
    body?: string | null
  }>,
  statusFilter?: RecommendationStatus | 'all',
): FlatRecommendation[] {
  const flat: FlatRecommendation[] = []

  for (const lesson of lessons) {
    const items = recommendationsFromRecord(lesson)
    for (const item of items) {
      if (statusFilter && statusFilter !== 'all' && item.status !== statusFilter) continue
      flat.push({
        ...item,
        lesson_id: lesson.id,
        lesson_title: lesson.title,
        lesson_category: lesson.category,
        lesson_impact: lesson.impact,
        lesson_updated_at: lesson.updated_at,
        customer_name: lesson.customer_name,
      })
    }
  }

  return flat.sort(
    (a, b) => new Date(b.lesson_updated_at).getTime() - new Date(a.lesson_updated_at).getTime(),
  )
}
