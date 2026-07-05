'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import RichTextContent from '@/components/hub/RichTextContent'
import { PriorityBadge, StatusBadge } from '@/components/hub/LessonRecommendationsView'
import type { FlatRecommendation, RecommendationStatus } from '@/lib/hub/lesson-recommendations'

type Props = {
  initialItems: FlatRecommendation[]
  canManage: boolean
}

export default function RecommendationsList({ initialItems, canManage }: Props) {
  const t = useTranslations('hub')
  const [statusFilter, setStatusFilter] = useState<RecommendationStatus | 'all'>('open')

  const counts = {
    all: initialItems.length,
    open: initialItems.filter((i) => i.status === 'open').length,
    in_progress: initialItems.filter((i) => i.status === 'in_progress').length,
    done: initialItems.filter((i) => i.status === 'done').length,
  }

  const filtered =
    statusFilter === 'all' ? initialItems : initialItems.filter((item) => item.status === statusFilter)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('navRecommendations')}</h1>
        <p className="text-slate-600 text-sm">{t('navRecommendationsSubtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'open', 'in_progress', 'done'] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatusFilter(key === 'all' ? 'all' : key)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              statusFilter === key ? 'bg-slate-900 text-white' : 'bg-white border'
            }`}
          >
            {key === 'all' ? t('filterAll') : t(`recStatus_${key}`)} ({counts[key]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500">{t('noRecommendations')}</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((item) => (
            <li key={`${item.lesson_id}-${item.id}`} className="rounded-xl border bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <Link
                    href={{ pathname: '/hub/lessons/[id]', params: { id: item.lesson_id } }}
                    className="font-medium text-slate-900 hover:text-amber-800"
                  >
                    {item.lesson_title}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t(`lessonCategory_${item.lesson_category}` as 'lessonCategory_general')}
                    {item.customer_name ? ` · ${item.customer_name}` : ''}
                    {' · '}
                    {new Date(item.lesson_updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <PriorityBadge priority={item.priority} />
                  <StatusBadge status={item.status} />
                </div>
              </div>
              <RichTextContent html={item.body} />
              {item.owner && (
                <p className="text-xs text-slate-500 mt-2">{t('recOwnerLabel', { owner: item.owner })}</p>
              )}
              {canManage && (
                <Link
                  href={{ pathname: '/hub/lessons/[id]', params: { id: item.lesson_id } }}
                  className="inline-block text-xs text-amber-800 hover:underline mt-3"
                >
                  {t('editLessonRecommendations')}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
