'use client'

import React from 'react'
import { ArrowRight, Compass, Layers, Sparkles, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'
import { ButterflyAccent } from '../brand/BrandAccents'
import { BRAND_PILLARS, PILLAR_TITLE_KEYS, type BrandPillar } from '@/lib/brand-journey'

const PHASE_ICONS = {
  prepare: Compass,
  transform: Layers,
  emerge: Sparkles,
  soar: TrendingUp,
} as const

const PHASE_DESC_KEYS = {
  prepare: 'prepareDesc',
  transform: 'transformDesc',
  emerge: 'emergeDesc',
  soar: 'soarDesc',
} as const satisfies Record<BrandPillar, 'prepareDesc' | 'transformDesc' | 'emergeDesc' | 'soarDesc'>

export default function HomeDeliveryPhases() {
  const t = useTranslations('home.deliveryPhases')
  const tBrand = useTranslations('brandJourney')

  return (
    <Reveal className="mb-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50/80 to-primary/[0.04] p-6 lg:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
        <ButterflyAccent className="w-9 h-9 text-primary/45 shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-serif font-bold text-slate-900">{t('title')}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-2xl">{t('description')}</p>
        </div>
        <Link
          href="/services/digital"
          className="inline-flex items-center shrink-0 text-sm font-semibold text-primary-dark hover:underline sm:mt-1"
        >
          {t('linkLabel')}
          <ArrowRight className="ml-1.5 w-4 h-4" aria-hidden />
        </Link>
      </div>

      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 list-none p-0 m-0">
        {BRAND_PILLARS.map((pillar, index) => {
          const Icon = PHASE_ICONS[pillar]
          return (
            <li
              key={pillar}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-primary/30 hover:shadow-card transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-dark">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Icon className="w-4 h-4 text-primary" aria-hidden />
              </div>
              <p className="font-serif font-bold text-slate-900">{tBrand(PILLAR_TITLE_KEYS[pillar])}</p>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">{t(PHASE_DESC_KEYS[pillar])}</p>
            </li>
          )
        })}
      </ol>
    </Reveal>
  )
}
