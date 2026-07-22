'use client'

import React from 'react'
import { Binoculars, ChartNoAxesCombined, HeartHandshake, Settings2, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Reveal from '../motion/Reveal'

const outcomes = [
  { key: 'found', icon: Binoculars },
  { key: 'customers', icon: HeartHandshake },
  { key: 'products', icon: Sparkles },
  { key: 'operations', icon: Settings2 },
  { key: 'growth', icon: ChartNoAxesCombined },
] as const

export default function HomeBusinessOutcomes() {
  const t = useTranslations('home.businessOutcomes')

  return (
    <section id="business-outcomes" className="relative bg-white py-16 lg:py-24 scroll-mt-24">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">
            {t('eyebrow')}
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-lg text-slate-600">{t('description')}</p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
          {outcomes.map(({ key, icon: Icon }, index) => (
            <Reveal
              key={key}
              delayMs={index * 40}
              className="home-tile rounded-2xl bg-slate-50 p-5 lg:p-6"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary-dark" aria-hidden />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900">{t(`${key}Title`)}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t(`${key}Description`)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
