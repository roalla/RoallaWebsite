'use client'

import { useTranslations } from 'next-intl'
import RichTextEditor from '@/components/hub/RichTextEditor'
import {
  newRecommendation,
  RECOMMENDATION_PRIORITIES,
  RECOMMENDATION_STATUSES,
  type LessonRecommendation,
} from '@/lib/hub/lesson-recommendations'

type Props = {
  items: LessonRecommendation[]
  onChange: (items: LessonRecommendation[]) => void
  idPrefix?: string
}

export default function LessonRecommendationsField({ items, onChange, idPrefix = 'rec' }: Props) {
  const t = useTranslations('hub')

  function updateItem(index: number, patch: Partial<LessonRecommendation>) {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item))
    onChange(next)
  }

  function addItem() {
    onChange([...items, newRecommendation()])
  }

  function removeItem(index: number) {
    if (items.length <= 1) {
      onChange([newRecommendation()])
      return
    }
    onChange(items.filter((_, i) => i !== index))
  }

  const displayItems = items.length > 0 ? items : [newRecommendation()]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{t('lessonRecommendations')} *</p>
          <p className="text-xs text-slate-500">{t('lessonRecommendationsHint')}</p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="text-xs font-medium text-amber-800 hover:underline shrink-0"
        >
          {t('lessonAddRecommendation')}
        </button>
      </div>

      <div className="space-y-4">
        {displayItems.map((item, index) => (
          <div key={item.id} className="rounded-xl border bg-slate-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t('lessonRecommendationN', { n: index + 1 })}
              </p>
              {displayItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-xs text-red-700 hover:underline"
                >
                  {t('lessonRemoveRecommendation')}
                </button>
              )}
            </div>

            <RichTextEditor
              id={`${idPrefix}-${item.id}-body`}
              value={item.body}
              onChange={(html) => updateItem(index, { body: html })}
              placeholder={t('lessonRecommendationPlaceholder')}
              minHeight="4rem"
              required={index === 0}
            />

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor={`${idPrefix}-${item.id}-priority`} className="block text-xs font-medium mb-1">
                  {t('recPriority')}
                </label>
                <select
                  id={`${idPrefix}-${item.id}-priority`}
                  value={item.priority}
                  onChange={(e) =>
                    updateItem(index, { priority: e.target.value as LessonRecommendation['priority'] })
                  }
                  className="w-full rounded-lg border px-2 py-1.5 text-sm bg-white"
                >
                  {RECOMMENDATION_PRIORITIES.map((level) => (
                    <option key={level} value={level}>
                      {t(`lessonImpact_${level}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`${idPrefix}-${item.id}-status`} className="block text-xs font-medium mb-1">
                  {t('recStatus')}
                </label>
                <select
                  id={`${idPrefix}-${item.id}-status`}
                  value={item.status}
                  onChange={(e) =>
                    updateItem(index, { status: e.target.value as LessonRecommendation['status'] })
                  }
                  className="w-full rounded-lg border px-2 py-1.5 text-sm bg-white"
                >
                  {RECOMMENDATION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {t(`recStatus_${status}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`${idPrefix}-${item.id}-owner`} className="block text-xs font-medium mb-1">
                  {t('recOwner')}
                </label>
                <input
                  id={`${idPrefix}-${item.id}-owner`}
                  value={item.owner}
                  onChange={(e) => updateItem(index, { owner: e.target.value })}
                  placeholder={t('recOwnerPlaceholder')}
                  className="w-full rounded-lg border px-2 py-1.5 text-sm bg-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { newRecommendation }
