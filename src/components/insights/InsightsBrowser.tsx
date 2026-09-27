'use client'

import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { InsightGroup, InsightSlug } from '@/lib/insights'

export type InsightBrowserCard = {
  slug: InsightSlug
  group: InsightGroup
  title: string
  summary: string
  readTime: string
  category: string
}

export type InsightOtherLink = {
  href: '/use-cases' | '/faq' | '/assessment'
  title: string
  summary: string
}

type GroupFilter = 'all' | InsightGroup

type Props = {
  articles: InsightBrowserCard[]
  groups: { id: InsightGroup; title: string; intro: string }[]
  otherTitle: string
  otherIntro: string
  otherLinks: InsightOtherLink[]
}

function normalize(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function matchesQuery(query: string, ...fields: string[]) {
  const needle = normalize(query.trim())
  if (!needle) return true
  return normalize(fields.join(' ')).includes(needle)
}

const filterBtnClass = (active: boolean) =>
  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    active
      ? 'bg-primary text-white shadow-sm'
      : 'border border-slate-200 bg-white text-slate-600 hover:border-primary/30'
  }`

export default function InsightsBrowser({ articles, groups, otherTitle, otherIntro, otherLinks }: Props) {
  const t = useTranslations('insights')
  const [query, setQuery] = useState('')
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('all')
  const [topic, setTopic] = useState('all')

  const topics = useMemo(() => {
    const inGroup = groupFilter === 'all' ? articles : articles.filter((article) => article.group === groupFilter)
    return [...new Set(inGroup.map((article) => article.category))].sort((a, b) => a.localeCompare(b))
  }, [articles, groupFilter])

  const visibleArticles = useMemo(
    () =>
      articles.filter((article) => {
        if (groupFilter !== 'all' && article.group !== groupFilter) return false
        if (topic !== 'all' && article.category !== topic) return false
        return matchesQuery(query, article.title, article.summary, article.category)
      }),
    [articles, groupFilter, query, topic],
  )

  const visibleOther = useMemo(() => {
    if (groupFilter !== 'all' || topic !== 'all') return []
    return otherLinks.filter((item) => matchesQuery(query, item.title, item.summary))
  }, [groupFilter, otherLinks, query, topic])

  const filtersActive = query.trim().length > 0 || groupFilter !== 'all' || topic !== 'all'
  const groupButtons: { id: GroupFilter; label: string }[] = [
    { id: 'all', label: t('filterAll') },
    ...groups.map((group) => ({ id: group.id, label: group.title })),
  ]

  function selectGroup(next: GroupFilter) {
    setGroupFilter(next)
    if (next === 'all') return
    const stillAvailable = articles.some((article) => article.group === next && article.category === topic)
    if (topic !== 'all' && !stillAvailable) setTopic('all')
  }

  function clearFilters() {
    setQuery('')
    setGroupFilter('all')
    setTopic('all')
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
        <label htmlFor="insights-search" className="block text-sm font-semibold text-slate-800">
          {t('searchLabel')}
        </label>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            id="insights-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p id="insights-filter-label" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('filterLabel')}
            </p>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="insights-filter-label">
              {groupButtons.map((button) => (
                <button
                  key={button.id}
                  type="button"
                  aria-pressed={groupFilter === button.id}
                  onClick={() => selectGroup(button.id)}
                  className={filterBtnClass(groupFilter === button.id)}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
          <label className="block min-w-[14rem]">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('topicLabel')}</span>
            <select
              value={topics.includes(topic) ? topic : 'all'}
              onChange={(event) => setTopic(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800"
            >
              <option value="all">{t('topicAll')}</option>
              {topics.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-600" aria-live="polite">
            {t('resultsCount', { count: visibleArticles.length })}
          </p>
          {filtersActive ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-dark hover:underline"
            >
              <X className="h-4 w-4" aria-hidden />
              {t('clearFilters')}
            </button>
          ) : null}
        </div>
      </div>

      {visibleArticles.length === 0 && visibleOther.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <p className="text-lg font-semibold text-slate-900">{t('noResults')}</p>
          <p className="mt-2 text-slate-600">{t('noResultsHint')}</p>
        </div>
      ) : (
        <div className="space-y-14">
          {groups.map((group) => {
            const cards = visibleArticles.filter((article) => article.group === group.id)
            if (cards.length === 0) return null
            return (
              <section key={group.id} aria-labelledby={`insights-${group.id}`}>
                <h2 id={`insights-${group.id}`} className="text-2xl font-serif font-bold text-slate-900">
                  {group.title}
                </h2>
                <p className="mt-2 max-w-2xl text-slate-600">{group.intro}</p>
                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {cards.map((article) => (
                    <Link
                      key={article.slug}
                      href={{ pathname: '/insights/[slug]', params: { slug: article.slug } }}
                      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all hover:border-primary/30 hover:shadow-card-hover"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">{article.category}</p>
                      <h3 className="mt-3 text-xl font-semibold text-slate-900 transition-colors group-hover:text-primary-dark">
                        {article.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">{article.summary}</p>
                      <p className="mt-4 text-xs font-medium text-slate-500">{article.readTime}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}

          {visibleOther.length > 0 ? (
            <section aria-labelledby="insights-other">
              <h2 id="insights-other" className="text-2xl font-serif font-bold text-slate-900">
                {otherTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-slate-600">{otherIntro}</p>
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleOther.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all hover:border-primary/30 hover:shadow-card-hover"
                  >
                    <h3 className="text-xl font-semibold text-slate-900 transition-colors group-hover:text-primary-dark">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  )
}
