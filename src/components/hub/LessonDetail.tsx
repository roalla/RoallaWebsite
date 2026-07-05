'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'

type Lesson = {
  id: string
  title: string
  body: string
  category: string
  service_line?: string | null
  customer_name?: string | null
  author_name?: string | null
  updated_at: string
}

type Props = {
  lesson: Lesson
  canEdit: boolean
}

const CATEGORIES = ['general', 'delivery', 'client', 'internal'] as const

export default function LessonDetail({ lesson: initial, canEdit }: Props) {
  const t = useTranslations('hub')
  const router = useRouter()
  const [lesson, setLesson] = useState(initial)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    title: initial.title,
    body: initial.body,
    category: initial.category,
    service_line: initial.service_line || '',
  })
  const [pending, setPending] = useState(false)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    try {
      const res = await fetch(`/api/hub/lessons/${lesson.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data = (await res.json()) as { lesson: Lesson }
        setLesson({ ...lesson, ...data.lesson })
        setEditing(false)
      }
    } finally {
      setPending(false)
    }
  }

  async function remove() {
    if (!confirm(t('confirmDeleteLesson'))) return
    const res = await fetch(`/api/hub/lessons/${lesson.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/hub/lessons')
  }

  return (
    <div>
      <Link href="/hub/lessons" className="text-sm text-amber-700 hover:underline mb-4 inline-block">
        ← {t('backToLessons')}
      </Link>

      {!editing ? (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
              <p className="text-sm text-slate-500 mt-1">
                {t(`lessonCategory_${lesson.category}` as 'lessonCategory_general')}
                {lesson.customer_name ? ` · ${lesson.customer_name}` : ''}
                {lesson.author_name ? ` · ${lesson.author_name}` : ''}
              </p>
            </div>
            {canEdit && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="text-sm rounded-lg border px-3 py-1.5 hover:bg-slate-50"
                >
                  {t('edit')}
                </button>
                <button
                  type="button"
                  onClick={() => remove()}
                  className="text-sm rounded-lg border border-red-200 text-red-700 px-3 py-1.5 hover:bg-red-50"
                >
                  {t('delete')}
                </button>
              </div>
            )}
          </div>
          <div className="rounded-xl border bg-white p-6">
            <p className="text-slate-700 whitespace-pre-wrap">{lesson.body || t('noLessonBody')}</p>
          </div>
        </>
      ) : (
        <form onSubmit={save} className="rounded-xl border bg-white p-6 space-y-4">
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-lg font-semibold"
          />
          <textarea
            rows={8}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`lessonCategory_${c}`)}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm">
              {pending ? t('saving') : t('saveLesson')}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="rounded-lg border px-4 py-2 text-sm">
              {t('cancel')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
