'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export type LessonRow = {
  id: string
  title: string
  body: string
  category: string
  service_line?: string | null
  customer_name?: string | null
  author_name?: string | null
  updated_at: string
}

const CATEGORIES = ['general', 'delivery', 'client', 'internal'] as const

type Props = {
  initialLessons: LessonRow[]
  canCreate: boolean
}

export default function LessonsList({ initialLessons, canCreate }: Props) {
  const t = useTranslations('hub')
  const [lessons, setLessons] = useState(initialLessons)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [form, setForm] = useState({
    title: '',
    body: '',
    category: 'general',
    service_line: '',
  })
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
        body: JSON.stringify(form),
      })
      if (!res.ok) return
      const data = (await res.json()) as { lesson: LessonRow }
      setLessons((prev) => [{ ...data.lesson, author_name: null, customer_name: null }, ...prev])
      setShowForm(false)
      setForm({ title: '', body: '', category: 'general', service_line: '' })
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
        {CATEGORIES.map((c) => (
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
          <div>
            <label className="block text-sm font-medium mb-1">{t('lessonTitle')}</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('lessonBody')}</label>
            <textarea
              rows={4}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder={t('lessonBodyPlaceholder')}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('lessonCategory')}</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t(`lessonCategory_${c}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('serviceLine')}</label>
              <input
                value={form.service_line}
                onChange={(e) => setForm({ ...form, service_line: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>
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
          {filtered.map((lesson) => (
            <li key={lesson.id} className="rounded-xl border bg-white p-4 hover:border-amber-300 transition">
              <Link
                href={{ pathname: '/hub/lessons/[id]', params: { id: lesson.id } }}
                className="block"
              >
                <p className="font-medium text-slate-900">{lesson.title}</p>
                {lesson.body && (
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{lesson.body}</p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  {t(`lessonCategory_${lesson.category}` as 'lessonCategory_general')}
                  {lesson.customer_name ? ` · ${lesson.customer_name}` : ''}
                  {' · '}
                  {new Date(lesson.updated_at).toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
