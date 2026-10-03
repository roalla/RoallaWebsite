'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  Compass,
  Gauge,
  Rocket,
  ShieldCheck,
  Table2,
  type LucideIcon,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import ScheduleButton from './ScheduleButton'
import {
  USE_CASES,
  USE_CASE_CATEGORIES,
  USE_CASE_SERVICE_HREFS,
  isUseCaseId,
  categoryForUseCase,
  scheduleQueryForUseCase,
  type UseCaseCategory,
  type UseCaseFilter,
  type UseCaseId,
  type UseCaseServiceKey,
} from '@/lib/use-cases'
import type { CaseStudySlug } from '@/lib/portfolio-case-studies'

const categoryIcons: Record<UseCaseCategory, LucideIcon> = {
  decisions: Compass,
  execution: Gauge,
  resilience: ShieldCheck,
  demand: Rocket,
  experiences: BriefcaseBusiness,
  automation: Bot,
}

function PortfolioExamples({ slugs }: { slugs: readonly CaseStudySlug[] }) {
  const t = useTranslations('useCases')

  if (slugs.length === 0) return null

  return (
    <div className="border-t border-slate-200 pt-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {t('portfolioExamples')}
      </p>
      <ul className="flex flex-wrap gap-2">
        {slugs.map((slug) => (
          <li key={slug}>
            <Link
              href={{ pathname: '/services/portfolio/[slug]', params: { slug } }}
              className="inline-flex items-center gap-1 rounded-md border border-primary/25 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary-dark transition-colors hover:border-primary/40 hover:bg-primary/10"
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
  const toolHref =
    id === 'communications-modernization'
      ? '/tools/communications-value-brief'
      : id === 'platform-selection' || id === 'provider-comparison' || id === 'technology-stack-review'
        ? '/tools/technology-decision-brief'
        : null
  const toolLabel =
    id === 'communications-modernization'
      ? t('commsValueBriefCta')
      : toolHref
        ? t('techDecisionBriefCta')
        : null

  return (
    <div className="flex flex-col items-start gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
      <Link
        href={USE_CASE_SERVICE_HREFS[service]}
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 transition-colors hover:text-primary-dark"
      >
        {t(`services.${service}`)}
        <ArrowUpRight className="h-3 w-3" aria-hidden />
      </Link>
      {toolHref && toolLabel ? (
        <Link
          href={toolHref}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          {toolLabel}
          <ArrowUpRight className="h-3 w-3" aria-hidden />
        </Link>
      ) : null}
      <Link
        href={{ pathname: '/contact', query }}
        className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
      >
        {t('rowCta', { outcome: t(`cases.${id}.title`) })}
        <ArrowUpRight className="h-3 w-3" aria-hidden />
      </Link>
    </div>
  )
}

function UseCaseCard({ id, service, portfolio }: {
  id: UseCaseId
  service: UseCaseServiceKey
  portfolio: readonly CaseStudySlug[]
}) {
  const t = useTranslations('useCases')

  return (
    <article
      aria-labelledby={`${id}-title`}
      className="scroll-mt-32 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6"
    >
      <div className="mb-5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-dark">
          {t('scenarioLabel')}
        </p>
        <h3 id={id} className="scroll-mt-32 text-xl font-bold leading-snug text-slate-950">
          <span id={`${id}-title`}>{t(`cases.${id}.title`)}</span>
        </h3>
        <p className="mt-3 border-l-2 border-primary/40 pl-3 text-sm font-medium leading-relaxed text-slate-800">
          {t(`cases.${id}.outcome`)}
        </p>
      </div>

      <dl className="space-y-4 text-sm leading-relaxed">
        <div>
          <dt className="font-semibold text-slate-900">{t('recognizeLabel')}</dt>
          <dd className="mt-1 text-slate-600">{t(`cases.${id}.need`)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">{t('considerLabel')}</dt>
          <dd className="mt-1 text-slate-600">{t(`cases.${id}.consider`)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">{t('deliverLabel')}</dt>
          <dd className="mt-1 text-slate-700">{t(`cases.${id}.deliver`)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">{t('fitLabel')}</dt>
          <dd className="mt-1 text-slate-600">{t(`cases.${id}.fit`)}</dd>
        </div>
      </dl>

      <div className="mt-5 space-y-4">
        <PortfolioExamples slugs={portfolio} />
        <UseCaseActions id={id} service={service} />
      </div>
    </article>
  )
}

function CategoryBlock({ category, filter }: { category: UseCaseCategory; filter: UseCaseFilter }) {
  const t = useTranslations('useCases')
  const Icon = categoryIcons[category]
  const cases = USE_CASES.filter((item) => item.category === category)

  if (cases.length === 0 || (filter !== 'all' && filter !== category)) return null

  return (
    <section id={`category-${category}`} className="mb-14 scroll-mt-32 last:mb-0">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/5">
          <Icon className="h-5 w-5 text-primary-dark" aria-hidden />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-950">{t(`categories.${category}.title`)}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">
            {t(`categories.${category}.desc`)}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {cases.map((item) => (
          <UseCaseCard key={item.id} id={item.id} service={item.service} portfolio={item.portfolio} />
        ))}
      </div>
    </section>
  )
}

export default function UseCases() {
  const t = useTranslations('useCases')
  const [filter, setFilter] = useState<UseCaseFilter>('all')

  const scrollToHash = useCallback((hash: string) => {
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (!hash) return

      if (isUseCaseId(hash)) {
        setFilter(categoryForUseCase(hash))
        requestAnimationFrame(() => scrollToHash(hash))
        return
      }

      if (hash.startsWith('category-')) {
        const category = hash.replace('category-', '') as UseCaseCategory
        if ((USE_CASE_CATEGORIES as readonly string[]).includes(category)) {
          setFilter(category)
          requestAnimationFrame(() => scrollToHash(hash))
        }
      }
    }

    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [scrollToHash])

  const setFilterAndHash = (next: UseCaseFilter) => {
    setFilter(next)
    const hash = next === 'all' ? '' : `category-${next}`
    window.history.replaceState(null, '', hash ? `${window.location.pathname}#${hash}` : window.location.pathname)
    if (hash) requestAnimationFrame(() => scrollToHash(hash))
  }

  return (
    <section id="use-cases" className="section-padding bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center">
            <Table2 className="mr-3 h-11 w-11 text-primary-dark" aria-hidden />
            <h1 className="text-4xl font-serif font-extrabold text-slate-950 md:text-5xl">{t('title')}</h1>
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-xl leading-relaxed text-slate-600">{t('subtitle')}</p>
        </header>

        <aside className="mx-auto mb-8 max-w-4xl rounded-xl border border-primary/20 bg-gradient-to-br from-white via-slate-50 to-primary/5 p-6 lg:p-8">
          <p className="mb-3 text-sm font-semibold text-slate-900">{t('howToReadTitle')}</p>
          <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
            <li>{t('howToRead1')}</li>
            <li>{t('howToRead2')}</li>
            <li>{t('howToRead3')}</li>
          </ul>
        </aside>

        <nav className="mx-auto mb-12 max-w-6xl" aria-label={t('filterLabel')}>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {t('filterLabel')}
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t('filterLabel')}>
            <button
              type="button"
              aria-pressed={filter === 'all'}
              onClick={() => setFilterAndHash('all')}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'border-primary bg-primary text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-primary/40 hover:text-primary-dark'
              }`}
            >
              {t('filterAll')}
            </button>
            {USE_CASE_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={filter === category}
                onClick={() => setFilterAndHash(category)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  filter === category
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-primary/40 hover:text-primary-dark'
                }`}
              >
                {t(`categories.${category}.title`)}
              </button>
            ))}
          </div>
        </nav>

        <div className="mx-auto max-w-6xl">
          {USE_CASE_CATEGORIES.map((category) => (
            <CategoryBlock key={category} category={category} filter={filter} />
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-4 text-center">
          <p className="text-lg text-slate-600">{t('ctaText')}</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ScheduleButton variant="primary" size="md" icon>
              {t('ctaSchedule')}
            </ScheduleButton>
            <Link href="/services/portfolio" className="text-sm font-medium text-primary transition-colors hover:text-primary-dark">
              {t('ctaPortfolio')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
