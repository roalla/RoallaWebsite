'use client'

import { useTranslations } from 'next-intl'
import RichTextContent from '@/components/hub/RichTextContent'
import LessonRecommendationsView from '@/components/hub/LessonRecommendationsView'
import { richTextIsEmpty } from '@/lib/hub/rich-text'
import { recommendationsFromRecord } from '@/lib/hub/lesson-recommendations'
import type { LessonRecord } from '@/lib/hub/lesson-types'

type Props = {
  lesson: Partial<LessonRecord>
}

function Section({ label, value }: { label: string; value?: string | null }) {
  if (!value || richTextIsEmpty(value)) return null
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">{label}</h3>
      <RichTextContent html={value} />
    </div>
  )
}

export default function LessonFormatView({ lesson }: Props) {
  const t = useTranslations('hub')

  const recs = recommendationsFromRecord(lesson)

  const hasStructured =
    !richTextIsEmpty(lesson.context || '') ||
    !richTextIsEmpty(lesson.what_happened || '') ||
    !richTextIsEmpty(lesson.what_worked || '') ||
    !richTextIsEmpty(lesson.what_didnt_work || '') ||
    !richTextIsEmpty(lesson.root_cause || '') ||
    recs.length > 0

  if (!hasStructured && lesson.body?.trim()) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <p className="text-xs text-amber-700 mb-3">{t('lessonLegacyNote')}</p>
        <p className="text-slate-700 whitespace-pre-wrap">{lesson.body}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-white divide-y">
      <div className="p-6 space-y-5">
        <Section label={t('lessonContext')} value={lesson.context} />
        <Section label={t('lessonWhatHappened')} value={lesson.what_happened} />
        <Section label={t('lessonWhatWorked')} value={lesson.what_worked} />
        <Section label={t('lessonWhatDidntWork')} value={lesson.what_didnt_work} />
        <Section label={t('lessonRootCause')} value={lesson.root_cause} />
      </div>
      <LessonRecommendationsView lesson={lesson} />
    </div>
  )
}

export function LessonImpactBadge({ impact }: { impact?: string | null }) {
  const t = useTranslations('hub')
  const level = impact || 'medium'
  const colors =
    level === 'high'
      ? 'bg-red-100 text-red-800'
      : level === 'low'
        ? 'bg-slate-100 text-slate-700'
        : 'bg-amber-100 text-amber-900'

  return (
    <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${colors}`}>
      {t(`lessonImpact_${level}` as 'lessonImpact_medium')}
    </span>
  )
}
