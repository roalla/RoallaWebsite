'use client'

import { useTranslations } from 'next-intl'
import RichTextContent from '@/components/hub/RichTextContent'
import { richTextIsEmpty } from '@/lib/hub/rich-text'
import {
  recommendationsFromRecord,
  type LessonRecommendation,
} from '@/lib/hub/lesson-recommendations'

type LessonLike = {
  recommendations?: unknown
  recommendation?: string | null
  additional_recommendations?: unknown
  body?: string | null
}

type Props = {
  lesson: LessonLike
  variant?: 'default' | 'highlight'
}

function StatusBadge({ status }: { status: LessonRecommendation['status'] }) {
  const t = useTranslations('hub')
  const colors =
    status === 'done'
      ? 'bg-emerald-100 text-emerald-800'
      : status === 'in_progress'
        ? 'bg-blue-100 text-blue-800'
        : 'bg-slate-100 text-slate-700'

  return (
    <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${colors}`}>
      {t(`recStatus_${status}`)}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: LessonRecommendation['priority'] }) {
  const t = useTranslations('hub')
  const colors =
    priority === 'high'
      ? 'bg-red-100 text-red-800'
      : priority === 'low'
        ? 'bg-slate-100 text-slate-600'
        : 'bg-amber-100 text-amber-900'

  return (
    <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${colors}`}>
      {t(`lessonImpact_${priority}`)}
    </span>
  )
}

function RecommendationCard({
  item,
  index,
  variant,
}: {
  item: LessonRecommendation
  index: number
  variant: 'default' | 'highlight'
}) {
  const t = useTranslations('hub')
  const highlighted = variant === 'highlight' && index === 0

  return (
    <div
      className={
        highlighted
          ? 'rounded-lg bg-amber-50/80 border border-amber-100 p-4'
          : 'rounded-lg bg-white border p-4'
      }
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-500">
          {t('lessonRecommendationN', { n: index + 1 })}
        </span>
        <PriorityBadge priority={item.priority} />
        <StatusBadge status={item.status} />
        {item.owner && (
          <span className="text-xs text-slate-500">
            {t('recOwnerLabel', { owner: item.owner })}
          </span>
        )}
      </div>
      <RichTextContent html={item.body} className={highlighted ? 'font-medium text-slate-900' : ''} />
    </div>
  )
}

export default function LessonRecommendationsView({ lesson, variant = 'highlight' }: Props) {
  const t = useTranslations('hub')
  const items = recommendationsFromRecord(lesson).filter((item) => !richTextIsEmpty(item.body))

  if (items.length === 0) return null

  return (
    <div className={variant === 'highlight' ? 'p-6 bg-amber-50/40' : 'p-6 space-y-4'}>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-800 mb-3">
        {t('lessonRecommendations')}
      </h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <RecommendationCard key={item.id} item={item} index={index} variant={variant} />
        ))}
      </div>
    </div>
  )
}

export { StatusBadge, PriorityBadge, RecommendationCard }
