'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown, CheckCircle2, Circle } from 'lucide-react'
import RichTextEditor from '@/components/hub/RichTextEditor'
import LessonRecommendationsField from '@/components/hub/LessonRecommendationsField'
import { richTextIsEmpty } from '@/lib/hub/rich-text'
import {
  EMPTY_LESSON_FORM,
  LESSON_CATEGORIES,
  LESSON_IMPACTS,
  type LessonFormValues,
} from '@/lib/hub/lesson-types'

type CustomerOption = { id: string; name: string }

type Props = {
  form: LessonFormValues
  onChange: (form: LessonFormValues) => void
  customers?: CustomerOption[]
  idPrefix?: string
}

type SectionId = 'summary' | 'story' | 'recommendations' | 'meta'

function sectionDone(form: LessonFormValues, id: SectionId): boolean {
  switch (id) {
    case 'summary':
      return Boolean(form.title.trim()) && !richTextIsEmpty(form.context)
    case 'story':
      return !richTextIsEmpty(form.what_happened) || !richTextIsEmpty(form.what_didnt_work)
    case 'recommendations':
      return form.recommendations.some((r) => !richTextIsEmpty(r.body))
    case 'meta':
      return true
    default:
      return false
  }
}

export default function LessonFormFields({ form, onChange, customers = [], idPrefix = 'lesson' }: Props) {
  const t = useTranslations('hub')
  const [openSections, setOpenSections] = useState<Set<SectionId>>(
    () => new Set<SectionId>(['summary', 'story', 'recommendations', 'meta']),
  )

  function set<K extends keyof LessonFormValues>(key: K, value: LessonFormValues[K]) {
    onChange({ ...form, [key]: value })
  }

  function toggleSection(id: SectionId) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function Section({
    id,
    title,
    children,
  }: {
    id: SectionId
    title: string
    children: React.ReactNode
  }) {
    const open = openSections.has(id)
    const done = sectionDone(form, id)
    return (
      <div className="rounded-xl border bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection(id)}
          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 min-h-[44px]"
        >
          {done ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <Circle className="h-4 w-4 text-slate-300 shrink-0" />
          )}
          <span className="flex-1 font-medium text-sm text-slate-900">{title}</span>
          <ChevronDown className={`h-4 w-4 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && <div className="px-4 pb-4 pt-0 space-y-4 border-t">{children}</div>}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">{t('lessonFormatHint')}</p>

      <Section id="summary" title={t('lessonSectionSummary')}>
        <div>
          <label htmlFor={`${idPrefix}-title`} className="block text-sm font-medium mb-1">
            {t('lessonTitle')} *
          </label>
          <input
            id={`${idPrefix}-title`}
            required
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder={t('lessonTitlePlaceholder')}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-context`} className="block text-sm font-medium mb-1">
            {t('lessonContext')}
          </label>
          <RichTextEditor
            id={`${idPrefix}-context`}
            value={form.context}
            onChange={(html) => set('context', html)}
            placeholder={t('lessonContextPlaceholder')}
            minHeight="4rem"
          />
        </div>
      </Section>

      <Section id="story" title={t('lessonSectionStory')}>
        <div>
          <label htmlFor={`${idPrefix}-what-happened`} className="block text-sm font-medium mb-1">
            {t('lessonWhatHappened')} *
          </label>
          <RichTextEditor
            id={`${idPrefix}-what-happened`}
            value={form.what_happened}
            onChange={(html) => set('what_happened', html)}
            placeholder={t('lessonWhatHappenedPlaceholder')}
            required
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${idPrefix}-what-worked`} className="block text-sm font-medium mb-1">
              {t('lessonWhatWorked')}
            </label>
            <RichTextEditor
              id={`${idPrefix}-what-worked`}
              value={form.what_worked}
              onChange={(html) => set('what_worked', html)}
              placeholder={t('lessonWhatWorkedPlaceholder')}
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-what-didnt-work`} className="block text-sm font-medium mb-1">
              {t('lessonWhatDidntWork')}
            </label>
            <RichTextEditor
              id={`${idPrefix}-what-didnt-work`}
              value={form.what_didnt_work}
              onChange={(html) => set('what_didnt_work', html)}
              placeholder={t('lessonWhatDidntWorkPlaceholder')}
            />
          </div>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-root-cause`} className="block text-sm font-medium mb-1">
            {t('lessonRootCause')}
          </label>
          <RichTextEditor
            id={`${idPrefix}-root-cause`}
            value={form.root_cause}
            onChange={(html) => set('root_cause', html)}
            placeholder={t('lessonRootCausePlaceholder')}
            minHeight="4rem"
          />
        </div>
      </Section>

      <Section id="recommendations" title={t('lessonSectionRecommendations')}>
        <LessonRecommendationsField
          items={form.recommendations}
          onChange={(recommendations) => set('recommendations', recommendations)}
          idPrefix={`${idPrefix}-rec`}
        />
      </Section>

      <Section id="meta" title={t('lessonSectionMeta')}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor={`${idPrefix}-impact`} className="block text-sm font-medium mb-1">
              {t('lessonImpact')}
            </label>
            <select
              id={`${idPrefix}-impact`}
              value={form.impact}
              onChange={(e) => set('impact', e.target.value as LessonFormValues['impact'])}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              {LESSON_IMPACTS.map((level) => (
                <option key={level} value={level}>
                  {t(`lessonImpact_${level}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${idPrefix}-category`} className="block text-sm font-medium mb-1">
              {t('lessonCategory')}
            </label>
            <select
              id={`${idPrefix}-category`}
              value={form.category}
              onChange={(e) => set('category', e.target.value as LessonFormValues['category'])}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              {LESSON_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t(`lessonCategory_${c}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${idPrefix}-service-line`} className="block text-sm font-medium mb-1">
              {t('serviceLine')}
            </label>
            <input
              id={`${idPrefix}-service-line`}
              value={form.service_line}
              onChange={(e) => set('service_line', e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          {customers.length > 0 && (
            <div>
              <label htmlFor={`${idPrefix}-customer`} className="block text-sm font-medium mb-1">
                {t('lessonLinkedCustomer')}
              </label>
              <select
                id={`${idPrefix}-customer`}
                value={form.customer_id}
                onChange={(e) => set('customer_id', e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="">{t('lessonNoCustomer')}</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Section>
    </div>
  )
}

export { EMPTY_LESSON_FORM }
