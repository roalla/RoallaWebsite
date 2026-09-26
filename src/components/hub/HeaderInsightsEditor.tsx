'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import HubPageHeader from '@/components/hub/HubPageHeader'
import { HEADER_INSIGHT_COUNT } from '@/lib/header-insights'
import type { InsightGroup, InsightSlug } from '@/lib/insights'

export type HeaderInsightChoice = {
  slug: InsightSlug
  group: InsightGroup
  title: string
  summary: string
}

type Props = {
  catalog: HeaderInsightChoice[]
  initialSlugs: InsightSlug[]
  groupLabels: Record<InsightGroup, string>
  otherLabel: string
  databaseReady: boolean
}

export default function HeaderInsightsEditor({
  catalog,
  initialSlugs,
  groupLabels,
  otherLabel,
  databaseReady,
}: Props) {
  const t = useTranslations('hub')
  const [slugs, setSlugs] = useState<InsightSlug[]>(initialSlugs)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const bySlug = new Map(catalog.map((item) => [item.slug, item]))
  const selected = slugs.flatMap((slug) => {
    const item = bySlug.get(slug)
    return item ? [item] : []
  })
  const canSave = databaseReady && selected.length === HEADER_INSIGHT_COUNT && !pending

  function add(slug: InsightSlug) {
    setMessage(null)
    setError(null)
    setSlugs((current) => (current.includes(slug) || current.length >= HEADER_INSIGHT_COUNT ? current : [...current, slug]))
  }

  function remove(slug: InsightSlug) {
    setMessage(null)
    setError(null)
    setSlugs((current) => current.filter((item) => item !== slug))
  }

  function move(slug: InsightSlug, direction: -1 | 1) {
    setMessage(null)
    setError(null)
    setSlugs((current) => {
      const index = current.indexOf(slug)
      const next = index + direction
      if (index < 0 || next < 0 || next >= current.length) return current
      const copy = [...current]
      const [item] = copy.splice(index, 1)
      copy.splice(next, 0, item)
      return copy
    })
  }

  async function save() {
    if (!canSave) return
    setPending(true)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch('/api/hub/header-insights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error || t('headerInsightsError'))
        return
      }
      setMessage(t('headerInsightsSaved'))
    } catch {
      setError(t('headerInsightsError'))
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      <HubPageHeader title={t('headerInsightsTitle')} subtitle={t('headerInsightsSubtitle')} />
      <p className="mb-6 max-w-3xl text-sm leading-6 text-slate-600">{t('headerInsightsOtherNote', { other: otherLabel })}</p>
      {!databaseReady ? (
        <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {t('headerInsightsNoDatabase')}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-xl border bg-white p-4 sm:p-5" aria-labelledby="header-insights-selected">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="header-insights-selected" className="text-lg font-semibold text-slate-900">
              {t('headerInsightsSelected')}
            </h2>
            <p className="text-sm font-medium text-slate-500">
              {t('headerInsightsCount', { count: selected.length, total: HEADER_INSIGHT_COUNT })}
            </p>
          </div>
          <ol className="mt-4 space-y-3">
            {selected.map((item, index) => (
              <li key={item.slug} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary-dark">{groupLabels[item.group]}</p>
                    <p className="mt-1 font-semibold leading-6 text-slate-900">{item.title}</p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => move(item.slug, -1)}
                      disabled={index === 0}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white text-slate-700 hover:border-primary/40 disabled:opacity-40"
                      aria-label={t('headerInsightsMoveUp', { title: item.title })}
                    >
                      <ChevronUp className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(item.slug, 1)}
                      disabled={index === selected.length - 1}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white text-slate-700 hover:border-primary/40 disabled:opacity-40"
                      aria-label={t('headerInsightsMoveDown', { title: item.title })}
                    >
                      <ChevronDown className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.slug)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white text-slate-700 hover:border-red-300 hover:text-red-700"
                      aria-label={t('headerInsightsRemove', { title: item.title })}
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary-dark px-4 py-2 text-sm font-semibold text-white hover:bg-primary-darker disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? t('headerInsightsSaving') : t('headerInsightsSave')}
          </button>
          {selected.length !== HEADER_INSIGHT_COUNT ? (
            <p className="mt-3 text-sm text-slate-600">{t('headerInsightsNeedFive')}</p>
          ) : null}
          {message ? <p className="mt-3 text-sm font-medium text-emerald-800">{message}</p> : null}
          {error ? <p className="mt-3 text-sm font-medium text-red-700">{error}</p> : null}
        </section>

        <div className="space-y-6">
          {(['digital', 'advisory'] as const).map((group) => (
            <section key={group} className="rounded-xl border bg-white p-4 sm:p-5" aria-labelledby={`header-insights-${group}`}>
              <h2 id={`header-insights-${group}`} className="text-lg font-semibold text-slate-900">
                {groupLabels[group]}
              </h2>
              <ul className="mt-4 space-y-3">
                {catalog.filter((item) => item.group === group).map((item) => {
                  const already = slugs.includes(item.slug)
                  return (
                    <li key={item.slug} className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 px-3 py-3">
                      <div className="min-w-0">
                        <p className="font-semibold leading-6 text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{item.summary}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => add(item.slug)}
                        disabled={already || slugs.length >= HEADER_INSIGHT_COUNT}
                        className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-lg border bg-white px-3 text-sm font-semibold text-slate-800 hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="h-4 w-4" aria-hidden />
                        {already ? t('headerInsightsAdded') : t('headerInsightsAdd')}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
