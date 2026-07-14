'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
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
import { Link, useRouter } from '@/i18n/navigation'
import ScheduleButton from './ScheduleButton'
import StickyMobileCTA from './StickyMobileCTA'
import BrowserFrame from './digital/BrowserFrame'
import {
  ServicePageHero,
  serviceHeroSecondaryButtonClass,
} from './services/ServicePageSections'
import {
  getOrderedPortfolioItems,
  getFeaturedItems,
  buildPortfolioScheduleQuery,
  portfolioVerticals,
  portfolioIndustryCategories,
  getPortfolioItem,
  portfolioImageAlts,
  portfolioHeroLiveChipIds,
  portfolioCuratedPaths,
  type PortfolioCategory,
  type PortfolioItemConfig,
  type PortfolioIndustryCategoryConfig,
  type PortfolioVerticalConfig,
} from '@/lib/digitalPortfolio'
import { isCaseStudySlug } from '@/lib/portfolio-case-studies'

type FilterKey = 'all' | PortfolioCategory

const primaryBtnClass =
  'inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg text-sm transition-colors shadow-sm'
const cardPrimaryBtnClass =
  'inline-flex w-full items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-all text-sm'
const cardSecondaryBtnClass =
  'inline-flex w-full items-center justify-center text-slate-700 font-semibold py-2 px-4 rounded-lg text-sm border border-slate-200 hover:bg-slate-50 transition-colors'

const CURATED_COPY = {
  'marketing-site': { title: 'curatedMarketingTitle', desc: 'curatedMarketingDesc' },
  'custom-platform': { title: 'curatedPlatformTitle', desc: 'curatedPlatformDesc' },
  education: { title: 'curatedEducationTitle', desc: 'curatedEducationDesc' },
} as const

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
    t10: { name: 't10Name', desc: 't10Desc', b1: 't10B1', b2: 't10B2', b3: 't10B3', cs: 't10CaseStudy' },
    t11: { name: 't11Name', desc: 't11Desc', b1: 't11B1', b2: 't11B2', b3: 't11B3', cs: 't11CaseStudy' },
    t12: { name: 't12Name', desc: 't12Desc', b1: 't12B1', b2: 't12B2', b3: 't12B3', cs: 't12CaseStudy' },
    t13: { name: 't13Name', desc: 't13Desc', b1: 't13B1', b2: 't13B2', b3: 't13B3', cs: 't13CaseStudy' },
    t14: { name: 't14Name', desc: 't14Desc', b1: 't14B1', b2: 't14B2', b3: 't14B3', cs: 't14CaseStudy' },
    t15: { name: 't15Name', desc: 't15Desc', b1: 't15B1', b2: 't15B2', b3: 't15B3', cs: 't15CaseStudy' },
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
  if (item.i18nPrefix === 't4' || item.i18nPrefix === 't7' || item.i18nPrefix === 't13' || item.i18nPrefix === 't14') {
    return t('categoryPlatformTool')
  }
  return t('categoryPlatform')
}

function projectTypeLabel(
  t: ReturnType<typeof useTranslations<'digitalCreations'>>,
  projectType: PortfolioItemConfig['projectType'],
) {
  if (projectType === 'client') return t('projectBadgeClient')
  if (projectType === 'roalla-product') return t('projectBadgeRoallaProduct')
  return t('projectBadgeRoallaSite')
}

function liveCtaLabel(t: ReturnType<typeof useTranslations<'digitalCreations'>>, item: PortfolioItemConfig) {
  return item.category === 'website' ? t('viewSite') : t('tryTool')
}

function ProjectTypeBadge({
  t,
  projectType,
}: {
  t: ReturnType<typeof useTranslations<'digitalCreations'>>
  projectType: PortfolioItemConfig['projectType']
}) {
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium px-2.5 py-0.5 border border-slate-200 mb-3">
      {projectTypeLabel(t, projectType)}
    </span>
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

function PortfolioSupplementBanner({ t }: { t: ReturnType<typeof useTranslations<'digitalCreations'>> }) {
  return (
    <Reveal className="mb-10 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/[0.06] via-white to-slate-50 px-5 py-4 sm:px-6 sm:py-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-1">{t('portfolioSupplementEyebrow')}</p>
      <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
        {t('portfolioSupplementDesc')}{' '}
        <Link href="/services/digital" className="link-action font-semibold inline-flex items-center gap-1">
          {t('portfolioSupplementLink')}
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </p>
    </Reveal>
  )
}

function CuratedPathsSection({ t }: { t: ReturnType<typeof useTranslations<'digitalCreations'>> }) {
  return (
    <Reveal className="mb-10">
      <h2 className="text-xl font-serif font-bold text-slate-900 mb-1">{t('startHereTitle')}</h2>
      <p className="text-sm text-slate-600 mb-5">{t('startHereSubtitle')}</p>
      <div className="grid md:grid-cols-3 gap-4">
        {portfolioCuratedPaths.map((path) => {
          const copy = CURATED_COPY[path.id]
          const leadItem = getPortfolioItem(path.itemIds[0])
          return (
            <div
              key={path.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col"
            >
              <h3 className="font-semibold text-slate-900">{t(copy.title)}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">{t(copy.desc)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {path.itemIds.map((itemId) => {
                  const item = getPortfolioItem(itemId)
                  if (!item) return null
                  const itemCopy = getItemCopy(t, item.i18nPrefix)
                  return (
                    <a
                      key={itemId}
                      href={item.tryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-primary/40 hover:bg-primary/5 hover:text-primary-dark transition-colors"
                    >
                      {itemCopy.name}
                    </a>
                  )
                })}
              </div>
              {leadItem ? (
                <a
                  href={leadItem.tryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 ${primaryBtnClass} text-sm py-2.5`}
                >
                  {t('openLiveExample')}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              ) : null}
            </div>
          )
        })}
      </div>
    </Reveal>
  )
}

function FeaturedCaseStudy({
  item,
  t,
  compact,
}: {
  item: PortfolioItemConfig
  t: ReturnType<typeof useTranslations<'digitalCreations'>>
  compact?: boolean
}) {
  const copy = getItemCopy(t, item.i18nPrefix)
  const tags = getItemTags(t, item)
  const scheduleQuery = buildPortfolioScheduleQuery(item)
  const liveCta = liveCtaLabel(t, item)

  return (
    <Reveal
      id={item.id}
      className="mb-10 scroll-mt-28 rounded-2xl border border-primary/20 bg-gradient-to-br from-white via-slate-50 to-primary/5 overflow-hidden shadow-card"
    >
      <div className="grid lg:grid-cols-2 gap-0">
        <div className="p-8 lg:p-10 flex flex-col justify-center order-2 lg:order-1">
          <span className="inline-flex w-fit items-center rounded-full bg-primary/10 text-primary-dark text-xs font-semibold px-3 py-1 mb-4 border border-primary/20">
            {t('featuredLabel')} · {categoryLabel(t, item)}
          </span>
          <ProjectTypeBadge t={t} projectType={item.projectType} />
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-3">{copy.name}</h2>
          <TagPills tags={tags} />
          <p className="text-slate-600 leading-relaxed mb-4">{copy.desc}</p>
          {!compact && (
            <ul className="space-y-2 mb-5">
              {copy.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}
          <p className="text-sm font-medium text-primary mb-6 border-l-2 border-primary pl-3">{copy.caseStudy}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={item.tryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={primaryBtnClass}
            >
              {liveCta}
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            {isCaseStudySlug(item.id) ? (
              <Link
                href={{ pathname: '/services/portfolio/[slug]', params: { slug: item.id } }}
                className="inline-flex items-center text-slate-700 font-semibold py-2.5 px-5 rounded-lg text-sm border border-slate-200 hover:bg-slate-50"
              >
                {t('viewCaseStudy')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            ) : null}
            <Link
              href={{ pathname: '/schedule', query: scheduleQuery }}
              className="inline-flex items-center text-primary font-semibold py-2.5 px-5 rounded-lg text-sm border border-primary/30 hover:bg-primary/5"
            >
              {t('discussBuildLike')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          {compact ? (
            <p className="mt-4 text-xs text-slate-500">{t('featuredMoreInGrid')}</p>
          ) : null}
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

function IndustryCategoryBand({
  category,
  t,
}: {
  category: PortfolioIndustryCategoryConfig
  t: ReturnType<typeof useTranslations<'digitalCreations'>>
}) {
  const titleKey = `${category.i18nPrefix}Title` as 'industryFleetTitle'
  const descKey = `${category.i18nPrefix}Desc` as 'industryFleetDesc'
  const scheduleQuery = buildPortfolioScheduleQuery(category)
  const anchorId = category.sectionAnchor ?? `industry-${category.id}`
  const leadItem = getPortfolioItem(category.itemIds[0])

  return (
    <Reveal
      id={anchorId}
      className="mb-6 scroll-mt-28 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-lg font-serif font-bold text-slate-900 mb-1">{t(titleKey)}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{t(descKey)}</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {leadItem ? (
            <a
              href={leadItem.tryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
            >
              {t('openLiveExample')}
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          ) : null}
          <Link
            href={{ pathname: '/schedule', query: scheduleQuery }}
            className="inline-flex items-center text-primary font-semibold py-2 px-4 rounded-lg text-sm border border-primary/30 hover:bg-primary/5 transition-colors"
          >
            {t('discussIndustryBuild')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {category.itemIds.map((itemId) => {
          const item = getPortfolioItem(itemId)
          if (!item) return null
          const copy = getItemCopy(t, item.i18nPrefix)
          return (
            <div key={itemId} className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
              <a
                href={item.tryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 hover:bg-primary/5 hover:text-primary-dark transition-colors"
              >
                {copy.name}
                <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-70" aria-hidden />
              </a>
              <a
                href={`#${itemId}`}
                className="inline-flex items-center border-l border-slate-200 px-2.5 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-primary-dark transition-colors"
              >
                {t('jumpToCard')}
              </a>
            </div>
          )
        })}
      </div>
    </Reveal>
  )
}

function FleetVerticalSection({
  vertical,
  t,
}: {
  vertical: PortfolioVerticalConfig
  t: ReturnType<typeof useTranslations<'digitalCreations'>>
}) {
  const [websiteId, platformId] = vertical.itemIds
  const website = getPortfolioItem(websiteId)!
  const platform = getPortfolioItem(platformId)!
  const websiteCopy = getItemCopy(t, website.i18nPrefix)
  const platformCopy = getItemCopy(t, platform.i18nPrefix)
  const scheduleQuery = buildPortfolioScheduleQuery(vertical)

  return (
    <Reveal id="fleet-vertical" className="mb-16 scroll-mt-28 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-primary/[0.04] p-6 lg:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{t('verticalFleetEyebrow')}</p>
      <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-900 mb-2">{t('verticalFleetTitle')}</h2>
      <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-3xl">{t('verticalFleetDesc')}</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <BrowserFrame
            imageUrl={website.imageUrl}
            imageAlt={portfolioImageAlts[website.id]}
            domain={website.domain}
            href={website.tryUrl}
            openLabel={t('openLiveSite')}
            className="rounded-none border-0 shadow-none"
          />
          <div className="p-4">
            <p className="text-xs font-medium text-primary-dark mb-1">{t('verticalFleetWebsiteRole')}</p>
            <p className="font-semibold text-slate-900">{websiteCopy.name}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a href={website.tryUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                {t('openLiveSite')}
                <ExternalLink className="w-3 h-3" />
              </a>
              <a href={`#${website.id}`} className="text-xs font-semibold text-slate-600 hover:underline">
                {t('jumpToCard')}
              </a>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <BrowserFrame
            imageUrl={platform.imageUrl}
            imageAlt={portfolioImageAlts[platform.id]}
            domain={platform.domain}
            href={platform.tryUrl}
            openLabel={t('openLiveSite')}
            className="rounded-none border-0 shadow-none"
          />
          <div className="p-4">
            <p className="text-xs font-medium text-primary-dark mb-1">{t('verticalFleetPlatformRole')}</p>
            <p className="font-semibold text-slate-900">{platformCopy.name}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a href={platform.tryUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                {t('openLiveSite')}
                <ExternalLink className="w-3 h-3" />
              </a>
              <a href={`#${platform.id}`} className="text-xs font-semibold text-slate-600 hover:underline">
                {t('jumpToCard')}
              </a>
            </div>
          </div>
        </div>
      </div>
      <Link
        href={{ pathname: '/schedule', query: scheduleQuery }}
        className="inline-flex items-center text-primary font-semibold py-2.5 px-5 rounded-lg text-sm border border-primary/30 hover:bg-primary/5 transition-colors"
      >
        {t('verticalFleetCta')}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </Reveal>
  )
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
  const liveCta = liveCtaLabel(t, item)
  const scheduleQuery = buildPortfolioScheduleQuery(item)

  return (
    <Reveal
      as="article"
      id={item.id}
      delayMs={index * 80}
      className="group h-full scroll-mt-28"
    >
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
          <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold z-10 ${
            item.category === 'website' ? 'bg-primary/10 text-primary-dark border border-primary/20 backdrop-blur-sm' : 'bg-slate-800/90 text-white'
          }`}>
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

        <div className="p-6 flex flex-1 flex-col">
          <ProjectTypeBadge t={t} projectType={item.projectType} />
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
              className={cardPrimaryBtnClass}
            >
              {liveCta}
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            {isCaseStudySlug(item.id) ? (
              <Link
                href={{ pathname: '/services/portfolio/[slug]', params: { slug: item.id } }}
                className={cardSecondaryBtnClass}
              >
                {t('viewCaseStudy')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            ) : null}
            <Link
              href={{ pathname: '/schedule', query: scheduleQuery }}
              className="inline-flex w-full items-center justify-center text-primary font-semibold py-2 px-4 rounded-lg text-sm border border-primary/30 hover:bg-primary/5 transition-colors"
            >
              {t('discussBuildLike')}
              <ArrowRight className="w-4 h-4 ml-2" />
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
  const searchParams = useSearchParams()
  const router = useRouter()
  const [filter, setFilter] = useState<FilterKey>('all')

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'website') setFilter('website')
    else if (type === 'platform') setFilter('platform')
    else setFilter('all')
  }, [searchParams])

  const updateFilter = useCallback(
    (key: FilterKey) => {
      setFilter(key)
      router.replace(
        key === 'all'
          ? '/services/portfolio'
          : { pathname: '/services/portfolio', query: { type: key } },
        { scroll: false },
      )
    },
    [router],
  )

  const featuredItems = useMemo(() => {
    const items = filter === 'all' ? getFeaturedItems() : getFeaturedItems(filter)
    if (filter === 'all' && items.length > 0) return [items[0]]
    return items
  }, [filter])

  const gridItems = useMemo(() => {
    if (filter === 'all') return getOrderedPortfolioItems({ excludeFeatured: true })
    return getOrderedPortfolioItems({ excludeFeatured: true, category: filter })
  }, [filter])

  const fleetVertical = portfolioVerticals[0]

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
        className="!mb-10"
        eyebrow={t('portfolioTagline')}
        title={t('portfolioTitle')}
        subtitle={t('portfolioSubtitle')}
        subtitleHighlight={t('portfolioSubtitleHighlight')}
        journeyLine={t('heroJourneyLine')}
        stats={stats}
        statsNote={t('statsNote')}
        visual={<LiveDomainChips t={t} />}
        primaryCta={
          <a href="#all-examples" className={primaryBtnClass}>
            {t('browseLiveExamples')}
            <ArrowDown className="ml-2 w-4 h-4" />
          </a>
        }
        secondaryCta={
          <ScheduleButton variant="secondary" size="lg" className="border-white/30 text-white hover:bg-white/10">
            {tCommon('scheduleConsultation')}
          </ScheduleButton>
        }
        tertiaryLink={{ href: '/services/digital', label: t('portfolioSupplementLink') }}
      />

      <PortfolioSupplementBanner t={t} />

      <CuratedPathsSection t={t} />

      <nav
        aria-label={t('jumpNavLabel')}
        className="sticky top-20 z-20 mb-8 rounded-xl border border-primary/15 bg-white/95 backdrop-blur-md p-5 sm:p-6 shadow-sm"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-1">{t('jumpNavLabel')}</p>
        <p className="text-sm text-slate-600 mb-4">{t('jumpNavHint')}</p>
        <div className="flex flex-wrap gap-2.5">
          {portfolioIndustryCategories.map((category) => {
            const titleKey = `${category.i18nPrefix}Title` as 'industryFleetTitle'
            const anchor = category.sectionAnchor ?? `industry-${category.id}`
            return (
              <a
                key={category.id}
                href={`#${anchor}`}
                className="inline-flex items-center gap-1.5 rounded-lg border-2 border-primary/35 bg-white px-4 py-2.5 text-sm font-semibold text-primary-dark shadow-sm hover:bg-primary hover:border-primary hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t(titleKey)}
                <ArrowDown className="w-4 h-4 shrink-0 opacity-80" aria-hidden />
              </a>
            )
          })}
        </div>
      </nav>

      <div id="all-examples" className="scroll-mt-28 mb-8">
        <div className="sticky top-[5.75rem] z-10 -mx-1 mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-md px-4 py-4 sm:px-5 shadow-sm">
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
                onClick={() => updateFilter(f.key)}
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
      </div>

      {featuredItems.length > 0 && (
        <div className="mb-16">
          {featuredItems.map((item) => (
            <FeaturedCaseStudy key={item.id} item={item} t={t} compact={filter === 'all'} />
          ))}
        </div>
      )}

      {filter === 'all' && fleetVertical && (
        <FleetVerticalSection vertical={fleetVertical} t={t} />
      )}

      <div className="mb-14 space-y-0">
        {portfolioIndustryCategories
          .filter((category) => category.id !== 'fleet-logistics')
          .map((category) => (
            <IndustryCategoryBand key={category.id} category={category} t={t} />
          ))}
      </div>

      <Reveal className="mb-16 rounded-xl border border-slate-200 bg-slate-50 px-6 py-5 lg:px-8">
        <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
          {t('buildStripDescShort')}{' '}
          <Link href="/services/digital" className="link-action font-semibold inline-flex items-center gap-1">
            {t('howWeDeliver')}
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </p>
      </Reveal>

      <Reveal className="mb-16 rounded-lg border border-slate-200 bg-slate-50 px-6 py-5 text-center">
        <p className="text-sm text-slate-600">
          {t('assessmentTieIn')}{' '}
          <Link href="/assessment" className="link-action font-medium">
            {t('assessmentLink')}
          </Link>{' '}
          {t('assessmentTieInSuffix')}
        </p>
      </Reveal>

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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <ScheduleButton variant="secondary" size="lg" className="bg-white text-primary-dark hover:bg-white/90 hover:scale-[1.03] transition-transform shadow-2xl">
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

      <StickyMobileCTA
        anchorHref="#all-examples"
        label={t('stickyBrowseLabel')}
        sublabel={t('openLiveSiteHint')}
      />
    </section>
  )
}

export default DigitalCreations
