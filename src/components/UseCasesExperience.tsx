'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Compass,
  Gauge,
  Rocket,
  ShieldCheck,
  Sparkles,
  Table2,
  type LucideIcon,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import ScheduleButton from './ScheduleButton'
import Collapse from './motion/Collapse'
import Reveal from './motion/Reveal'
import {
  FEATURED_USE_CASE_IDS,
  USE_CASES,
  USE_CASE_CATEGORIES,
  USE_CASE_FAMILIES,
  USE_CASE_SERVICE_HREFS,
  categoryForUseCase,
  familyForService,
  isUseCaseId,
  scheduleQueryForUseCase,
  type UseCaseCategory,
  type UseCaseFamily,
  type UseCaseFamilyFilter,
  type UseCaseFilter,
  type UseCaseId,
  type UseCaseServiceKey,
} from '@/lib/use-cases'
import type { CaseStudySlug } from '@/lib/portfolio-case-studies'

type UseCaseItem = (typeof USE_CASES)[number]

const categoryIcons: Record<UseCaseCategory, LucideIcon> = {
  decisions: Compass,
  operations: Gauge,
  growth: Rocket,
  risk: ShieldCheck,
}

const familyIcons: Record<UseCaseFamily, LucideIcon> = {
  'build-grow': Rocket,
  'strategy-risk': ShieldCheck,
}

const featuredIds = new Set<UseCaseId>(FEATURED_USE_CASE_IDS)

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

function UseCaseActions({ id, service }: { id: UseCaseId; service: UseCaseServiceKey }) {
  const t = useTranslations('useCases')
  const query = scheduleQueryForUseCase(id)
  const toolHref = id === 'communications-modernization'
    ? '/tools/communications-value-brief'
    : id === 'platform-selection' || id === 'provider-comparison' || id === 'technology-stack-review'
      ? '/tools/technology-decision-brief'
      : null
  const toolLabel = id === 'communications-modernization'
    ? t('commsValueBriefCta')
    : toolHref
      ? t('techDecisionBriefCta')
      : null

  return (
    <div className="flex flex-col items-start gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:flex-wrap sm:items-center">
      <Link
        href={{ pathname: '/contact', query }}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        {t('discussCta')}<ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <Link href={USE_CASE_SERVICE_HREFS[service]} className="inline-flex min-h-11 items-center gap-1 px-1 text-sm font-semibold text-slate-700 transition-colors hover:text-primary-dark">
        {t(`services.${service}`)}<ArrowUpRight className="h-4 w-4" aria-hidden />
      </Link>
      {toolHref && toolLabel ? (
        <Link href={toolHref} className="inline-flex min-h-11 items-center gap-1 px-1 text-sm font-semibold text-primary transition-colors hover:text-primary-dark">
          {toolLabel}<ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : null}
    </div>
  )
}

function UseCaseCard({ item, expanded, onToggle, delayMs }: {
  item: UseCaseItem
  expanded: boolean
  onToggle: () => void
  delayMs: number
}) {
  const t = useTranslations('useCases')
  const family = familyForService(item.service)
  const FamilyIcon = familyIcons[family]
  const detailsId = `${item.id}-details`

  return (
    <Reveal as="article" delayMs={delayMs} className="scroll-mt-32 self-start rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 motion-safe:hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={detailsId}
        className="w-full rounded-2xl p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:p-6"
      >
        <span className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-primary-dark">
            <FamilyIcon className="h-3.5 w-3.5" aria-hidden />{t(`families.${family}.title`)}
          </span>
          <span title={t(`maturity.${item.maturity}.desc`)} className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            {t(`maturity.${item.maturity}.label`)}
          </span>
        </span>
        <span id={item.id} className="block scroll-mt-36 text-xl font-bold leading-snug text-slate-950">{t(`cases.${item.id}.title`)}</span>
        <span className="mt-3 block border-l-2 border-primary/40 pl-3 text-sm font-medium leading-relaxed text-slate-700">{t(`cases.${item.id}.outcome`)}</span>
        <span className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-primary-dark">
          {expanded ? t('hideApproach') : t('seeApproach')}
          <ChevronDown className={`h-5 w-5 transition-transform duration-300 motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`} aria-hidden />
        </span>
      </button>

      <Collapse open={expanded}>
        {expanded ? <div id={detailsId} className="px-5 pb-6 sm:px-6">
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
          <div className="space-y-4"><PortfolioExamples slugs={item.portfolio} /><UseCaseActions id={item.id} service={item.service} /></div>
        </div> : null}
      </Collapse>
    </Reveal>
  )
}

function AssessmentPrompt() {
  const t = useTranslations('useCases')
  return (
    <Reveal as="aside" className="my-8 overflow-hidden rounded-2xl bg-slate-950 text-white shadow-xl">
      <div className="relative px-6 py-7 sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/20 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">{t('assessmentEyebrow')}</p>
            <h2 className="mt-2 text-2xl font-serif font-bold">{t('assessmentTitle')}</h2>
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
  const reduceMotion = usePrefersReducedMotion()
  const [filter, setFilter] = useState<UseCaseFilter>('featured')
  const [family, setFamily] = useState<UseCaseFamilyFilter>('all')
  const [expanded, setExpanded] = useState<Set<UseCaseId>>(() => new Set())

  const scrollToHash = useCallback((hash: string) => {
    document.getElementById(hash)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }, [reduceMotion])

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (!hash) return
      if (isUseCaseId(hash)) {
        setFilter(categoryForUseCase(hash))
        setFamily('all')
        setExpanded(new Set([hash]))
        requestAnimationFrame(() => scrollToHash(hash))
        return
      }
      if (hash.startsWith('category-')) {
        const category = hash.replace('category-', '') as UseCaseCategory
        if ((USE_CASE_CATEGORIES as readonly string[]).includes(category)) {
          setFilter(category)
          requestAnimationFrame(() => scrollToHash('outcome-results'))
        }
      }
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [scrollToHash])

  const visibleCases = useMemo(() => USE_CASES.filter((item) => {
    const matchesOutcome = filter === 'featured' ? featuredIds.has(item.id) : item.category === filter
    const matchesFamily = family === 'all' || familyForService(item.service) === family
    return matchesOutcome && matchesFamily
  }), [family, filter])

  const setOutcome = (next: UseCaseFilter) => {
    setFilter(next)
    setExpanded(new Set())
    const hash = next === 'featured' ? '' : `category-${next}`
    window.history.replaceState(null, '', hash ? `${window.location.pathname}#${hash}` : window.location.pathname)
    if (next !== 'featured') requestAnimationFrame(() => scrollToHash('outcome-results'))
  }

  const toggleExpanded = (id: UseCaseId) => setExpanded((current) => {
    const next = new Set(current)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  const reset = () => {
    setFilter('featured')
    setFamily('all')
    setExpanded(new Set())
    window.history.replaceState(null, '', window.location.pathname)
  }

  const firstCases = visibleCases.slice(0, 4)
  const remainingCases = visibleCases.slice(4)

  return (
    <section id="use-cases" className="section-padding bg-white py-20 lg:py-28">
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

        <Reveal as="section" className="mx-auto mb-10 max-w-6xl" aria-labelledby="outcome-heading">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{t('outcomesEyebrow')}</p>
            <h2 id="outcome-heading" className="mt-2 text-3xl font-serif font-bold text-slate-950">{t('outcomesTitle')}</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{t('outcomesBody')}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {USE_CASE_CATEGORIES.map((category, index) => {
              const Icon = categoryIcons[category]
              const active = filter === category
              const count = USE_CASES.filter((item) => item.category === category).length
              return (
                <button key={category} type="button" aria-pressed={active} onClick={() => setOutcome(category)} className={`group min-h-44 rounded-2xl border p-5 text-left transition-all duration-300 motion-reduce:transition-none ${active ? 'border-primary bg-primary text-white shadow-lg' : 'border-slate-200 bg-white text-slate-950 shadow-sm motion-safe:hover:-translate-y-1 hover:border-primary/35 hover:shadow-md'}`} style={reduceMotion ? undefined : { transitionDelay: `${index * 25}ms` }}>
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${active ? 'bg-white/15 text-white' : 'bg-primary/10 text-primary-dark'}`}><Icon className="h-5 w-5" aria-hidden /></span>
                  <span className="mt-4 block text-lg font-bold leading-snug">{t(`categories.${category}.title`)}</span>
                  <span className={`mt-2 block text-sm leading-relaxed ${active ? 'text-cyan-50' : 'text-slate-600'}`}>{t(`categories.${category}.desc`)}</span>
                  <span className={`mt-3 block text-xs font-semibold ${active ? 'text-cyan-100' : 'text-slate-500'}`}>{t('scenarioCount', { count })}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        <div id="outcome-results" className="scroll-mt-28">
          <div className="sticky top-16 z-20 mx-auto mb-8 max-w-6xl rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-lg backdrop-blur-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{t('familyFilterLabel')}</p>
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1" role="group" aria-label={t('familyFilterLabel')}>
                  <button type="button" aria-pressed={family === 'all'} onClick={() => setFamily('all')} className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${family === 'all' ? 'border-primary bg-primary text-white' : 'border-slate-200 text-slate-700 hover:border-primary/40'}`}>{t('familyAll')}</button>
                  {USE_CASE_FAMILIES.map((familyId) => <button key={familyId} type="button" aria-pressed={family === familyId} onClick={() => setFamily(familyId)} className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${family === familyId ? 'border-primary bg-primary text-white' : 'border-slate-200 text-slate-700 hover:border-primary/40'}`}>{t(`families.${familyId}.title`)}</button>)}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 lg:justify-end">
                <p className="text-sm font-semibold text-slate-700" aria-live="polite">{t('resultsCount', { count: visibleCases.length })}</p>
                {filter !== 'featured' || family !== 'all' ? <button type="button" onClick={reset} className="min-h-10 text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:text-primary-dark">{t('clearFilters')}</button> : null}
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-6xl">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{filter === 'featured' ? t('featuredEyebrow') : t('selectedEyebrow')}</p>
              <h2 className="mt-2 text-3xl font-serif font-bold text-slate-950">{filter === 'featured' ? t('featuredTitle') : t(`categories.${filter}.title`)}</h2>
              <p className="mt-2 max-w-3xl text-slate-600">{filter === 'featured' ? t('featuredBody') : t(`categories.${filter}.desc`)}</p>
            </div>
            {visibleCases.length > 0 ? (
              <>
                <div className="grid gap-5 lg:grid-cols-2">{firstCases.map((item, index) => <UseCaseCard key={`${filter}-${family}-${item.id}`} item={item} expanded={expanded.has(item.id)} onToggle={() => toggleExpanded(item.id)} delayMs={Math.min(index * 50, 150)} />)}</div>
                <AssessmentPrompt />
                {remainingCases.length > 0 ? <div className="grid gap-5 lg:grid-cols-2">{remainingCases.map((item, index) => <UseCaseCard key={`${filter}-${family}-${item.id}`} item={item} expanded={expanded.has(item.id)} onToggle={() => toggleExpanded(item.id)} delayMs={Math.min(index * 40, 160)} />)}</div> : null}
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"><Sparkles className="mx-auto h-8 w-8 text-primary" aria-hidden /><p className="mt-3 font-semibold text-slate-900">{t('noMatches')}</p><button type="button" onClick={reset} className="mt-3 text-sm font-semibold text-primary underline underline-offset-4">{t('clearFilters')}</button></div>
            )}
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-4 text-center">
          <p className="text-lg text-slate-600">{t('ctaText')}</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row"><ScheduleButton variant="primary" size="md" icon>{t('ctaSchedule')}</ScheduleButton><Link href="/services/portfolio" className="inline-flex min-h-11 items-center text-sm font-medium text-primary transition-colors hover:text-primary-dark">{t('ctaPortfolio')}</Link></div>
        </div>
      </div>
    </section>
  )
}
