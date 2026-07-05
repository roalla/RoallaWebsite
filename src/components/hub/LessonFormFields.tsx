'use client'

import { useTranslations } from 'next-intl'
import RichTextEditor from '@/components/hub/RichTextEditor'
import LessonRecommendationsField from '@/components/hub/LessonRecommendationsField'
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

export default function LessonFormFields({ form, onChange, customers = [], idPrefix = 'lesson' }: Props) {
  const t = useTranslations('hub')

  function set<K extends keyof LessonFormValues>(key: K, value: LessonFormValues[K]) {
    onChange({ ...form, [key]: value })
  }

  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-500">{t('lessonFormatHint')}</p>

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

      <LessonRecommendationsField
        items={form.recommendations}
        onChange={(recommendations) => set('recommendations', recommendations)}
        idPrefix={`${idPrefix}-rec`}
      />

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
    </div>
  )
}

export { EMPTY_LESSON_FORM }
