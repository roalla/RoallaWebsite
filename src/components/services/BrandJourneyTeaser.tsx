'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'
import { BRAND_PILLARS, PILLAR_SECTION_IDS, PILLAR_TITLE_KEYS } from '@/lib/brand-journey'

type BrandJourneyTeaserProps = {
  titleKey: 'aboutJourneyTitle'
  descKey: 'aboutJourneyDesc'
  ctaKey: 'aboutJourneyCta'
  className?: string
}

/** Compact Prepare → Transform → Emerge → Soar strip for homepage and about. */
export function BrandJourneyTeaser({ titleKey, descKey, ctaKey, className = '' }: BrandJourneyTeaserProps) {
  const t = useTranslations('brandJourney')

  return (
    <Reveal
      className={`rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] via-white to-slate-50 px-6 py-6 lg:px-8 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark mb-2">{t('bandTitle')}</p>
      <h3 className="text-lg font-serif font-bold text-slate-900">{t(titleKey)}</h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-3xl">{t(descKey)}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {BRAND_PILLARS.map((pillar) => (
          <Link
            key={pillar}
            href={{ pathname: '/services', hash: PILLAR_SECTION_IDS[pillar] }}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-800 hover:border-primary hover:text-primary-dark transition-colors"
          >
            {t(PILLAR_TITLE_KEYS[pillar])}
          </Link>
        ))}
      </div>
      <Link
        href="/services"
        className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
      >
        {t(ctaKey)}
        <ArrowRight className="ml-1.5 w-4 h-4" />
      </Link>
    </Reveal>
  )
}

/** One-line teaser under homepage “What we do”. */
export function HomeBrandJourneyTeaser() {
  const t = useTranslations('brandJourney')

  return (
    <Reveal className="mt-8 mb-8 rounded-xl border border-slate-200 bg-white px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p className="text-sm text-slate-700 leading-relaxed">
        <span className="font-serif font-bold text-slate-900">{t('bandTitle')}</span>
        <span className="text-slate-500"> — </span>
        {t('homeTeaser')}
      </p>
      <Link
        href="/services"
        className="inline-flex items-center shrink-0 text-sm font-semibold text-primary-dark hover:underline"
      >
        {t('exploreApproach')}
        <ArrowRight className="ml-1.5 w-4 h-4" />
      </Link>
    </Reveal>
  )
}
