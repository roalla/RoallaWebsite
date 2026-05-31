'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import Reveal from '../motion/Reveal'
import { PillarBadge } from '../services/ServicePageSections'
import {
  CONSULTING_ENGAGEMENT_STEP_PILLARS,
  ENGAGEMENT_PHASE_LABEL_KEYS,
  ENGAGEMENT_PHASE_RANGE_KEYS,
} from '@/lib/brand-journey'

const stepKeys = ['step1', 'step2', 'step3', 'step4'] as const

export default function HomeHowWeWork() {
  const t = useTranslations('home.howWeWork')
  const tBrand = useTranslations('brandJourney')

  const steps = stepKeys.map((key, i) => ({
    label: t(key),
    num: i + 1,
    pillar: CONSULTING_ENGAGEMENT_STEP_PILLARS[i],
  }))

  return (
    <section className="py-16 lg:py-24 bg-slate-50 relative">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark mb-3">{tBrand('bandTitle')}</p>
          <h2 className="text-3xl font-serif font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-slate-600">{t('description')}</p>
          <p className="mt-2 text-sm text-slate-500">
            {t('noteConsulting')} · {t('noteDigital')}
          </p>
        </Reveal>

        <div className="relative max-w-5xl mx-auto">
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <Reveal
                key={step.label}
                delayMs={i * 60}
                className="relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-card"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {step.num}
                  </span>
                  <PillarBadge label={tBrand(ENGAGEMENT_PHASE_LABEL_KEYS[step.pillar])} />
                </div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
                  {tBrand(ENGAGEMENT_PHASE_RANGE_KEYS[step.pillar])}
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">{step.label}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="text-center mt-8">
          <Link
            href="/services"
            className="inline-flex items-center text-primary font-semibold hover:underline hover:-translate-y-px transition-all duration-200"
          >
            {t('learnMore')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
