'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { InsightBrowserArea, InsightSlug } from '@/lib/insights'

export type InsightBrowserCard = {
  slug: InsightSlug
  group: InsightBrowserArea
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

type GroupFilter = 'all' | InsightBrowserArea | 'advisory'

type Props = {
  articles: InsightBrowserCard[]
  groups: { id: InsightBrowserArea; title: string; intro: string }[]
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

function readGroup(value: string | null): GroupFilter {
  return value === 'digital' || value === 'business' || value === 'technology' || value === 'advisory' ? value : 'all'
}

function articleInArea(group: InsightBrowserArea, filter: GroupFilter) {
  if (filter === 'all') return true
  if (filter === 'advisory') return group === 'business' || group === 'technology'
  return group === filter
}

const filterBtnClass = (active: boolean) =>
  `inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    active
      ? 'bg-primary text-white shadow-sm'
      : 'border border-slate-200 bg-white text-slate-600 hover:border-primary/30'
  }`

const countClass = (active: boolean) =>
  `ml-2 rounded-full px-1.5 text-xs tabular-nums ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`

export default function InsightsBrowser({ articles, groups, otherTitle, otherIntro, otherLinks }: Props) {
  const t = useTranslations('insights')
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const topicPanelId = useId()
  const topicSearchId = useId()
  const topicRef = useRef<HTMLDivElement>(null)
  const topicSearchRef = useRef<HTMLInputElement>(null)

  const knownTopics = useMemo(() => new Set(articles.map((article) => article.category)), [articles])
  const topicFromUrl = searchParams.get('topic')
  const initialTopic = topicFromUrl && knownTopics.has(topicFromUrl) ? topicFromUrl : 'all'

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [groupFilter, setGroupFilter] = useState<GroupFilter>(readGroup(searchParams.get('area')))
  const [topic, setTopic] = useState(initialTopic)
  const [topicOpen, setTopicOpen] = useState(false)
  const [topicQuery, setTopicQuery] = useState('')

  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    const area = readGroup(searchParams.get('area'))
    const nextTopicParam = searchParams.get('topic')
    const nextTopic = nextTopicParam && knownTopics.has(nextTopicParam) ? nextTopicParam : 'all'
    setQuery((current) => (current.trim() === q ? current : q))
    setGroupFilter(area)
    setTopic(nextTopic)
  }, [knownTopics, searchParams])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams()
      const trimmed = query.trim()
      if (trimmed) params.set('q', trimmed)
      if (groupFilter !== 'all') params.set('area', groupFilter)
      if (topic !== 'all') params.set('topic', topic)
      const next = params.toString()
      if (next === searchParams.toString()) return
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
    }, 200)
    return () => window.clearTimeout(timer)
  }, [groupFilter, pathname, query, router, searchParams, topic])

  useEffect(() => {
    if (!topicOpen) return
    topicSearchRef.current?.focus()
    function onPointer(event: MouseEvent) {
      if (!topicRef.current?.contains(event.target as Node)) setTopicOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setTopicOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [topicOpen])

  const searchedArticles = useMemo(
    () => articles.filter((article) => matchesQuery(query, article.title, article.summary, article.category)),
    [articles, query],
  )

  const areaCounts = useMemo(() => {
    const digital = searchedArticles.filter((article) => article.group === 'digital').length
    const business = searchedArticles.filter((article) => article.group === 'business').length
    const technology = searchedArticles.filter((article) => article.group === 'technology').length
    return {
      all: searchedArticles.length,
      digital,
      business,
      technology,
      advisory: business + technology,
    }
  }, [searchedArticles])

  const topics = useMemo(() => {
    const inGroup = searchedArticles.filter((article) => articleInArea(article.group, groupFilter))
    const counts = new Map<string, number>()
    for (const article of inGroup) {
      counts.set(article.category, (counts.get(article.category) ?? 0) + 1)
    }
    const needle = normalize(topicQuery.trim())
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .filter((item) => !needle || normalize(item.name).includes(needle))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [groupFilter, searchedArticles, topicQuery])

  const visibleArticles = useMemo(
    () =>
      searchedArticles.filter((article) => {
        if (!articleInArea(article.group, groupFilter)) return false
        if (topic !== 'all' && article.category !== topic) return false
        return true
      }),
    [groupFilter, searchedArticles, topic],
  )

  const visibleOther = useMemo(() => {
    if (groupFilter !== 'all' || topic !== 'all') return []
    return otherLinks.filter((item) => matchesQuery(query, item.title, item.summary))
  }, [groupFilter, otherLinks, query, topic])

  const filtersActive = query.trim().length > 0 || groupFilter !== 'all' || topic !== 'all'
  const groupButtons: { id: 'all' | InsightBrowserArea; label: string }[] = [
    { id: 'all', label: t('filterAll') },
    ...groups.map((group) => ({ id: group.id, label: group.title })),
  ]
  const activeGroupLabel =
    groupFilter === 'advisory' ? t('groupAdvisory') : groups.find((group) => group.id === groupFilter)?.title

  function selectGroup(next: GroupFilter) {
    setGroupFilter(next)
    if (next === 'all') return
    const stillAvailable = articles.some(
      (article) => articleInArea(article.group, next) && article.category === topic,
    )
    if (topic !== 'all' && !stillAvailable) setTopic('all')
  }

  function chooseTopic(next: string) {
    setTopic(next)
    setTopicOpen(false)
    setTopicQuery('')
  }

  function clearFilters() {
    setQuery('')
    setGroupFilter('all')
    setTopic('all')
    setTopicOpen(false)
    setTopicQuery('')
  }

  function moveTopicOption(current: HTMLButtonElement, direction: 1 | -1) {
    const options = topicRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')
    if (!options?.length) return
    const index = Array.from(options).indexOf(current)
    const next = options[index + direction]
    if (next) next.focus()
    else if (direction < 0) topicSearchRef.current?.focus()
  }

  return (
    <div className="max-w-6xl">
      <div className="relative z-20 mb-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5 lg:sticky lg:top-20">
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
            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-10 text-slate-900 placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label={t('clearSearch')}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
          <div>
            <p id="insights-filter-label" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('filterLabel')}
            </p>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="insights-filter-label">
              {groupButtons.map((button) => {
                const active = groupFilter === button.id
                const count = areaCounts[button.id]
                return (
                  <button
                    key={button.id}
                    type="button"
                    aria-pressed={active}
                    aria-label={t('filterOption', { label: button.label, count })}
                    onClick={() => selectGroup(button.id)}
                    className={filterBtnClass(active)}
                  >
                    {button.label}
                    <span className={countClass(active)} aria-hidden>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div ref={topicRef} className="relative w-full shrink-0 lg:w-80">
            <span id="insights-topic-label" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('topicLabel')}
            </span>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={topicOpen}
              aria-controls={topicPanelId}
              onClick={() => setTopicOpen((open) => !open)}
              className="mt-2 flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm text-slate-800"
            >
              <span className="truncate">{topic === 'all' ? t('topicAll') : topic}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${topicOpen ? 'rotate-180' : ''}`} aria-hidden />
            </button>
            {topicOpen ? (
              <div className="absolute left-0 right-0 z-30 mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-card-hover">
                <label htmlFor={topicSearchId} className="sr-only">
                  {t('topicSearch')}
                </label>
                <input
                  ref={topicSearchRef}
                  id={topicSearchId}
                  type="search"
                  value={topicQuery}
                  onChange={(event) => setTopicQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown') {
                      event.preventDefault()
                      topicRef.current?.querySelector<HTMLButtonElement>('[role="option"]')?.focus()
                    }
                  }}
                  placeholder={t('topicSearch')}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
                />
                <div id={topicPanelId} role="listbox" aria-labelledby="insights-topic-label" className="mt-2 max-h-64 overflow-auto">
                  <button
                    type="button"
                    role="option"
                    aria-selected={topic === 'all'}
                    onClick={() => chooseTopic('all')}
                    onKeyDown={(event) => {
                      if (event.key === 'ArrowDown') {
                        event.preventDefault()
                        moveTopicOption(event.currentTarget, 1)
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault()
                        moveTopicOption(event.currentTarget, -1)
                      }
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                      topic === 'all' ? 'bg-primary/10 font-semibold text-primary-dark' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {t('topicAll')}
                    <span className="text-xs tabular-nums text-slate-500" aria-hidden>
                      {areaCounts[groupFilter]}
                    </span>
                  </button>
                  {topics.length === 0 ? (
                    <p className="px-3 py-4 text-sm text-slate-500">{t('topicEmpty')}</p>
                  ) : (
                    topics.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        role="option"
                        aria-selected={topic === item.name}
                        aria-label={t('filterOption', { label: item.name, count: item.count })}
                        onClick={() => chooseTopic(item.name)}
                        onKeyDown={(event) => {
                          if (event.key === 'ArrowDown') {
                            event.preventDefault()
                            moveTopicOption(event.currentTarget, 1)
                          }
                          if (event.key === 'ArrowUp') {
                            event.preventDefault()
                            moveTopicOption(event.currentTarget, -1)
                          }
                        }}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm ${
                          topic === item.name ? 'bg-primary/10 font-semibold text-primary-dark' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item.name}</span>
                        <span className="shrink-0 text-xs tabular-nums text-slate-500" aria-hidden>
                          {item.count}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {activeGroupLabel || topic !== 'all' ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {activeGroupLabel ? (
              <li>
                <button
                  type="button"
                  onClick={() => selectGroup('all')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200"
                  aria-label={t('removeFilter', { label: activeGroupLabel })}
                >
                  {activeGroupLabel}
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </li>
            ) : null}
            {topic !== 'all' ? (
              <li>
                <button
                  type="button"
                  onClick={() => chooseTopic('all')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200"
                  aria-label={t('removeFilter', { label: topic })}
                >
                  {topic}
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </li>
            ) : null}
          </ul>
        ) : null}

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
