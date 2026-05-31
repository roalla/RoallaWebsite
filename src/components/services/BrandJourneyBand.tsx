'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import Reveal from '../motion/Reveal'
import { BRAND_PILLARS, PILLAR_SECTION_IDS, PILLAR_TITLE_KEYS, type BrandPillar } from '@/lib/brand-journey'

const PILLAR_DESC_KEYS: Record<BrandPillar, 'pillarTransformDesc' | 'pillarEmergeDesc' | 'pillarSoarDesc'> = {
  transform: 'pillarTransformDesc',
  emerge: 'pillarEmergeDesc',
  soar: 'pillarSoarDesc',
}

function PyramidAccent() {
  return (
    <div className="flex flex-col items-center gap-0.5 shrink-0" aria-hidden>
      <div className="h-2 w-6 rounded-sm bg-primary/70" />
      <div className="h-2.5 w-10 rounded-sm bg-primary/55" />
      <div className="h-3 w-14 rounded-sm bg-primary/40" />
    </div>
  )
}

function ButterflyAccent() {
  return (
    <svg
      className="w-10 h-10 text-primary/50 shrink-0"
      viewBox="0 0 40 40"
      fill="currentColor"
      aria-hidden
    >
      <ellipse cx="12" cy="18" rx="10" ry="12" opacity="0.55" />
      <ellipse cx="28" cy="18" rx="10" ry="12" opacity="0.55" />
      <ellipse cx="20" cy="26" rx="2.5" ry="10" opacity="0.75" />
    </svg>
  )
}

export default function BrandJourneyBand() {
  const t = useTranslations('brandJourney')

  return (
    <Reveal className="mb-10 rounded-2xl border border-slate-300 bg-gradient-to-br from-white via-slate-50/80 to-primary/[0.04] px-6 py-8 lg:px-10 lg:py-10 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
        <div className="flex items-start gap-4 lg:max-w-xs shrink-0">
          <div className="flex items-center gap-3">
            <PyramidAccent />
            <ButterflyAccent />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-serif font-bold text-slate-900 tracking-tight">{t('bandTitle')}</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t('bandSubtitle')}</p>
          </div>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 list-none p-0 m-0">
          {BRAND_PILLARS.map((pillar, i) => (
            <li key={pillar}>
              <a
                href={`#${PILLAR_SECTION_IDS[pillar]}`}
                className="group flex flex-col h-full rounded-xl border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all duration-200"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-dark mb-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-serif font-bold text-slate-900 group-hover:text-primary-dark transition-colors">
                  {t(PILLAR_TITLE_KEYS[pillar])}
                </span>
                <span className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">{t(PILLAR_DESC_KEYS[pillar])}</span>
                <span className="mt-3 text-xs font-medium text-primary-dark opacity-0 group-hover:opacity-100 transition-opacity">
                  ↓ {t(PILLAR_TITLE_KEYS[pillar])}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  )
}
