'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import Reveal from '../motion/Reveal'
import { PillarBadge } from '../services/ServicePageSections'
import { PILLAR_BADGE_KEYS, type BrandPillar } from '@/lib/brand-journey'

const credKeys = ['cred1', 'cred2', 'cred3', 'cred4'] as const
const credPillars: Record<(typeof credKeys)[number], BrandPillar | 'all'> = {
  cred1: 'emerge',
  cred2: 'soar',
  cred3: 'all',
  cred4: 'transform',
}

export default function HomeTrustedBy() {
  const t = useTranslations('home.trustedBy')
  const tBrand = useTranslations('brandJourney')

  const items = credKeys.map((key) => ({
    title: t(`${key}Title`),
    desc: t(`${key}Desc`),
    pillar: credPillars[key],
  }))

  const pillarLabel = (pillar: BrandPillar | 'all') =>
    pillar === 'all' ? tBrand('pillarBadgeAll') : tBrand(PILLAR_BADGE_KEYS[pillar])

  return (
    <section className="py-12 lg:py-16 bg-white relative">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark mb-3">{tBrand('bandTitle')}</p>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-slate-600">{t('description')}</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {items.map((item, i) => (
            <Reveal
              key={item.title}
              delayMs={i * 60}
              className="rounded-xl border border-slate-200 bg-slate-50/80 p-5"
            >
              <div className="mb-2">
                <PillarBadge label={pillarLabel(item.pillar)} />
              </div>
              <h3 className="text-sm font-serif font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
