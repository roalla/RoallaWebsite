'use client'

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  ExternalLink,
  ArrowRight,
  CheckCircle,
  Globe,
  Layers,
  Rocket,
  Palette,
  Hammer,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import ScheduleButton from './ScheduleButton'
import StickyMobileCTA from './StickyMobileCTA'
import BrowserFrame from './digital/BrowserFrame'
import {
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
  if (item.i18nPrefix === 't4') return t('categoryPlatformTool')
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
    <motion.article
      id={item.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
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
    </motion.article>
  )
}

const buildStepIcons = [Palette, Hammer, Rocket] as const

const DigitalCreations = () => {
  const t = useTranslations('digitalCreations')
  const [filter, setFilter] = useState<FilterKey>('all')

  const featured = portfolioItems.find((item) => item.featured)!
  const featuredCopy = getItemCopy(t, featured.i18nPrefix)
  const featuredTags = getItemTags(t, featured)

  const gridItems = useMemo(() => {
    const rest = portfolioItems.filter((item) => !item.featured)
    if (filter === 'all') return rest
    return rest.filter((item) => item.category === filter)
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

  const buildSteps = ['buildStep1', 'buildStep2', 'buildStep3'] as const

  return (
    <section id="digital-creations" className="section-padding relative">
      {/* Hero band */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-primary/5 px-6 py-10 lg:px-12 lg:py-14 mb-14 shadow-card">
        <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-12 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">{t('portfolioTagline')}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-slate-900 leading-tight">
            {t('portfolioTitle')}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl">{t('portfolioSubtitle')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ScheduleButton variant="primary" size="sm" className="!py-2.5 !px-5">
              {t('scheduleCall')}
            </ScheduleButton>
            <Link
              href="/services/digital"
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold px-5 py-2.5 text-sm hover:border-primary/40 hover:text-primary transition-colors"
            >
              {t('exploreDigitalBuilds')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-sm px-4 py-4 text-center"
            >
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" aria-hidden />
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        <p className="relative mt-4 text-sm text-slate-500 text-center max-w-2xl mx-auto">{t('statsNote')}</p>
      </div>

      {/* Intro + jump nav */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mb-10"
      >
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
      </motion.div>

      <nav aria-label={t('jumpNavLabel')} className="mb-14">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{t('jumpNavLabel')}</p>
        <div className="flex flex-wrap gap-2">
          {portfolioItems.map((item) => {
            const copy = getItemCopy(t, item.i18nPrefix)
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-primary/40 hover:text-primary transition-colors"
              >
                {copy.name}
              </a>
            )
          })}
        </div>
      </nav>

      {/* Featured case study */}
      {(filter === 'all' || filter === 'website') && (
        <motion.div
          id={featured.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 scroll-mt-28 rounded-2xl border border-primary/20 bg-gradient-to-br from-white via-slate-50 to-primary/5 overflow-hidden shadow-card"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-8 lg:p-10 flex flex-col justify-center order-2 lg:order-1">
              <span className="inline-flex w-fit items-center rounded-full bg-primary/10 text-primary-dark text-xs font-semibold px-3 py-1 mb-4 border border-primary/20">
                {t('featuredLabel')} · {t('categoryWebsite')}
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
                  {t('viewSite')}
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
        </motion.div>
      )}

      {/* Build capability strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 rounded-2xl border border-slate-200 bg-white p-6 lg:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">{t('buildStripEyebrow')}</p>
            <h2 className="text-2xl font-serif font-bold text-slate-900">{t('buildStripTitle')}</h2>
            <p className="mt-2 text-slate-600 max-w-2xl">{t('buildStripDesc')}</p>
          </div>
          <Link href="/services/digital" className="inline-flex items-center text-primary font-semibold text-sm hover:underline shrink-0">
            {t('exploreDigitalBuilds')}
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {buildSteps.map((key, i) => {
            const Icon = buildStepIcons[i]
            return (
              <div key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900">{t(`${key}Title` as 'buildStep1Title')}</h3>
                <p className="mt-1 text-sm text-slate-600">{t(`${key}Desc` as 'buildStep1Desc')}</p>
              </div>
            )
          })}
        </div>
      </motion.div>

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

      {/* Deliverables strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:p-8"
      >
        <h2 className="text-xl font-serif font-bold text-slate-900 mb-2">{t('deliverablesTitle')}</h2>
        <p className="text-slate-600 text-sm mb-6 max-w-2xl">{t('deliverablesDesc')}</p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[t('deliverable1'), t('deliverable2'), t('deliverable3'), t('deliverable4')].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-700 bg-white rounded-lg border border-slate-200 px-3 py-3">
              <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* CTA */}
      <motion.div
        id="digital-cta"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-primary via-primary-dark to-[#007a87] rounded-2xl p-10 md:p-16 text-center shadow-[0_25px_80px_rgba(0,180,197,0.25)] relative border border-primary/20 overflow-hidden"
      >
        <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
        <div className="relative z-10">
          <span className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white mb-4">
            {t('builtWithClients')}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">{t('ctaTitle')}</h2>
          <p className="text-xl text-white/95 mb-8 max-w-3xl mx-auto">{t('ctaSubtitle')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ScheduleButton variant="secondary" size="lg" className="bg-white text-primary-dark hover:bg-white/90 hover:scale-[1.03] transition-transform shadow-2xl">
              {t('scheduleCall')}
            </ScheduleButton>
            <Link
              href="/services/digital"
              className="inline-flex items-center justify-center bg-white/15 hover:bg-white/25 text-white font-semibold py-4 px-8 rounded-lg border-2 border-white/30 transition-all"
            >
              {t('exploreDigitalBuilds')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </motion.div>
      <StickyMobileCTA label={t('scheduleCall')} />
    </section>
  )
}

export default DigitalCreations
