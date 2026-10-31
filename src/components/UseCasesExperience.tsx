'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Table2,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import Collapse from './motion/Collapse'
import Reveal from './motion/Reveal'
import { OUTCOME_GROUP_IDS } from '@/lib/solution-outcome-pages'
import {
  ALL_FACET,
  DEFAULT_USE_CASE_FACETS,
  INDUSTRY_FACET_LABELS,
  OUTCOME_GROUP_FACET_LABELS,
  TECHNOLOGY_FACET_LABELS,
  USED_USE_CASE_INDUSTRIES,
  USED_USE_CASE_TECHNOLOGIES,
  USE_CASE_TOOLS,
  facetLocale,
  facetOptionCounts,
  filterUseCases,
  hasActiveUseCaseFacets,
  parseUseCaseFacets,
  serializeUseCaseFacets,
  useCaseMatchesFacets,
  type FacetKey,
  type UseCaseFacetState,
} from '@/lib/use-case-facets'
import {
  USE_CASES,
  USE_CASE_SERVICE_HREFS,
  isUseCaseId,
  scheduleQueryForUseCase,
  type UseCaseId,
  type UseCaseServiceKey,
} from '@/lib/use-cases'
import type { CaseStudySlug } from '@/lib/portfolio-case-studies'

type UseCaseItem = (typeof USE_CASES)[number]

const MID_BAND_AFTER = 6
const MAX_CARD_INDUSTRY_PILLS = 2
const MAX_CARD_TECH_PILLS = 2

/** Hover lift shared with the estimator builders. */
const liftMotion =
  'transition-all duration-200 ease-out motion-reduce:transition-none motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.02] motion-safe:hover:shadow-md motion-safe:hover:shadow-primary/20'

type FacetOption = { value: string; label: string; count: number }

function FacetRow({
  label,
  allLabel,
  options,
  active,
  onSelect,
}: {
  label: string
  allLabel: string
  options: readonly FacetOption[]
  active: string
  onSelect: (value: string) => void
}) {
  const pill = (value: string, text: string, count: number) => {
    const selected = active === value
    const empty = count === 0 && !selected
    return (
      <button
        key={value}
        type="button"
        aria-pressed={selected}
        disabled={empty}
        onClick={() => onSelect(value)}
        className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${liftMotion} ${
          selected
            ? 'border-primary bg-primary text-white shadow-md'
            : 'border-slate-200 bg-white text-slate-700 hover:border-primary/40 hover:text-primary-dark'
        } ${empty ? 'cursor-not-allowed opacity-40 motion-safe:hover:translate-y-0 motion-safe:hover:scale-100 motion-safe:hover:shadow-none' : ''}`}
      >
        {text}
        <span className={`text-xs font-medium tabular-nums ${selected ? 'text-cyan-100' : 'text-slate-500'}`}>{count}</span>
      </button>
    )
  }

  const allCount = options.reduce((max, option) => Math.max(max, option.count), 0)

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <div className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-2 pt-1 md:flex-wrap md:overflow-visible" role="group" aria-label={label}>
        {pill(ALL_FACET, allLabel, allCount)}
        {options.map((option) => pill(option.value, option.label, option.count))}
      </div>
    </div>
  )
}

function PortfolioExamples({ slugs }: { slugs: readonly CaseStudySlug[] }) {
  const t = useTranslations('useCases')
  if (slugs.length === 0) return null

  return (
    <div className="border-t border-slate-200 pt-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{t('portfolioExamples')}</p>
      <ul className="flex flex-wrap gap-2">
        {slugs.map((slug) => (
          <li key={slug}>
            <Link
              href={{ pathname: '/services/portfolio/[slug]', params: { slug } }}
              className="inline-flex min-h-10 items-center gap-1 rounded-md border border-primary/25 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary-dark transition-colors hover:border-primary/40 hover:bg-primary/10"
            >
              {t(`portfolio.${slug}`)}
              <ArrowUpRight className="h-3 w-3" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function UseCaseActions({ item }: { item: UseCaseItem }) {
  const t = useTranslations('useCases')
  const query = scheduleQueryForUseCase(item.id)
  const tool = (USE_CASE_TOOLS as Partial<Record<UseCaseId, { href: string; labelKey: string }>>)[item.id]

  return (
    <div className="flex flex-col items-stretch gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:flex-wrap sm:items-center">
      <Link
        href={{ pathname: '/contact', query }}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        {t('discussCta')}<ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <Link
        href={{ pathname: '/solutions/need/[groupId]', params: { groupId: item.outcomeGroup } }}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-primary/50 hover:text-primary-dark"
      >
        {t('outcomePathwayCta')}<ArrowUpRight className="h-4 w-4" aria-hidden />
      </Link>
      {tool ? (
        <Link
          href={tool.href as '/tools/technology-decision-brief'}
          className="inline-flex min-h-11 items-center gap-1 px-1 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          {t(tool.labelKey as 'commsValueBriefCta')}<ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : (
        <Link href={USE_CASE_SERVICE_HREFS[item.service as UseCaseServiceKey]} className="inline-flex min-h-11 items-center gap-1 px-1 text-sm font-semibold text-slate-700 transition-colors hover:text-primary-dark">
          {t(`services.${item.service}`)}<ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  )
}

function MicroPill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'primary' | 'neutral' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        tone === 'primary' ? 'bg-primary/10 text-primary-dark' : 'border border-slate-200 bg-slate-50 text-slate-600'
      }`}
    >
      {children}
    </span>
  )
}

function UseCaseCard({ item, expanded, onToggle, delayMs }: {
  item: UseCaseItem
  expanded: boolean
  onToggle: () => void
  delayMs: number
}) {
  const t = useTranslations('useCases')
  const locale = facetLocale(useLocale())
  const detailsId = `${item.id}-details`
  const industries = item.industries as readonly (keyof (typeof INDUSTRY_FACET_LABELS)['en'])[]
  const technologies = item.technologies as readonly (keyof (typeof TECHNOLOGY_FACET_LABELS)['en'])[]
  const extraIndustries = Math.max(0, industries.length - MAX_CARD_INDUSTRY_PILLS)

  return (
    <Reveal
      as="article"
      delayMs={delayMs}
      id={item.id}
      className="scroll-mt-32 self-start rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 motion-safe:hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={detailsId}
        className="w-full rounded-2xl p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <span className="block text-lg font-bold leading-snug text-slate-950">{t(`cases.${item.id}.title`)}</span>
        <span className="mt-2 line-clamp-2 block text-sm leading-relaxed text-slate-600">{t(`cases.${item.id}.outcome`)}</span>
        <span className="mt-3 flex flex-wrap gap-1.5">
          <MicroPill tone="primary">{OUTCOME_GROUP_FACET_LABELS[locale][item.outcomeGroup]}</MicroPill>
          {industries.slice(0, MAX_CARD_INDUSTRY_PILLS).map((industry) => (
            <MicroPill key={industry}>{INDUSTRY_FACET_LABELS[locale][industry]}</MicroPill>
          ))}
          {extraIndustries > 0 ? <MicroPill>{`+${extraIndustries}`}</MicroPill> : null}
          {technologies.slice(0, MAX_CARD_TECH_PILLS).map((tech) => (
            <MicroPill key={tech}>{TECHNOLOGY_FACET_LABELS[locale][tech]}</MicroPill>
          ))}
        </span>
        <span className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-semibold text-primary-dark">
          {expanded ? t('hideApproach') : t('seeApproach')}
          <ChevronDown className={`h-5 w-5 transition-transform duration-300 motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`} aria-hidden />
        </span>
      </button>

      <Collapse open={expanded}>
        {expanded ? <div id={detailsId} role="region" aria-label={t('detailsLabel')} className="px-5 pb-6">
          <dl className="grid gap-5 border-t border-slate-200 pt-5 text-sm leading-relaxed sm:grid-cols-2">
            <div><dt className="font-semibold text-slate-950">{t('recognizeLabel')}</dt><dd className="mt-1 text-slate-600">{t(`cases.${item.id}.need`)}</dd></div>
            <div><dt className="font-semibold text-slate-950">{t('fitLabel')}</dt><dd className="mt-1 text-slate-600">{t(`cases.${item.id}.fit`)}</dd></div>
            <div><dt className="font-semibold text-slate-950">{t('considerLabel')}</dt><dd className="mt-1 text-slate-600">{t(`cases.${item.id}.consider`)}</dd></div>
            <div><dt className="font-semibold text-slate-950">{t('deliverLabel')}</dt><dd className="mt-1 text-slate-700">{t(`cases.${item.id}.deliver`)}</dd></div>
          </dl>
          <div className="my-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
            <div><p className="text-sm font-semibold text-slate-950">{t('firstStepTitle')}</p><p className="mt-1 text-sm leading-relaxed text-slate-700">{t('firstStepBody')}</p></div>
          </div>
          <div className="space-y-4"><PortfolioExamples slugs={item.portfolio} /><UseCaseActions item={item} /></div>
        </div> : null}
      </Collapse>
    </Reveal>
  )
}

function AssessmentBand() {
  const t = useTranslations('useCases')
  return (
    <Reveal as="aside" className="my-8 overflow-hidden rounded-2xl bg-slate-950 text-white shadow-xl">
      <div className="relative px-6 py-7 sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/20 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">{t('assessmentEyebrow')}</p>
            <h2 className="mt-2 text-2xl font-serif font-bold">{t('assessmentBandTitle')}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{t('assessmentBody')}</p>
          </div>
          <Link href="/assessment" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-600">
            {t('assessmentCta')}<ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </Reveal>
  )
}

export default function UseCasesExperience() {
  const t = useTranslations('useCases')
  const locale = facetLocale(useLocale())
  const reduceMotion = usePrefersReducedMotion()
  const [facets, setFacets] = useState<UseCaseFacetState>(DEFAULT_USE_CASE_FACETS)
  const [expanded, setExpanded] = useState<Set<UseCaseId>>(() => new Set())
  const facetsRef = useRef(facets)

  const commitFacets = useCallback((next: UseCaseFacetState) => {
    facetsRef.current = next
    setFacets(next)
  }, [])

  const writeUrl = useCallback((state: UseCaseFacetState, hash?: string) => {
    const search = serializeUseCaseFacets(state)
    const url = `${window.location.pathname}${search ? `?${search}` : ''}${hash ? `#${hash}` : ''}`
    window.history.replaceState(null, '', url)
  }, [])

  const scrollToId = useCallback((id: string) => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    }))
  }, [reduceMotion])

  useEffect(() => {
    const focusHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (!isUseCaseId(hash)) return
      const item = USE_CASES.find((candidate) => candidate.id === hash)!
      if (!useCaseMatchesFacets(item, facetsRef.current)) {
        commitFacets(DEFAULT_USE_CASE_FACETS)
        writeUrl(DEFAULT_USE_CASE_FACETS, hash)
      }
      setExpanded(new Set([hash]))
      scrollToId(hash)
    }

    commitFacets(parseUseCaseFacets(window.location.search))
    focusHash()
    window.addEventListener('hashchange', focusHash)
    return () => window.removeEventListener('hashchange', focusHash)
  }, [commitFacets, scrollToId, writeUrl])

  const visibleCases = useMemo(() => filterUseCases(facets), [facets])
  const active = hasActiveUseCaseFacets(facets)

  const select = (key: FacetKey, value: string) => {
    const next = { ...facets, [key]: value } as UseCaseFacetState
    commitFacets(next)
    setExpanded(new Set())
    writeUrl(next)
  }

  const reset = () => {
    commitFacets(DEFAULT_USE_CASE_FACETS)
    setExpanded(new Set())
    writeUrl(DEFAULT_USE_CASE_FACETS)
  }

  const toggleExpanded = (id: UseCaseId) => setExpanded((current) => {
    const next = new Set(current)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  const groupCounts = facetOptionCounts(facets, 'group')
  const industryCounts = facetOptionCounts(facets, 'industry')
  const techCounts = facetOptionCounts(facets, 'tech')

  const groupOptions: FacetOption[] = OUTCOME_GROUP_IDS.map((id) => ({
    value: id,
    label: OUTCOME_GROUP_FACET_LABELS[locale][id],
    count: groupCounts[id] ?? 0,
  }))
  const industryOptions: FacetOption[] = USED_USE_CASE_INDUSTRIES.map((id) => ({
    value: id,
    label: INDUSTRY_FACET_LABELS[locale][id],
    count: industryCounts[id] ?? 0,
  }))
  const techOptions: FacetOption[] = USED_USE_CASE_TECHNOLOGIES.map((id) => ({
    value: id,
    label: TECHNOLOGY_FACET_LABELS[locale][id],
    count: techCounts[id] ?? 0,
  }))

  const firstCases = visibleCases.slice(0, MID_BAND_AFTER)
  const remainingCases = visibleCases.slice(MID_BAND_AFTER)

  const renderCard = (item: UseCaseItem, index: number) => (
    <UseCaseCard
      key={`${serializeUseCaseFacets(facets)}-${item.id}`}
      item={item}
      expanded={expanded.has(item.id)}
      onToggle={() => toggleExpanded(item.id)}
      delayMs={Math.min(index * 40, 160)}
    />
  )

  return (
    <section id="use-cases" className="section-padding bg-white py-20 pb-28 md:pb-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal as="header" when="mount" className="relative mb-10 overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 px-7 py-14 text-left text-white shadow-xl lg:px-12 lg:py-20">
          <Image src="/images/services/use-cases-hero.webp" alt="" fill priority sizes="(max-width: 1280px) 100vw, 1152px" className="pointer-events-none object-cover object-[72%_center] opacity-65" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/94 to-slate-950/50" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/65" aria-hidden />
          <div className="relative max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{t('eyebrow')}</p>
            <div className="flex items-start gap-3"><Table2 className="mt-1 h-10 w-10 shrink-0 text-primary-light" aria-hidden /><h1 className="text-4xl font-serif font-extrabold text-white md:text-5xl">{t('title')}</h1></div>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-200 md:text-xl">{t('subtitle')}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/assessment" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-600">{t('heroAssessmentCta')}<ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <Link href="/solutions" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10">{t('heroSolutionsCta')}<ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
            </div>
          </div>
        </Reveal>

        <div id="outcome-results" className="scroll-mt-28">
          <Reveal as="section" className="mx-auto mb-8 max-w-6xl rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6" aria-labelledby="use-case-filters-heading">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{t('filtersEyebrow')}</p>
                <h2 id="use-case-filters-heading" className="mt-1 text-2xl font-serif font-bold text-slate-950">{t('filtersTitle')}</h2>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <p className="text-sm font-semibold text-slate-700" aria-live="polite">{t('liveCount', { count: visibleCases.length })}</p>
                {active ? <button type="button" onClick={reset} className="min-h-10 text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:text-primary-dark">{t('clearFilters')}</button> : null}
              </div>
            </div>
            <div className="space-y-4">
              <FacetRow label={t('filterOutcomeLabel')} allLabel={t('facetAll')} options={groupOptions} active={facets.group} onSelect={(value) => select('group', value)} />
              <FacetRow label={t('filterIndustryLabel')} allLabel={t('facetAll')} options={industryOptions} active={facets.industry} onSelect={(value) => select('industry', value)} />
              <FacetRow label={t('filterTechLabel')} allLabel={t('facetAll')} options={techOptions} active={facets.tech} onSelect={(value) => select('tech', value)} />
            </div>
          </Reveal>

          <div className="mx-auto max-w-6xl">
            {visibleCases.length > 0 ? (
              <>
                <div className="grid gap-5 lg:grid-cols-2">{firstCases.map(renderCard)}</div>
                <AssessmentBand />
                {remainingCases.length > 0 ? <div className="grid gap-5 lg:grid-cols-2">{remainingCases.map((item, index) => renderCard(item, index))}</div> : null}
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"><Sparkles className="mx-auto h-8 w-8 text-primary" aria-hidden /><p className="mt-3 font-semibold text-slate-900">{t('noMatches')}</p><button type="button" onClick={reset} className="mt-3 min-h-10 text-sm font-semibold text-primary underline underline-offset-4">{t('clearFilters')}</button></div>
            )}
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-4 text-center">
          <p className="text-lg text-slate-600">{t('ctaText')}</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row"><Link href="/contact" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">{t('ctaSchedule')}<ArrowRight className="h-4 w-4" aria-hidden /></Link><Link href="/services/portfolio" className="inline-flex min-h-11 items-center text-sm font-medium text-primary transition-colors hover:text-primary-dark">{t('ctaPortfolio')}</Link></div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700" aria-live="polite">{t('stickyCount', { count: visibleCases.length })}</p>
          <Link href="/assessment" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">{t('stickyCta')}<ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </div>
    </section>
  )
}
