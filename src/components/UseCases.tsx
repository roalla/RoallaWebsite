'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Globe,
  Layers,
  Link2,
  Calendar,
  Sparkles,
  Table2,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import ScheduleButton from './ScheduleButton'
import Reveal from './motion/Reveal'
import {
  USE_CASES,
  USE_CASE_CATEGORIES,
  isUseCaseId,
  categoryForUseCase,
  scheduleQueryForUseCase,
  type UseCaseCategory,
  type UseCaseFilter,
  type UseCaseId,
  type UseCaseMaturity,
} from '@/lib/use-cases'
import type { CaseStudySlug } from '@/lib/portfolio-case-studies'

const categoryIcons: Record<UseCaseCategory, LucideIcon> = {
  websites: Globe,
  apps: Layers,
  automation: Link2,
  events: Calendar,
  ai: Sparkles,
}

const maturityStyles: Record<UseCaseMaturity, string> = {
  proven: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  established: 'bg-sky-50 text-sky-950 border-sky-200',
  ready: 'bg-amber-50 text-amber-950 border-amber-200',
}

function MaturityBadge({ maturity }: { maturity: UseCaseMaturity }) {
  const t = useTranslations('useCases')
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${maturityStyles[maturity]}`}
    >
      {t(`maturity.${maturity}.label`)}
    </span>
  )
}

function PortfolioExamples({ slugs }: { slugs: readonly CaseStudySlug[] }) {
  const t = useTranslations('useCases')

  if (slugs.length === 0) return null

  return (
    <div className="mt-3 pt-3 border-t border-slate-200/80">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-2">
        {t('portfolioExamples')}
      </p>
      <ul className="flex flex-wrap gap-2">
        {slugs.map((slug) => (
          <li key={slug}>
            <Link
              href={{ pathname: '/services/portfolio/[slug]', params: { slug } }}
              className="inline-flex items-center gap-1 rounded-md border border-primary/25 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary-dark hover:border-primary/40 hover:bg-primary/10 transition-colors"
            >
              {t(`portfolio.${slug}`)}
              <ArrowUpRight className="w-3 h-3" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function UseCaseInquiryLink({ id }: { id: UseCaseId }) {
  const t = useTranslations('useCases')
  const query = scheduleQueryForUseCase(id)

  return (
    <Link
      href={{ pathname: '/schedule', query }}
      className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
    >
      {t('rowCta')}
      <ArrowUpRight className="w-3 h-3" aria-hidden />
    </Link>
  )
}

function UseCaseRowDesktop({
  id,
  need,
  consider,
  deliver,
  maturity,
  portfolio,
}: {
  id: UseCaseId
  need: string
  consider: string
  deliver: string
  maturity: UseCaseMaturity
  portfolio: readonly CaseStudySlug[]
}) {
  return (
    <tr className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/80 transition-colors">
      <td className="align-top px-5 py-5 text-sm font-medium text-slate-900 w-[26%]">{need}</td>
      <td className="align-top px-5 py-5 text-sm text-slate-600 leading-relaxed w-[34%]">{consider}</td>
      <td className="align-top px-5 py-5 text-sm text-slate-700 leading-relaxed w-[40%]">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <MaturityBadge maturity={maturity} />
        </div>
        {deliver}
        <PortfolioExamples slugs={portfolio} />
        <UseCaseInquiryLink id={id} />
      </td>
    </tr>
  )
}

function UseCaseCardMobile({
  id,
  need,
  consider,
  deliver,
  maturity,
  portfolio,
}: {
  id: UseCaseId
  need: string
  consider: string
  deliver: string
  maturity: UseCaseMaturity
  portfolio: readonly CaseStudySlug[]
}) {
  const t = useTranslations('useCases')

  return (
    <article className="border-b border-slate-200 last:border-b-0 p-5 space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-1.5">
          {t('columnNeed')}
        </p>
        <p className="text-sm font-medium text-slate-900 leading-relaxed">{need}</p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-1.5">
          {t('columnConsider')}
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">{consider}</p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-1.5">
          {t('columnDeliver')}
        </p>
        <div className="mb-2">
          <MaturityBadge maturity={maturity} />
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{deliver}</p>
        <PortfolioExamples slugs={portfolio} />
        <UseCaseInquiryLink id={id} />
      </div>
    </article>
  )
}

function UseCaseAnchor({ id }: { id: UseCaseId }) {
  return <span id={id} className="block scroll-mt-28" aria-hidden="true" />
}

function CategoryBlock({
  category,
  filter,
}: {
  category: UseCaseCategory
  filter: UseCaseFilter
}) {
  const t = useTranslations('useCases')
  const Icon = categoryIcons[category]
  const rows = USE_CASES.filter((item) => item.category === category)

  if (rows.length === 0 || (filter !== 'all' && filter !== category)) return null

  return (
    <Reveal as="section" id={`category-${category}`} className="mb-10 last:mb-0 scroll-mt-28">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
          <Icon className="h-5 w-5 text-primary" aria-hidden />
        </div>
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">{t(`categories.${category}.title`)}</h2>
          <p className="text-sm text-slate-500">{t(`categories.${category}.desc`)}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th
                  scope="col"
                  className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 w-[26%]"
                >
                  {t('columnNeed')}
                </th>
                <th
                  scope="col"
                  className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 w-[34%]"
                >
                  {t('columnConsider')}
                </th>
                <th
                  scope="col"
                  className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 w-[40%]"
                >
                  {t('columnDeliver')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="h-0 border-0">
                    <td colSpan={3} className="p-0 border-0 leading-none">
                      <UseCaseAnchor id={item.id} />
                    </td>
                  </tr>
                  <UseCaseRowDesktop
                    id={item.id}
                    need={t(`cases.${item.id}.need`)}
                    consider={t(`cases.${item.id}.consider`)}
                    deliver={t(`cases.${item.id}.deliver`)}
                    maturity={item.maturity}
                    portfolio={item.portfolio}
                  />
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden divide-y divide-slate-200">
          {rows.map((item) => (
            <div key={item.id}>
              <UseCaseAnchor id={item.id} />
              <UseCaseCardMobile
                id={item.id}
                need={t(`cases.${item.id}.need`)}
                consider={t(`cases.${item.id}.consider`)}
                deliver={t(`cases.${item.id}.deliver`)}
                maturity={item.maturity}
                portfolio={item.portfolio}
              />
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  )
}

export default function UseCases() {
  const t = useTranslations('useCases')
  const [filter, setFilter] = useState<UseCaseFilter>('all')

  const scrollToHash = useCallback((hash: string) => {
    const target = document.getElementById(hash)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
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
    if (hash) {
      requestAnimationFrame(() => scrollToHash(hash))
    }
  }

  return (
    <section id="use-cases" className="section-padding bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Table2 className="w-11 h-11 text-primary-dark mr-3" aria-hidden />
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-slate-900">{t('title')}</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mt-4">{t('subtitle')}</p>
        </Reveal>

        <Reveal className="max-w-4xl mx-auto mb-8 rounded-xl border border-primary/20 bg-gradient-to-br from-white via-slate-50 to-primary/5 p-6 lg:p-8">
          <p className="text-sm font-semibold text-slate-900 mb-3">{t('howToReadTitle')}</p>
          <ul className="space-y-2 text-sm text-slate-600 leading-relaxed">
            <li>{t('howToRead1')}</li>
            <li>{t('howToRead2')}</li>
            <li>{t('howToRead3')}</li>
          </ul>
          <div className="mt-5 pt-5 border-t border-slate-200/80">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-3">
              {t('maturityLegendTitle')}
            </p>
            <div className="flex flex-wrap gap-3">
              {(['proven', 'established', 'ready'] as const).map((level) => (
                <div
                  key={level}
                  className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 max-w-xs"
                >
                  <MaturityBadge maturity={level} />
                  <p className="text-xs text-slate-600 leading-relaxed pt-0.5">{t(`maturity.${level}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="max-w-6xl mx-auto mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-3">
            {t('filterLabel')}
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t('filterLabel')}>
            <button
              type="button"
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
        </Reveal>

        <div className="max-w-6xl mx-auto">
          {USE_CASE_CATEGORIES.map((category) => (
            <CategoryBlock key={category} category={category} filter={filter} />
          ))}
        </div>

        <Reveal delayMs={200} className="mt-14 max-w-3xl mx-auto text-center space-y-4">
          <p className="text-lg text-slate-600">{t('ctaText')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <ScheduleButton variant="primary" size="md" icon>
              {t('ctaSchedule')}
            </ScheduleButton>
            <Link
              href="/services/portfolio"
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              {t('ctaPortfolio')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
