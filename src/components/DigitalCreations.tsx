'use client'

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ExternalLink, ArrowRight, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import ScheduleButton from './CalendlyButton'
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

function categoryLabel(t: ReturnType<typeof useTranslations<'digitalCreations'>>, item: PortfolioItemConfig) {
  if (item.category === 'website') return t('categoryWebsite')
  if (item.i18nPrefix === 't4') return t('categoryPlatformTool')
  return t('categoryPlatform')
}

function PortfolioCard({
  item,
  t,
  index,
  compact = false,
}: {
  item: PortfolioItemConfig
  t: ReturnType<typeof useTranslations<'digitalCreations'>>
  index: number
  compact?: boolean
}) {
  const copy = getItemCopy(t, item.i18nPrefix)
  const isWebsite = item.category === 'website'
  const primaryCta = isWebsite ? t('viewSite') : t('tryTool')

  return (
    <motion.article
      id={item.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`group h-full bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-200 hover:border-primary/35 overflow-hidden flex flex-col ${compact ? '' : ''}`}
    >
      <div className={`relative ${compact ? 'h-44' : 'h-52'} bg-slate-100 overflow-hidden`}>
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
            className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : null}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold z-10 ${
          isWebsite ? 'bg-primary/10 text-primary-dark border border-primary/20' : 'bg-slate-800/90 text-white'
        }`}>
          {categoryLabel(t, item)}
        </div>
      </div>

      <div className="p-6 flex flex-1 flex-col">
        <h3 className="text-lg font-bold text-slate-900 mb-2">{copy.name}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">{copy.desc}</p>
        {!compact && (
          <ul className="space-y-2 mb-4">
            {copy.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start text-sm text-slate-500">
                <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-primary/90 mb-4 italic">{copy.caseStudy}</p>
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
            href={{ pathname: '/contact', query: { service: item.contactService } }}
            className="inline-flex w-full items-center justify-center text-primary font-semibold py-2 px-4 rounded-lg text-sm border border-primary/30 hover:bg-primary/5 transition-colors"
          >
            {t('wantSomethingLike')}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

const DigitalCreations = () => {
  const t = useTranslations('digitalCreations')
  const [filter, setFilter] = useState<FilterKey>('all')

  const featured = portfolioItems.find((item) => item.featured)!
  const featuredCopy = getItemCopy(t, featured.i18nPrefix)

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

  return (
    <section id="digital-creations" className="section-padding bg-white py-20 lg:py-28 relative">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-12"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">{t('portfolioTagline')}</p>
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-slate-900 mb-4">{t('portfolioTitle')}</h2>
          <p className="text-lg text-slate-600 leading-relaxed">{t('portfolioSubtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mb-14"
        >
          <p className="text-slate-600 leading-relaxed mb-6">{t('intro1')}</p>
          <ul className="space-y-2 mb-6">
            {[t('introBullet1'), t('introBullet2'), t('introBullet3')].map((bullet) => (
              <li key={bullet} className="flex items-center gap-2 text-slate-600 text-sm">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                {bullet}
              </li>
            ))}
          </ul>
          <Link href="/services/digital" className="inline-flex items-center text-primary font-semibold hover:underline">
            {t('bridgeCta')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </motion.div>

        {/* Featured case study — Ken Effect */}
        {(filter === 'all' || filter === 'website') && (
          <motion.div
            id={featured.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-card"
          >
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-10 flex flex-col justify-center order-2 lg:order-1">
                <span className="inline-flex w-fit items-center rounded-full bg-primary/10 text-primary-dark text-xs font-semibold px-3 py-1 mb-4 border border-primary/20">
                  {t('featuredLabel')} · {t('categoryWebsite')}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-3">{featuredCopy.name}</h3>
                <p className="text-slate-600 leading-relaxed mb-4">{featuredCopy.desc}</p>
                <p className="text-sm text-primary/90 italic mb-6">{featuredCopy.caseStudy}</p>
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
                    href="/services/digital"
                    className="inline-flex items-center text-primary font-semibold py-2.5 px-5 rounded-lg text-sm border border-primary/30 hover:bg-primary/5"
                  >
                    {t('exploreDigitalBuilds')}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              <div className="p-6 lg:p-8 bg-white order-1 lg:order-2">
                <BrowserFrame
                  imageUrl={featured.imageUrl}
                  imageAlt={portfolioImageAlts[featured.id]}
                  priority
                  className="h-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Portfolio filter">
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

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {gridItems.map((item, index) => (
            <PortfolioCard key={item.id} item={item} t={t} index={index} />
          ))}
        </div>

        {gridItems.length === 0 && (
          <p className="text-center text-slate-500 mb-16">{t('noProjectsInCategory')}</p>
        )}

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
            <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-4">{t('ctaTitle')}</h3>
            <p className="text-xl text-white/95 mb-8 max-w-3xl mx-auto">{t('ctaSubtitle')}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ScheduleButton variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-[1.03] transition-transform shadow-2xl">
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
      </div>
    </section>
  )
}

export default DigitalCreations
