'use client'

import React, { useMemo, useState } from 'react'
import Reveal from './motion/Reveal'
import { useTranslations } from 'next-intl'
import {
  ExternalLink,
  ArrowRight,
  ArrowDown,
  CheckCircle,
  Globe,
  Layers,
  Rocket,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import ScheduleButton from './ScheduleButton'
import StickyMobileCTA from './StickyMobileCTA'
import BrowserFrame from './digital/BrowserFrame'
import {
  ServicePageHero,
  ConsultingHeroVisual,
  serviceHeroSecondaryButtonClass,
} from './services/ServicePageSections'
import {
  getOrderedPortfolioItems,
  portfolioItems,
  portfolioImageAlts,
  type PortfolioCategory,
  type PortfolioItemConfig,
} from '@/lib/digitalPortfolio'

type FilterKey = 'all' | PortfolioCategory

function getItemCopy(
  t: ReturnType<typeof useTranslations<'digitalCreations'>>,
  prefix: PortfolioItemConfig['i18nPrefix'],
) {
  const keys = {
    t1: { name: 't1Name', desc: 't1Desc', b1: 't1B1', b2: 't1B2', b3: 't1B3', cs: 't1CaseStudy' },
    t3: { name: 't3Name', desc: 't3Desc', b1: 't3B1', b2: 't3B2', b3: 't3B3', cs: 't3CaseStudy' },
    t4: { name: 't4Name', desc: 't4Desc', b1: 't4B1', b2: 't4B2', b3: 't4B3', cs: 't4CaseStudy' },
    t5: { name: 't5Name', desc: 't5Desc', b1: 't5B1', b2: 't5B2', b3: 't5B3', cs: 't5CaseStudy' },
    t6: { name: 't6Name', desc: 't6Desc', b1: 't6B1', b2: 't6B2', b3: 't6B3', cs: 't6CaseStudy' },
    t7: { name: 't7Name', desc: 't7Desc', b1: 't7B1', b2: 't7B2', b3: 't7B3', cs: 't7CaseStudy' },
    t8: { name: 't8Name', desc: 't8Desc', b1: 't8B1', b2: 't8B2', b3: 't8B3', cs: 't8CaseStudy' },
    t9: { name: 't9Name', desc: 't9Desc', b1: 't9B1', b2: 't9B2', b3: 't9B3', cs: 't9CaseStudy' },
  } as const
  const k = keys[prefix]
  return {
    name: t(k.name),
    desc: t(k.desc),
    bullets: [t(k.b1), t(k.b2), t(k.b3)],
    caseStudy: t(k.cs),
  }
}

function getItemTags(
  t: ReturnType<typeof useTranslations<'digitalCreations'>>,
  item: PortfolioItemConfig,
): string[] {
  if (!item.tagKeys) return []
  return item.tagKeys.map((key) => t(key as 't3Tag1'))
}

function categoryLabel(t: ReturnType<typeof useTranslations<'digitalCreations'>>, item: PortfolioItemConfig) {
  if (item.category === 'website') return t('categoryWebsite')
  if (item.i18nPrefix === 't4' || item.i18nPrefix === 't7') return t('categoryPlatformTool')
  return t('categoryPlatform')
}

function TagPills({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium px-2.5 py-0.5 border border-slate-200"
        >
          {tag}
        </span>
      ))}
    </div>
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
  const tags = getItemTags(t, item)
  const isWebsite = item.category === 'website'
  const primaryCta = isWebsite ? t('viewSite') : t('tryTool')

  return (
    <Reveal
      as="article"
      id={item.id}
      delayMs={index * 80}
      className="group h-full scroll-mt-28"
    >
      <div className="h-full bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-200 hover:border-primary/35 overflow-hidden flex flex-col hover:-translate-y-1">
        <div className="relative h-52 bg-slate-100 overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold z-10 ${
            isWebsite ? 'bg-primary/10 text-primary-dark border border-primary/20 backdrop-blur-sm' : 'bg-slate-800/90 text-white'
          }`}>
            {categoryLabel(t, item)}
          </div>
          {item.domain && (
            <span className="absolute bottom-3 left-3 text-[11px] font-medium text-white/90 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              {item.domain}
            </span>
          )}
        </div>

        <div className="p-6 flex flex-1 flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-2">{copy.name}</h3>
          <TagPills tags={tags} />
          <p className="text-slate-600 text-sm leading-relaxed mb-4">{copy.desc}</p>
          <ul className="space-y-2 mb-4">
            {copy.bullets.slice(0, 2).map((bullet, i) => (
              <li key={i} className="flex items-start text-sm text-slate-500">
                <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-primary/90 mb-4 italic border-l-2 border-primary/30 pl-3">{copy.caseStudy}</p>
          <div className="mt-auto flex flex-col gap-2">
            <a
              href={item.tryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-all text-sm"
            >
              {primaryCta}
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            <Link
              href={{ pathname: '/schedule', query: { service: item.contactService } }}
              className="inline-flex w-full items-center justify-center text-primary font-semibold py-2 px-4 rounded-lg text-sm border border-primary/30 hover:bg-primary/5 transition-colors"
            >
              {t('wantSomethingLike')}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

const DigitalCreations = () => {
  const t = useTranslations('digitalCreations')
  const tCommon = useTranslations('common')
  const [filter, setFilter] = useState<FilterKey>('all')

  const featured = portfolioItems.find((item) => item.featured)!
  const featuredCopy = getItemCopy(t, featured.i18nPrefix)
  const featuredTags = getItemTags(t, featured)

  const gridItems = useMemo(() => {
    if (filter === 'all') return getOrderedPortfolioItems({ excludeFeatured: true })
    return getOrderedPortfolioItems({ excludeFeatured: true, category: filter })
  }, [filter])

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: t('filterAll') },
    { key: 'website', label: t('filterWebsite') },
    { key: 'platform', label: t('filterPlatform') },
  ]

  const stats = [
    { value: t('statWebsitesValue'), label: t('statWebsitesLabel'), icon: Globe },
    { value: t('statPlatformsValue'), label: t('statPlatformsLabel'), icon: Layers },
    { value: t('statYearsValue'), label: t('statYearsLabel'), icon: Sparkles },
    { value: t('statLiveValue'), label: t('statLiveLabel'), icon: Rocket },
  ]

  return (
    <section id="portfolio" className="section-padding relative">
      <ServicePageHero
        variant="digital"
        className="!mb-14"
        eyebrow={t('portfolioTagline')}
        title={t('portfolioTitle')}
        subtitle={t('portfolioSubtitle')}
        subtitleHighlight={t('portfolioSubtitleHighlight')}
        journeyLine={t('heroJourneyLine')}
        stats={stats}
        statsNote={t('statsNote')}
        visual={
          <ConsultingHeroVisual
            icon={Sparkles}
            proofTitle={t('heroProofTitle')}
            proofSubtitle={t('heroProofSubtitle')}
            outcomes={[t('heroOutcome1'), t('heroOutcome2'), t('heroOutcome3')]}
          />
        }
        primaryCta={
          <ScheduleButton variant="primary" size="lg" icon>
            {t('scheduleCall')}
          </ScheduleButton>
        }
        secondaryCta={
          <Link href="/services/digital" className={serviceHeroSecondaryButtonClass}>
            {t('howWeDeliver')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        }
      />

      {/* Intro + jump nav */}
      <Reveal className="max-w-4xl mb-10">
        <p className="text-slate-600 leading-relaxed mb-6">{t('intro1')}</p>
        <ul className="grid sm:grid-cols-3 gap-3 mb-8">
          {[t('introBullet1'), t('introBullet2'), t('introBullet3')].map((bullet) => (
            <li key={bullet} className="flex items-start gap-2 text-slate-600 text-sm rounded-lg bg-slate-50 border border-slate-200 px-3 py-3">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-slate-600">
          {t('assessmentTieIn')}{' '}
          <Link href="/assessment" className="link-action font-medium">
            {t('assessmentLink')}
          </Link>{' '}
          {t('assessmentTieInSuffix')}
        </p>
      </Reveal>

      <nav aria-label={t('jumpNavLabel')} className="mb-14 rounded-xl border border-primary/15 bg-primary/[0.04] p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-3">{t('jumpNavLabel')}</p>
        <div className="flex flex-wrap gap-2.5">
          {getOrderedPortfolioItems().map((item) => {
            const copy = getItemCopy(t, item.i18nPrefix)
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg border-2 border-primary/35 bg-white px-4 py-2.5 text-sm font-semibold text-primary-dark shadow-sm hover:bg-primary hover:border-primary hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {copy.name}
                <ArrowDown className="w-4 h-4 shrink-0 opacity-80" aria-hidden />
              </a>
            )
          })}
        </div>
      </nav>

      {/* Featured case study */}
      {(filter === 'all' || filter === featured.category) && (
        <Reveal
          id={featured.id}
          className="mb-16 scroll-mt-28 rounded-2xl border border-primary/20 bg-gradient-to-br from-white via-slate-50 to-primary/5 overflow-hidden shadow-card"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-8 lg:p-10 flex flex-col justify-center order-2 lg:order-1">
              <span className="inline-flex w-fit items-center rounded-full bg-primary/10 text-primary-dark text-xs font-semibold px-3 py-1 mb-4 border border-primary/20">
                {t('featuredLabel')} · {categoryLabel(t, featured)}
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-3">{featuredCopy.name}</h2>
              <TagPills tags={featuredTags} />
              <p className="text-slate-600 leading-relaxed mb-4">{featuredCopy.desc}</p>
              <ul className="space-y-2 mb-5">
                {featuredCopy.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <p className="text-sm font-medium text-primary mb-6 border-l-2 border-primary pl-3">{featuredCopy.caseStudy}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={featured.tryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-5 rounded-lg text-sm transition-colors"
                >
                  {featured.category === 'website' ? t('viewSite') : t('tryTool')}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
                <Link
                  href={{ pathname: '/schedule', query: { service: featured.contactService } }}
                  className="inline-flex items-center text-primary font-semibold py-2.5 px-5 rounded-lg text-sm border border-primary/30 hover:bg-primary/5"
                >
                  {t('wantSomethingLike')}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="p-6 lg:p-8 bg-white order-1 lg:order-2 border-b lg:border-b-0 lg:border-l border-slate-200/80">
              <BrowserFrame
                imageUrl={featured.imageUrl}
                imageAlt={portfolioImageAlts[featured.id]}
                domain={featured.domain}
                priority
                className="h-full shadow-lg"
              />
            </div>
          </div>
        </Reveal>
      )}

      {/* Process pointer — detail lives on the service page */}
      <Reveal className="mb-16 rounded-xl border border-slate-200 bg-slate-50 px-6 py-5 lg:px-8">
        <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
          {t('buildStripDescShort')}{' '}
          <Link href="/services/digital" className="link-action font-semibold inline-flex items-center gap-1">
            {t('howWeDeliver')}
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </p>
      </Reveal>

      {/* Filter + grid header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">{t('gridTitle')}</h2>
          <p className="text-sm text-slate-500 mt-1">{t('gridSubtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Portfolio filter">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-primary/30'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {gridItems.map((item, index) => (
          <PortfolioCard key={item.id} item={item} t={t} index={index} />
        ))}
      </div>

      {gridItems.length === 0 && (
        <p className="text-center text-slate-500 mb-16">{t('noProjectsInCategory')}</p>
      )}

      <Reveal className="mb-16 rounded-lg border border-primary/15 bg-primary/[0.04] px-6 py-5 text-center">
        <p className="text-sm text-slate-700">
          {t('processTeaser')}{' '}
          <Link href="/services/digital" className="link-action font-semibold">
            {t('processLinkLabel')}
          </Link>
        </p>
      </Reveal>

      {/* CTA */}
      <Reveal
        id="digital-cta"
        className="bg-gradient-to-br from-primary via-primary-dark to-[#007a87] rounded-2xl p-10 md:p-16 text-center shadow-[0_25px_80px_rgba(0,180,197,0.25)] relative border border-primary/20 overflow-hidden"
      >
        <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
        <div className="relative z-10">
          <span className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white mb-4">
            {t('builtWithClients')}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">{t('ctaTitle')}</h2>
          <p className="text-xl text-white/95 mb-8 max-w-3xl mx-auto">{t('ctaSubtitle')}</p>
          <ScheduleButton variant="secondary" size="lg" className="bg-white text-primary-dark hover:bg-white/90 hover:scale-[1.03] transition-transform shadow-2xl">
            {t('scheduleCall')}
          </ScheduleButton>
          <p className="mt-5 text-sm text-white/90">
            {t('processTeaser')}{' '}
            <Link href="/services/digital" className="font-semibold text-white underline underline-offset-4 hover:text-white/80">
              {t('processLinkLabel')}
            </Link>
          </p>
        </div>
      </Reveal>
      <StickyMobileCTA label={t('scheduleCall')} sublabel={tCommon('ctaSubtext')} />
    </section>
  )
}

export default DigitalCreations
