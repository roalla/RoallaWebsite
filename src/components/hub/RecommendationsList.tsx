'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import HubPageHeader from '@/components/hub/HubPageHeader'
import RichTextContent from '@/components/hub/RichTextContent'
import { PriorityBadge, StatusBadge } from '@/components/hub/LessonRecommendationsView'
import { hubFetchJson } from '@/lib/hub/toast'
import { stripRichText } from '@/lib/hub/rich-text'
import {
  RECOMMENDATION_STATUSES,
  type FlatRecommendation,
  type RecommendationStatus,
} from '@/lib/hub/lesson-recommendations'

type Props = {
  initialItems: FlatRecommendation[]
  canManage: boolean
}

export default function RecommendationsList({ initialItems, canManage }: Props) {
  const t = useTranslations('hub')
  const [items, setItems] = useState(initialItems)
  const [statusFilter, setStatusFilter] = useState<RecommendationStatus | 'all'>('open')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [updating, setUpdating] = useState<string | null>(null)

  const counts = useMemo(
    () => ({
      all: items.length,
      open: items.filter((i) => i.status === 'open').length,
      in_progress: items.filter((i) => i.status === 'in_progress').length,
      done: items.filter((i) => i.status === 'done').length,
    }),
    [items],
  )

  const filtered =
    statusFilter === 'all' ? items : items.filter((item) => item.status === statusFilter)

  function toggleExpand(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  async function updateStatus(item: FlatRecommendation, status: RecommendationStatus) {
    if (!canManage || item.status === status) return
    const key = `${item.lesson_id}-${item.id}`
    setUpdating(key)
    const result = await hubFetchJson<{ lesson: unknown }>(
      `/api/hub/recommendations/${item.lesson_id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendation_id: item.id, status }),
      },
      { success: t('recStatusUpdated') },
    )
    if (result.ok) {
      setItems((prev) =>
        prev.map((r) =>
          r.lesson_id === item.lesson_id && r.id === item.id ? { ...r, status } : r,
        ),
      )
    }
    setUpdating(null)
  }

  return (
    <div>
      <HubPageHeader title={t('navRecommendations')} subtitle={t('navRecommendationsSubtitle')} />

      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', ...RECOMMENDATION_STATUSES] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatusFilter(key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium min-h-[36px] ${
              statusFilter === key ? 'bg-primary-dark text-white' : 'bg-white border'
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
          {filtered.map((item) => {
            const key = `${item.lesson_id}-${item.id}`
            const isExpanded = expanded.has(key)
            const preview = stripRichText(item.body)
            return (
              <li key={key} className="rounded-xl border bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={{ pathname: '/hub/lessons/[id]', params: { id: item.lesson_id } }}
                      className="font-medium text-slate-900 hover:text-primary-dark"
                    >
                      {item.lesson_title}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t(`lessonCategory_${item.lesson_category}` as 'lessonCategory_general')}
                      {item.customer_name ? ` · ${item.customer_name}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <PriorityBadge priority={item.priority} />
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleExpand(key)}
                  className="text-sm text-slate-600 text-left line-clamp-2 hover:text-slate-900 w-full"
                >
                  {preview}
                </button>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t">
                    <RichTextContent html={item.body} />
                  </div>
                )}

                {item.owner && (
                  <p className="text-xs text-slate-500 mt-2">{t('recOwnerLabel', { owner: item.owner })}</p>
                )}

                {canManage && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                    {RECOMMENDATION_STATUSES.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={updating === key || item.status === status}
                        onClick={() => updateStatus(item, status)}
                        className={`text-xs rounded-full px-3 py-1.5 min-h-[36px] disabled:opacity-50 ${
                          item.status === status
                            ? 'bg-primary-dark text-white'
                            : 'border hover:border-primary/40'
                        }`}
                      >
                        {t(`recStatus_${status}`)}
                      </button>
                    ))}
                    <Link
                      href={{ pathname: '/hub/lessons/[id]', params: { id: item.lesson_id } }}
                      className="text-xs text-primary-dark hover:underline self-center ml-auto"
                    >
                      {t('editLessonRecommendations')}
                    </Link>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
