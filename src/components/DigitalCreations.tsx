'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Reveal from './motion/Reveal'
import { useTranslations } from 'next-intl'
import { ExternalLink, ArrowRight, ArrowDown } from 'lucide-react'
import Image from 'next/image'
import { Link, useRouter } from '@/i18n/navigation'
import ScheduleButton from './ScheduleButton'
import StickyMobileCTA from './StickyMobileCTA'
import BrowserFrame from './digital/BrowserFrame'
import { ServicePageHero } from './services/ServicePageSections'
import {
  getOrderedPortfolioItems,
  getFeaturedItems,
  buildPortfolioScheduleQuery,
  getPortfolioItem,
  portfolioImageAlts,
  portfolioHeroLiveChipIds,
  type PortfolioCategory,
  type PortfolioItemConfig,
  type PortfolioProjectType,
} from '@/lib/digitalPortfolio'
import { isCaseStudySlug } from '@/lib/portfolio-case-studies'

type CategoryFilter = 'all' | PortfolioCategory
type OriginFilter = 'all' | 'client' | 'roalla'

const primaryBtnClass =
  'inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg text-sm transition-colors shadow-sm'
const cardPrimaryBtnClass =
  'inline-flex w-full items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-all text-sm'
const textLinkClass =
  'inline-flex items-center text-sm font-medium text-slate-600 hover:text-primary hover:underline'

function getItemCopy(
  t: ReturnType<typeof useTranslations<'digitalCreations'>>,
  prefix: PortfolioItemConfig['i18nPrefix'],
) {
  const keys = {
    t1: { name: 't1Name', desc: 't1Desc', b1: 't1B1', b2: 't1B2', b3: 't1B3', cs: 't1CaseStudy' },
    t4: { name: 't4Name', desc: 't4Desc', b1: 't4B1', b2: 't4B2', b3: 't4B3', cs: 't4CaseStudy' },
    t5: { name: 't5Name', desc: 't5Desc', b1: 't5B1', b2: 't5B2', b3: 't5B3', cs: 't5CaseStudy' },
    t6: { name: 't6Name', desc: 't6Desc', b1: 't6B1', b2: 't6B2', b3: 't6B3', cs: 't6CaseStudy' },
    t7: { name: 't7Name', desc: 't7Desc', b1: 't7B1', b2: 't7B2', b3: 't7B3', cs: 't7CaseStudy' },
    t8: { name: 't8Name', desc: 't8Desc', b1: 't8B1', b2: 't8B2', b3: 't8B3', cs: 't8CaseStudy' },
    t9: { name: 't9Name', desc: 't9Desc', b1: 't9B1', b2: 't9B2', b3: 't9B3', cs: 't9CaseStudy' },
    t10: { name: 't10Name', desc: 't10Desc', b1: 't10B1', b2: 't10B2', b3: 't10B3', cs: 't10CaseStudy' },
    t11: { name: 't11Name', desc: 't11Desc', b1: 't11B1', b2: 't11B2', b3: 't11B3', cs: 't11CaseStudy' },
    t12: { name: 't12Name', desc: 't12Desc', b1: 't12B1', b2: 't12B2', b3: 't12B3', cs: 't12CaseStudy' },
    t13: { name: 't13Name', desc: 't13Desc', b1: 't13B1', b2: 't13B2', b3: 't13B3', cs: 't13CaseStudy' },
    t14: { name: 't14Name', desc: 't14Desc', b1: 't14B1', b2: 't14B2', b3: 't14B3', cs: 't14CaseStudy' },
    t15: { name: 't15Name', desc: 't15Desc', b1: 't15B1', b2: 't15B2', b3: 't15B3', cs: 't15CaseStudy' },
    t16: { name: 't16Name', desc: 't16Desc', b1: 't16B1', b2: 't16B2', b3: 't16B3', cs: 't16CaseStudy' },
  } as const
  const k = keys[prefix]
  return {
    name: t(k.name),
    desc: t(k.desc),
    bullets: [t(k.b1), t(k.b2), t(k.b3)],
    caseStudy: t(k.cs),
  }
}

function categoryLabel(t: ReturnType<typeof useTranslations<'digitalCreations'>>, item: PortfolioItemConfig) {
  if (item.category === 'website') return t('categoryWebsite')
  if (item.i18nPrefix === 't4' || item.i18nPrefix === 't7' || item.i18nPrefix === 't13' || item.i18nPrefix === 't14') {
    return t('categoryPlatformTool')
  }
  return t('categoryPlatform')
}

function projectTypeLabel(
  t: ReturnType<typeof useTranslations<'digitalCreations'>>,
  projectType: PortfolioProjectType,
) {
  if (projectType === 'client') return t('projectBadgeClient')
  if (projectType === 'roalla-product') return t('projectBadgeRoallaProduct')
  return t('projectBadgeRoallaSite')
}

function matchesOrigin(item: PortfolioItemConfig, origin: OriginFilter) {
  if (origin === 'all') return true
  if (origin === 'client') return item.projectType === 'client'
  return item.projectType === 'roalla-product' || item.projectType === 'roalla-site'
}

function liveCtaLabel(t: ReturnType<typeof useTranslations<'digitalCreations'>>, item: PortfolioItemConfig) {
  return item.category === 'website' ? t('viewSite') : t('tryTool')
}

function ProjectTypeBadge({
  t,
  projectType,
}: {
  t: ReturnType<typeof useTranslations<'digitalCreations'>>
  projectType: PortfolioProjectType
}) {
  const isClient = projectType === 'client'
  return (
    <span
      className={`inline-flex w-fit items-center rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide mb-3 border ${
        isClient
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-slate-900 text-white border-slate-900'
      }`}
    >
      {projectTypeLabel(t, projectType)}
    </span>
  )
}

function SecondaryLinks({
  item,
  t,
}: {
  item: PortfolioItemConfig
  t: ReturnType<typeof useTranslations<'digitalCreations'>>
}) {
  const scheduleQuery = buildPortfolioScheduleQuery(item)
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {isCaseStudySlug(item.id) ? (
        <Link
          href={{ pathname: '/services/portfolio/[slug]', params: { slug: item.id } }}
          className={textLinkClass}
        >
          {t('viewCaseStudy')}
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      ) : null}
      <Link href={{ pathname: '/schedule', query: scheduleQuery }} className={textLinkClass}>
        {t('discussBuildLike')}
        <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </Link>
    </div>
  )
}

function LiveDomainChips({ t }: { t: ReturnType<typeof useTranslations<'digitalCreations'>> }) {
  return (
    <div
      className="rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-md p-5 sm:p-6 shadow-[0_8px_40px_rgba(0,0,0,0.25)]"
      data-testid="hero-live-chips"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-light mb-1">{t('heroLiveChipsLabel')}</p>
      <p className="text-sm text-slate-300 mb-4">{t('heroLiveChipsHint')}</p>
      <div className="flex flex-wrap gap-2">
        {portfolioHeroLiveChipIds.map((id) => {
          const item = getPortfolioItem(id)
          if (!item?.domain) return null
          return (
            <a
              key={id}
              href={item.tryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-primary hover:border-primary transition-colors"
            >
              {item.domain}
              <ExternalLink className="w-3.5 h-3.5 opacity-80" aria-hidden />
            </a>
          )
        })}
      </div>
    </div>
  )
}

function FeaturedCaseStudy({
  item,
  t,
}: {
  item: PortfolioItemConfig
  t: ReturnType<typeof useTranslations<'digitalCreations'>>
}) {
  const copy = getItemCopy(t, item.i18nPrefix)
  const liveCta = liveCtaLabel(t, item)

  return (
    <Reveal
      id={item.id}
      className="scroll-mt-28 rounded-2xl border border-primary/20 bg-gradient-to-br from-white via-slate-50 to-primary/5 overflow-hidden shadow-card"
    >
      <div className="grid lg:grid-cols-2 gap-0">
        <div className="p-8 lg:p-10 flex flex-col justify-center order-2 lg:order-1">
          <span className="inline-flex w-fit items-center rounded-full bg-primary/10 text-primary-dark text-xs font-semibold px-3 py-1 mb-3 border border-primary/20">
            {t('featuredLabel')} · {categoryLabel(t, item)}
          </span>
          <ProjectTypeBadge t={t} projectType={item.projectType} />
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-3">{copy.name}</h2>
          <p className="text-slate-600 leading-relaxed mb-4">{copy.desc}</p>
          <p className="text-sm font-medium text-primary mb-6 border-l-2 border-primary pl-3">{copy.caseStudy}</p>
          <div className="space-y-4">
            <a
              href={item.tryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={primaryBtnClass}
            >
              {liveCta}
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            <SecondaryLinks item={item} t={t} />
          </div>
        </div>
        <div className="p-6 lg:p-8 bg-white order-1 lg:order-2 border-b lg:border-b-0 lg:border-l border-slate-200/80">
          <BrowserFrame
            imageUrl={item.imageUrl}
            imageAlt={portfolioImageAlts[item.id]}
            domain={item.domain}
            href={item.tryUrl}
            openLabel={t('openLiveSite')}
            priority
            className="h-full shadow-lg"
          />
        </div>
      </div>
    </Reveal>
  )
}

function PortfolioCard({
  item,
  t,
  index,
}: {
  item: PortfolioItemConfig
  t: ReturnType<typeof useTranslations<'digitalCreations'>>
  index: number
}) {
  const copy = getItemCopy(t, item.i18nPrefix)
  const liveCta = liveCtaLabel(t, item)

  return (
    <Reveal as="article" id={item.id} delayMs={index * 80} className="group h-full scroll-mt-28">
      <div className="h-full bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-200 hover:border-primary/35 overflow-hidden flex flex-col hover:-translate-y-1">
        <a
          href={item.tryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block h-52 bg-slate-100 overflow-hidden"
          aria-label={`${liveCta}: ${copy.name}`}
        >
          {item.brandPreview ? (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary/10 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-2">
                <span className="text-base font-bold text-primary">R</span>
              </div>
              <p className="font-serif font-bold text-slate-900">ROALLA</p>
            </div>
          ) : item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={portfolioImageAlts[item.id]}
              fill
              className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
              priority={index < 2}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent" />
          <div
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold z-10 ${
              item.category === 'website'
                ? 'bg-primary/10 text-primary-dark border border-primary/20 backdrop-blur-sm'
                : 'bg-slate-800/90 text-white'
            }`}
          >
            {categoryLabel(t, item)}
          </div>
          <span className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5 rounded-lg bg-slate-900/80 text-white text-xs font-semibold py-2 px-3 backdrop-blur-sm">
            {t('openLiveSite')}
            <ExternalLink className="w-3.5 h-3.5" aria-hidden />
          </span>
          {item.domain ? (
            <span className="absolute top-3 left-3 text-[11px] font-medium text-white/95 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
              {item.domain}
            </span>
          ) : null}
        </a>

        <div className="p-5 flex flex-1 flex-col">
          <ProjectTypeBadge t={t} projectType={item.projectType} />
          <h3 className="text-lg font-bold text-slate-900 mb-2">{copy.name}</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-2">{copy.desc}</p>
          <div className="mt-auto space-y-3">
            <a
              href={item.tryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cardPrimaryBtnClass}
            >
              {liveCta}
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            <SecondaryLinks item={item} t={t} />
          </div>
        </div>
      </div>
    </Reveal>
  )
}

const filterBtnClass = (active: boolean) =>
  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    active
      ? 'bg-primary text-white shadow-sm'
      : 'bg-white text-slate-600 border border-slate-200 hover:border-primary/30'
  }`

const DigitalCreations = () => {
  const t = useTranslations('digitalCreations')
  const tCommon = useTranslations('common')
  const searchParams = useSearchParams()
  const router = useRouter()
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [originFilter, setOriginFilter] = useState<OriginFilter>('all')
  const [stickyInquire, setStickyInquire] = useState(false)

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'website') setCategoryFilter('website')
    else if (type === 'platform') setCategoryFilter('platform')
    else setCategoryFilter('all')

    const origin = searchParams.get('origin')
    if (origin === 'client' || origin === 'roalla') setOriginFilter(origin)
    else setOriginFilter('all')
  }, [searchParams])

  useEffect(() => {
    const onScroll = () => {
      const grid = document.getElementById('portfolio-grid')
      if (!grid) {
        setStickyInquire(window.scrollY > 1400)
        return
      }
      const gridBottom = grid.offsetTop + grid.offsetHeight
      setStickyInquire(window.scrollY + window.innerHeight > gridBottom - 80)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const syncUrl = useCallback(
    (category: CategoryFilter, origin: OriginFilter) => {
      const query: Record<string, string> = {}
      if (category !== 'all') query.type = category
      if (origin !== 'all') query.origin = origin
      router.replace(
        Object.keys(query).length === 0
          ? '/services/portfolio'
          : { pathname: '/services/portfolio', query },
        { scroll: false },
      )
    },
    [router],
  )

  const updateCategoryFilter = useCallback(
    (key: CategoryFilter) => {
      setCategoryFilter(key)
      syncUrl(key, originFilter)
    },
    [originFilter, syncUrl],
  )

  const updateOriginFilter = useCallback(
    (key: OriginFilter) => {
      setOriginFilter(key)
      syncUrl(categoryFilter, key)
    },
    [categoryFilter, syncUrl],
  )

  const featuredItems = useMemo(() => {
    let items =
      categoryFilter === 'all' ? getFeaturedItems() : getFeaturedItems(categoryFilter)
    if (categoryFilter === 'all' && items.length > 0) {
      const platformFeatured = items.find((item) => item.featuredCategory === 'platform')
      items = [platformFeatured ?? items[0]]
    }
    return items.filter((item) => matchesOrigin(item, originFilter))
  }, [categoryFilter, originFilter])

  const featuredIds = useMemo(() => new Set(featuredItems.map((item) => item.id)), [featuredItems])

  const gridItems = useMemo(() => {
    const items =
      categoryFilter === 'all'
        ? getOrderedPortfolioItems()
        : getOrderedPortfolioItems({ category: categoryFilter })
    return items
      .filter((item) => !featuredIds.has(item.id))
      .filter((item) => matchesOrigin(item, originFilter))
  }, [categoryFilter, originFilter, featuredIds])

  const categoryFilters: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: t('filterAll') },
    { key: 'website', label: t('filterWebsite') },
    { key: 'platform', label: t('filterPlatform') },
  ]

  const originFilters: { key: OriginFilter; label: string }[] = [
    { key: 'all', label: t('filterOriginAll') },
    { key: 'client', label: t('filterOriginClient') },
    { key: 'roalla', label: t('filterOriginRoalla') },
  ]

  return (
    <section id="portfolio" className="section-padding relative">
      <ServicePageHero
        variant="digital"
        className="!mb-10"
        eyebrow={t('portfolioTagline')}
        title={t('portfolioTitle')}
        subtitle={t('portfolioSubtitle')}
        subtitleHighlight={t('portfolioSubtitleHighlight')}
        stats={[]}
        visual={<LiveDomainChips t={t} />}
        primaryCta={
          <a href="#featured-case" className={primaryBtnClass}>
            {t('browseLiveExamples')}
            <ArrowDown className="ml-2 w-4 h-4" />
          </a>
        }
        secondaryCta={
          <ScheduleButton variant="secondary" size="lg" className="border-white/30 text-white hover:bg-white/10">
            {tCommon('scheduleConsultation')}
          </ScheduleButton>
        }
      />

      <div id="featured-case" className="scroll-mt-28 mb-10">
        {featuredItems.length > 0 ? (
          featuredItems.map((item) => <FeaturedCaseStudy key={item.id} item={item} t={t} />)
        ) : (
          <p className="text-sm text-slate-500 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
            {t('noFeaturedForFilter')}
          </p>
        )}
      </div>

      <div id="all-examples" className="scroll-mt-28 mb-8">
        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 sm:px-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">{t('gridTitle')}</h2>
              <p className="text-sm text-slate-500 mt-1">{t('gridSubtitle')}</p>
            </div>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label={t('filterCategoryLabel')}>
              {categoryFilters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={categoryFilter === f.key}
                  onClick={() => updateCategoryFilter(f.key)}
                  className={filterBtnClass(categoryFilter === f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-1">
              {t('filterOriginLabel')}
            </p>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label={t('filterOriginLabel')}>
              {originFilters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={originFilter === f.key}
                  onClick={() => updateOriginFilter(f.key)}
                  className={filterBtnClass(originFilter === f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div id="portfolio-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {gridItems.map((item, index) => (
            <PortfolioCard key={item.id} item={item} t={t} index={index} />
          ))}
        </div>

        {gridItems.length === 0 && (
          <p className="text-center text-slate-500 mb-16">{t('noProjectsInCategory')}</p>
        )}
      </div>

      <Reveal
        id="digital-cta"
        className="bg-gradient-to-br from-primary via-primary-dark to-[#007a87] rounded-2xl p-10 md:p-16 text-center shadow-[0_25px_80px_rgba(0,180,197,0.25)] relative border border-primary/20 overflow-hidden mb-8"
      >
        <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
        <div className="relative z-10">
          <span className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white mb-4">
            {t('builtWithClients')}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">{t('ctaTitle')}</h2>
          <p className="text-xl text-white/95 mb-8 max-w-3xl mx-auto">{t('ctaSubtitle')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <ScheduleButton
              variant="secondary"
              size="lg"
              className="bg-white text-primary-dark hover:bg-white/90 hover:scale-[1.03] transition-transform shadow-2xl"
            >
              {tCommon('scheduleConsultation')}
            </ScheduleButton>
            <Link
              href="/services/digital"
              className="inline-flex items-center text-white font-semibold py-3 px-6 rounded-lg border border-white/40 hover:bg-white/10 transition-colors"
            >
              {t('howWeDeliver')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </Reveal>

      {stickyInquire ? (
        <StickyMobileCTA
          label={tCommon('scheduleConsultation')}
          sublabel={tCommon('ctaSubtext')}
          intent="website"
        />
      ) : (
        <StickyMobileCTA
          anchorHref="#featured-case"
          label={t('stickyBrowseLabel')}
          sublabel={t('openLiveSiteHint')}
        />
      )}
    </section>
  )
}

export default DigitalCreations
