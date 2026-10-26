'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Search } from 'lucide-react'
import Reveal from '@/components/motion/Reveal'
import { trackAnalyticsEvent } from '@/lib/analytics'
import type { PartnersDirectoryItem } from '@/lib/partners-directory'
import type {
  EcosystemAccessType,
  EcosystemAudienceTag,
  EcosystemCompensationCategory,
  EcosystemGeography,
} from '@/lib/ecosystem-governance'

type Props = {
  headingId: string
  heading: string
  showHeading: boolean
  businessNeedLabel: string
  fitLabel: string
  reviewedLabel: string
  organizationsNote: string
  filterAllLabel: string
  emptyLabel: string
  curatorLabel: string
  searchLabel: string
  searchPlaceholder: string
  audienceAllLabel: string
  exclusivityLabel: string
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
  reviewedLabel,
  organizationsNote,
  filterAllLabel,
  emptyLabel,
  curatorLabel,
  searchLabel,
  searchPlaceholder,
  audienceAllLabel,
  exclusivityLabel,
  accessLabels,
  geoLabels,
  compLabels,
  audienceLabels,
  items,
}: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [audience, setAudience] = useState<EcosystemAudienceTag | null>(null)
  const [query, setQuery] = useState('')

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
        item.fit.toLowerCase().includes(q)
      )
    })
  }, [activeTag, audience, items, query])

  return (
    <section aria-labelledby={headingId}>
      {showHeading ? (
        <h2 id={headingId} className="font-serif text-2xl font-bold text-slate-950 sm:text-3xl">
          {heading}
        </h2>
      ) : (
        <h2 id={headingId} className="sr-only">
          {heading}
        </h2>
      )}

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

      <ul className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
        {visible.length === 0 ? (
          <li className="py-10 text-sm text-slate-600">{emptyLabel}</li>
        ) : (
          visible.map((item, index) => (
            <Reveal as="li" key={item.key} delayMs={Math.min(index * 60, 240)} className="scroll-mt-28">
              <div
                id={item.key}
                className="group grid gap-5 py-7 transition hover:-translate-y-0.5 hover:bg-slate-50/80 sm:grid-cols-[11rem_1fr] sm:items-start sm:gap-8 lg:py-8"
              >
                <div className="flex h-16 w-full max-w-[11rem] items-center justify-center rounded-xl bg-white px-3 ring-1 ring-slate-200 transition group-hover:ring-primary/35">
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
                  {item.externalCta ? (
                    <a
                      href={item.externalCta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackAnalyticsEvent('partners_directory_external', { partner: item.key })
                      }
                      className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary-dark hover:underline"
                    >
                      {item.externalCta.label}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </a>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))
        )}
      </ul>
      <p className="mt-8 text-sm leading-6 text-slate-500">{organizationsNote}</p>
    </section>
  )
}
