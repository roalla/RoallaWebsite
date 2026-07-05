'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import LessonFormFields, { EMPTY_LESSON_FORM } from '@/components/hub/LessonFormFields'
import { LessonImpactBadge } from '@/components/hub/LessonFormatView'
import {
  LESSON_CATEGORIES,
  lessonListPreview,
  lessonPayloadFromForm,
  type LessonRecord,
} from '@/lib/hub/lesson-types'

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
  const [form, setForm] = useState(EMPTY_LESSON_FORM)
  const [pending, setPending] = useState(false)

  const filtered =
    filter === 'all' ? lessons : lessons.filter((l) => l.category === filter)

  async function createLesson(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    try {
      const res = await fetch('/api/hub/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonPayloadFromForm(form)),
      })
      if (!res.ok) return
      const data = (await res.json()) as { lesson: LessonRecord }
      const customerName = customers.find((c) => c.id === form.customer_id)?.name ?? null
      setLessons((prev) => [
        { ...data.lesson, author_name: null, customer_name: customerName },
        ...prev,
      ])
      setShowForm(false)
      setForm(EMPTY_LESSON_FORM)
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('navLessons')}</h1>
          <p className="text-slate-600 text-sm">{t('navLessonsSubtitle')}</p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium"
          >
            {t('addLesson')}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            filter === 'all' ? 'bg-slate-900 text-white' : 'bg-white border'
          }`}
        >
          {t('filterAll')}
        </button>
        {LESSON_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === c ? 'bg-slate-900 text-white' : 'bg-white border'
            }`}
          >
            {t(`lessonCategory_${c}`)}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={createLesson} className="rounded-xl border bg-white p-6 mb-6 space-y-4">
          <LessonFormFields form={form} onChange={setForm} customers={customers} idPrefix="new" />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
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
            return (
              <li key={lesson.id} className="rounded-xl border bg-white p-4 hover:border-amber-300 transition">
                <Link
                  href={{ pathname: '/hub/lessons/[id]', params: { id: lesson.id } }}
                  className="block"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-medium text-slate-900">{lesson.title}</p>
                    <LessonImpactBadge impact={lesson.impact} />
                  </div>
                  {preview && (
                    <p className="text-sm text-slate-600 line-clamp-2">{preview}</p>
                  )}
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
