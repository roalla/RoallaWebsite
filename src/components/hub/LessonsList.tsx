'use client'

import { useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import HubPageHeader from '@/components/hub/HubPageHeader'
import { hubFetchJson } from '@/lib/hub/toast'
import { recommendationsFromRecord } from '@/lib/hub/lesson-recommendations'
import {
  LESSON_CATEGORIES,
  lessonListPreview,
  lessonPayloadFromForm,
  EMPTY_LESSON_FORM,
  type LessonRecord,
} from '@/lib/hub/lesson-types'
import LessonFormFields from '@/components/hub/LessonFormFields'
import { LessonImpactBadge } from '@/components/hub/LessonFormatView'

export type { LessonRecord }

type CustomerOption = { id: string; name: string }

type Props = {
  initialLessons: LessonRecord[]
  canCreate: boolean
  customers?: CustomerOption[]
}

export default function LessonsList({ initialLessons, canCreate, customers = [] }: Props) {
  const t = useTranslations('hub')
  const [lessons, setLessons] = useState(initialLessons)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(EMPTY_LESSON_FORM)
  const [pending, setPending] = useState(false)

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: lessons.length }
    for (const c of LESSON_CATEGORIES) counts[c] = lessons.filter((l) => l.category === c).length
    return counts
  }, [lessons])

  const filtered = useMemo(() => {
    let list = filter === 'all' ? lessons : lessons.filter((l) => l.category === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((l) => l.title.toLowerCase().includes(q) || lessonListPreview(l).toLowerCase().includes(q))
    }
    return list
  }, [lessons, filter, search])

  async function createLesson(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    try {
      const result = await hubFetchJson<{ lesson: LessonRecord }>(
        '/api/hub/lessons',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lessonPayloadFromForm(form)),
        },
        { success: t('saveLesson') },
      )
      if (result.ok) {
        const customerName = customers.find((c) => c.id === form.customer_id)?.name ?? null
        setLessons((prev) => [
          { ...result.data.lesson, author_name: null, customer_name: customerName },
          ...prev,
        ])
        setShowForm(false)
        setForm(EMPTY_LESSON_FORM)
      }
    } finally {
      setPending(false)
    }
  }

  function recCount(lesson: LessonRecord) {
    return recommendationsFromRecord(lesson).length
  }

  const addButton = canCreate ? (
    <button
      type="button"
      onClick={() => setShowForm(!showForm)}
      className="rounded-lg bg-primary-dark text-white px-4 py-2 text-sm font-medium min-h-[44px]"
    >
      {t('addLesson')}
    </button>
  ) : undefined

  return (
    <div>
      <HubPageHeader title={t('navLessons')} subtitle={t('navLessonsSubtitle')} action={addButton} />

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('searchLessons')}
        className="w-full rounded-lg border px-3 py-2 text-sm mb-4 min-h-[44px]"
      />

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`rounded-full px-3 py-1.5 text-xs font-medium min-h-[36px] ${
            filter === 'all' ? 'bg-primary-dark text-white' : 'bg-white border'
          }`}
        >
          {t('filterAll')} ({categoryCounts.all})
        </button>
        {LESSON_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium min-h-[36px] ${
              filter === c ? 'bg-primary-dark text-white' : 'bg-white border'
            }`}
          >
            {t(`lessonCategory_${c}`)} ({categoryCounts[c] ?? 0})
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={createLesson} className="rounded-xl border bg-slate-50 p-6 mb-6 space-y-4">
          <LessonFormFields form={form} onChange={setForm} customers={customers} idPrefix="new" />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-primary-dark text-white px-4 py-2 text-sm font-medium disabled:opacity-50 min-h-[44px]"
          >
            {pending ? t('saving') : t('saveLesson')}
          </button>
        </form>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500">{t('noLessons')}</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((lesson) => {
            const preview = lessonListPreview(lesson)
            const recs = recCount(lesson)
            return (
              <li key={lesson.id} className="rounded-xl border bg-white p-4 hover:border-primary/30 transition">
                <Link
                  href={{ pathname: '/hub/lessons/[id]', params: { id: lesson.id } }}
                  className="block"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-medium text-slate-900">{lesson.title}</p>
                    <LessonImpactBadge impact={lesson.impact} />
                    {recs > 0 && (
                      <span className="text-xs rounded-full bg-primary/10 text-primary-darker px-2 py-0.5">
                        {t('lessonRecCount', { count: recs })}
                      </span>
                    )}
                  </div>
                  {preview && <p className="text-sm text-slate-600 line-clamp-2">{preview}</p>}
                  <p className="text-xs text-slate-500 mt-2">
                    {t(`lessonCategory_${lesson.category}` as 'lessonCategory_general')}
                    {lesson.customer_name ? ` · ${lesson.customer_name}` : ''}
                    {' · '}
                    {new Date(lesson.updated_at).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
