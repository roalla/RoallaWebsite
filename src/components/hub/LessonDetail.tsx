'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import HubBreadcrumbs from '@/components/hub/HubBreadcrumbs'
import LessonFormFields from '@/components/hub/LessonFormFields'
import LessonFormatView, { LessonImpactBadge } from '@/components/hub/LessonFormatView'
import { hubFetchJson } from '@/lib/hub/toast'
import {
  lessonFromRecord,
  lessonPayloadFromForm,
  type LessonRecord,
} from '@/lib/hub/lesson-types'

type CustomerOption = { id: string; name: string }

type Props = {
  lesson: LessonRecord
  canEdit: boolean
  customers?: CustomerOption[]
}

export default function LessonDetail({ lesson: initial, canEdit, customers = [] }: Props) {
  const t = useTranslations('hub')
  const router = useRouter()
  const [lesson, setLesson] = useState(initial)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(() => lessonFromRecord(initial))
  const [pending, setPending] = useState(false)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    try {
      const result = await hubFetchJson<{ lesson: LessonRecord }>(
        `/api/hub/lessons/${lesson.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lessonPayloadFromForm(form)),
        },
        { success: t('saveLesson') },
      )
      if (result.ok) {
        const customerName = customers.find((c) => c.id === form.customer_id)?.name ?? lesson.customer_name
        setLesson({ ...lesson, ...result.data.lesson, customer_name: customerName ?? null })
        setEditing(false)
      }
    } finally {
      setPending(false)
    }
  }

  async function remove() {
    if (!confirm(t('confirmDeleteLesson'))) return
    const result = await hubFetchJson(`/api/hub/lessons/${lesson.id}`, { method: 'DELETE' })
    if (result.ok) router.push('/hub/lessons')
  }

  function startEditing() {
    setForm(lessonFromRecord(lesson))
    setEditing(true)
  }

  return (
    <div>
      <HubBreadcrumbs
        items={[
          { label: t('navLessons'), href: '/hub/lessons' },
          { label: lesson.title },
        ]}
      />

      {!editing ? (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
                <LessonImpactBadge impact={lesson.impact} />
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {t(`lessonCategory_${lesson.category}` as 'lessonCategory_general')}
                {lesson.service_line ? ` · ${lesson.service_line}` : ''}
                {lesson.customer_name ? ` · ${lesson.customer_name}` : ''}
                {lesson.author_name ? ` · ${lesson.author_name}` : ''}
                {' · '}
                {new Date(lesson.updated_at).toLocaleDateString()}
              </p>
            </div>
            {canEdit && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={startEditing}
                  className="text-sm rounded-lg border px-3 py-1.5 hover:bg-slate-50 min-h-[44px]"
                >
                  {t('edit')}
                </button>
                <button
                  type="button"
                  onClick={() => remove()}
                  className="text-sm rounded-lg border border-red-200 text-red-700 px-3 py-1.5 hover:bg-red-50 min-h-[44px]"
                >
                  {t('delete')}
                </button>
              </div>
            )}
          </div>
          <LessonFormatView lesson={lesson} />
        </>
      ) : (
        <form onSubmit={save} className="rounded-xl border bg-white p-6 space-y-4">
          <LessonFormFields form={form} onChange={setForm} customers={customers} idPrefix="edit" />
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="rounded-lg bg-primary-dark text-white px-4 py-2 text-sm min-h-[44px]">
              {pending ? t('saving') : t('saveLesson')}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="rounded-lg border px-4 py-2 text-sm min-h-[44px]">
              {t('cancel')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
