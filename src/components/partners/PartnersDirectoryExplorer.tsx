'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Search } from 'lucide-react'
import Reveal from '@/components/motion/Reveal'
import { Link } from '@/i18n/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import type { PartnersDirectoryItem } from '@/lib/partners-directory'
import type {
  EcosystemAccessType,
  EcosystemAudienceTag,
  EcosystemCompensationCategory,
  EcosystemGeography,
  EcosystemPortfolioTag,
} from '@/lib/ecosystem-governance'
import {
  PARTNERS_HASH_EVENT,
  partnersBriefHref,
  portfolioAccentClass,
  portfolioTileClass,
  primaryPortfolio,
} from '@/lib/partners-portfolio-ui'

type Props = {
  headingId: string
  heading: string
  showHeading: boolean
  businessNeedLabel: string
  fitLabel: string
  portfolioLabel: string
  reviewedLabel: string
  organizationsNote: string
  filterAllLabel: string
  emptyLabel: string
  curatorLabel: string
  searchLabel: string
  searchPlaceholder: string
  audienceAllLabel: string
  exclusivityLabel: string
  compareCtaLabel: string
  filterBriefLabel: string
  filterBriefCta: string
  progressLabel: string
  accessLabels: Record<EcosystemAccessType, string>
  geoLabels: Record<EcosystemGeography, string>
  compLabels: Record<EcosystemCompensationCategory, string>
  audienceLabels: Record<EcosystemAudienceTag, string>
  items: PartnersDirectoryItem[]
}

export default function PartnersDirectoryExplorer({
  headingId,
  heading,
  showHeading,
  businessNeedLabel,
  fitLabel,
  portfolioLabel,
  reviewedLabel,
  organizationsNote,
  filterAllLabel,
  emptyLabel,
  curatorLabel,
  searchLabel,
  searchPlaceholder,
  audienceAllLabel,
  exclusivityLabel,
  compareCtaLabel,
  filterBriefLabel,
  filterBriefCta,
  progressLabel,
  accessLabels,
  geoLabels,
  compLabels,
  audienceLabels,
  items,
}: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [audience, setAudience] = useState<EcosystemAudienceTag | null>(null)
  const [query, setQuery] = useState('')
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progressVisible, setProgressVisible] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)
  const highlightTimer = useRef<number | null>(null)

  const tags = useMemo(() => {
    const seen = new Set<string>()
    const ordered: string[] = []
    for (const item of items) {
      for (const tag of item.filterTags) {
        const normalized = tag.toLowerCase()
        if (seen.has(normalized)) continue
        seen.add(normalized)
        ordered.push(tag)
      }
    }
    return ordered.slice(0, 8)
  }, [items])

  const audiences = useMemo(() => {
    const seen = new Set<EcosystemAudienceTag>()
    for (const item of items) {
      for (const tag of item.audience) seen.add(tag)
    }
    return Array.from(seen)
  }, [items])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      const tagOk =
        !activeTag ||
        item.filterTags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase()) ||
        item.need.toLowerCase().includes(activeTag.toLowerCase())
      if (!tagOk) return false
      if (audience && !item.audience.includes(audience)) return false
      if (!q) return true
      return (
        item.name.toLowerCase().includes(q) ||
        item.relationship.toLowerCase().includes(q) ||
        item.need.toLowerCase().includes(q) ||
        item.fit.toLowerCase().includes(q) ||
        item.portfolioLabels.some((label) => label.toLowerCase().includes(q))
      )
    })
  }, [activeTag, audience, items, query])

  const highlightVendor = (key: string) => {
    setHighlightedKey(key)
    if (highlightTimer.current) window.clearTimeout(highlightTimer.current)
    highlightTimer.current = window.setTimeout(() => setHighlightedKey(null), 1600)
  }

  useEffect(() => {
    const applyHash = (raw?: string) => {
      const key = (raw ?? window.location.hash).replace(/^#/, '')
      if (!key) return
      if (!items.some((item) => item.key === key)) return
      highlightVendor(key)
      const el = document.getElementById(key)
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    applyHash()
    const onHash = () => applyHash()
    const onCustom = (event: Event) => {
      const detail = (event as CustomEvent<{ key?: string }>).detail
      if (detail?.key) highlightVendor(detail.key)
    }
    window.addEventListener('hashchange', onHash)
    window.addEventListener(PARTNERS_HASH_EVENT, onCustom as EventListener)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener(PARTNERS_HASH_EVENT, onCustom as EventListener)
      if (highlightTimer.current) window.clearTimeout(highlightTimer.current)
    }
  }, [items])

  useEffect(() => {
    const root = listRef.current
    if (!root || visible.length === 0) {
      setProgressVisible(false)
      return
    }

    const nodes = visible
      .map((item) => document.getElementById(item.key))
      .filter((node): node is HTMLElement => Boolean(node))

    if (nodes.length === 0) return

    const ratios = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio)
        }
        let bestKey = visible[0]?.key
        let bestRatio = -1
        for (const item of visible) {
          const ratio = ratios.get(item.key) ?? 0
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestKey = item.key
          }
        }
        const index = visible.findIndex((item) => item.key === bestKey)
        if (index >= 0) setActiveIndex(index)
        setProgressVisible(bestRatio > 0.05)
      },
      { root: null, threshold: [0, 0.15, 0.35, 0.55, 0.75, 1], rootMargin: '-20% 0px -45% 0px' },
    )

    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [visible])

  const filterActive = Boolean(activeTag || audience || query.trim())
  const filterBrief = partnersBriefHref({
    need: activeTag,
    audience,
    portfolio: visible[0] ? primaryPortfolio(visible[0].portfolio) : null,
  })

  return (
    <section aria-labelledby={headingId} className="relative">
      {showHeading ? (
        <h2 id={headingId} className="font-serif text-2xl font-bold text-slate-950 sm:text-3xl">
          {heading}
        </h2>
      ) : (
        <h2 id={headingId} className="sr-only">
          {heading}
        </h2>
      )}

      {progressVisible && visible.length > 0 ? (
        <div className="sticky top-16 z-20 mb-4 -mx-1 border border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85 sm:top-20">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-700">
            <span>
              {progressLabel
                .replace('{current}', String(activeIndex + 1))
                .replace('{total}', String(visible.length))}
            </span>
            <span className="font-serif text-sm text-slate-950">{visible[activeIndex]?.name}</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200" aria-hidden>
            <div
              className="h-full rounded-full bg-primary-dark transition-[width] duration-300 ease-out"
              style={{ width: `${((activeIndex + 1) / visible.length) * 100}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">{searchLabel}</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              const next = event.target.value
              setQuery(next)
              if (next.trim().length === 1 || next.trim().length === 0) {
                trackAnalyticsEvent('partners_directory_search', { has_query: next.trim().length > 0 })
              }
            }}
            placeholder={searchPlaceholder}
            className="min-h-11 w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>

      {audiences.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={audienceAllLabel}>
          <button
            type="button"
            onClick={() => {
              setAudience(null)
              trackAnalyticsEvent('partners_directory_filter', { audience: 'all' })
            }}
            className={
              audience === null
                ? 'rounded-full bg-slate-900 px-3.5 py-1.5 text-sm font-semibold text-white'
                : 'rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300'
            }
            aria-pressed={audience === null}
          >
            {audienceAllLabel}
          </button>
          {audiences.map((tag) => {
            const selected = audience === tag
            return (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  const next = selected ? null : tag
                  setAudience(next)
                  trackAnalyticsEvent('partners_directory_filter', { audience: next ?? 'all' })
                }}
                className={
                  selected
                    ? 'rounded-full bg-slate-900 px-3.5 py-1.5 text-sm font-semibold text-white'
                    : 'rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300'
                }
                aria-pressed={selected}
              >
                {audienceLabels[tag]}
              </button>
            )
          })}
        </div>
      ) : null}

      {tags.length > 1 ? (
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={filterAllLabel}>
          <button
            type="button"
            onClick={() => {
              setActiveTag(null)
              trackAnalyticsEvent('partners_directory_filter', { tag: 'all' })
            }}
            className={
              activeTag === null
                ? 'rounded-full bg-slate-900 px-3.5 py-1.5 text-sm font-semibold text-white'
                : 'rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300'
            }
            aria-pressed={activeTag === null}
          >
            {filterAllLabel}
          </button>
          {tags.map((tag) => {
            const selected = activeTag?.toLowerCase() === tag.toLowerCase()
            return (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  const next = selected ? null : tag
                  setActiveTag(next)
                  trackAnalyticsEvent('partners_directory_filter', { tag: next ?? 'all' })
                }}
                className={
                  selected
                    ? 'rounded-full bg-slate-900 px-3.5 py-1.5 text-sm font-semibold text-white'
                    : 'rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300'
                }
                aria-pressed={selected}
              >
                {tag}
              </button>
            )
          })}
        </div>
      ) : null}

      {filterActive ? (
        <div className="mt-5 flex flex-col gap-3 border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-700">{filterBriefLabel}</p>
          <Link
            href={filterBrief}
            onClick={() =>
              trackAnalyticsEvent('partners_directory_brief', {
                tag: activeTag ?? 'none',
                audience: audience ?? 'none',
              })
            }
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {filterBriefCta}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </div>
      ) : null}

      <ul ref={listRef} className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
        {visible.length === 0 ? (
          <li className="py-10 text-sm text-slate-600">{emptyLabel}</li>
        ) : (
          visible.map((item, index) => {
            const primary = primaryPortfolio(item.portfolio)
            const accent = primary ? portfolioAccentClass[primary] : 'border-l-slate-300'
            const tile = primary ? portfolioTileClass[primary] : 'bg-white ring-slate-200'
            const isHighlighted = highlightedKey === item.key
            return (
              <Reveal as="li" key={item.key} delayMs={Math.min(index * 60, 240)} className="scroll-mt-28">
                <div
                  id={item.key}
                  className={[
                    'group grid gap-5 border-l-4 py-7 pl-4 transition hover:-translate-y-0.5 hover:bg-slate-50/80 sm:grid-cols-[11rem_1fr] sm:items-start sm:gap-8 sm:pl-5 lg:py-8',
                    accent,
                    isHighlighted ? 'partners-vendor-highlight' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div
                    className={[
                      'flex h-16 w-full max-w-[11rem] items-center justify-center rounded-xl px-3 ring-1 transition group-hover:ring-primary/35',
                      tile,
                    ].join(' ')}
                  >
                    {item.logo ? (
                      <Image
                        src={item.logo.src}
                        alt=""
                        width={item.logo.width}
                        height={item.logo.height}
                        className={item.logo.className}
                        unoptimized
                      />
                    ) : (
                      <span className="text-base font-extrabold tracking-tight text-slate-900">{item.wordmark}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-slate-500">
                        <Image src="/logo.svg" alt="" width={14} height={14} className="h-3.5 w-3.5 opacity-80" />
                        {curatorLabel}
                      </span>
                      <span className="text-slate-300" aria-hidden>
                        ·
                      </span>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">{item.relationship}</p>
                    </div>
                    <h3 className="mt-1.5 font-serif text-xl font-bold text-slate-950">{item.name}</h3>
                    {item.portfolioLabels.length > 0 ? (
                      <ul
                        className="mt-2.5 flex list-none flex-wrap gap-1.5 p-0"
                        aria-label={portfolioLabel}
                      >
                        {item.portfolioLabels.map((label, pillIndex) => (
                          <li
                            key={label}
                            className="partners-pill-enter"
                            style={{ animationDelay: `${pillIndex * 45}ms` }}
                          >
                            <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                              {label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      <span className="font-semibold text-slate-700">{businessNeedLabel}:</span> {item.need}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      <span className="font-semibold text-slate-900">{fitLabel}:</span> {item.fit}
                    </p>
                    <dl className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                      <div>
                        <dt className="font-semibold text-slate-800">{accessLabels[item.accessType]}</dt>
                        <dd>
                          {geoLabels[item.geography]} · {exclusivityLabel}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-800">{compLabels[item.compensation]}</dt>
                        <dd>
                          {reviewedLabel}: {item.reviewedLabel}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                      {item.externalCta ? (
                        <a
                          href={item.externalCta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            trackAnalyticsEvent('partners_directory_external', { partner: item.key })
                          }
                          className="inline-flex min-h-11 items-center text-sm font-semibold text-primary-dark hover:underline"
                        >
                          {item.externalCta.label}
                          <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                        </a>
                      ) : null}
                      <Link
                        href={partnersBriefHref({
                          portfolio: primary as EcosystemPortfolioTag | null,
                        })}
                        onClick={() =>
                          trackAnalyticsEvent('partners_directory_compare', {
                            partner: item.key,
                            portfolio: primary ?? 'none',
                          })
                        }
                        className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-800 underline-offset-4 hover:underline"
                      >
                        {compareCtaLabel}
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })
        )}
      </ul>
      <p className="mt-8 text-sm leading-6 text-slate-500">{organizationsNote}</p>
    </section>
  )
}
