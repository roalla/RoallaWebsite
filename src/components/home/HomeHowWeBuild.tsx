'use client'

import React from 'react'
import { Palette, Hammer, Rocket } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import Reveal from '../motion/Reveal'
import ScheduleButton from '../ScheduleButton'
import { PillarBadge } from '../services/ServicePageSections'
import { BUILD_PHASE_LABEL_KEYS, HOME_BUILD_STEP_PILLARS } from '@/lib/brand-journey'

const buildStepIcons = [Palette, Hammer, Rocket] as const
const buildSteps = ['buildStep1', 'buildStep2', 'buildStep3'] as const

export default function HomeHowWeBuild() {
  const t = useTranslations('digitalCreations')
  const tHome = useTranslations('home.howWeBuild')
  const tBrand = useTranslations('brandJourney')

  return (
    <section id="how-we-build" className="py-16 lg:py-24 bg-slate-50 relative scroll-mt-24">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10 max-w-5xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{tBrand('bandTitle')}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{t('buildStripEyebrow')}</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">{t('buildStripTitle')}</h2>
            <p className="mt-3 text-slate-600 max-w-2xl">{t('buildStripDesc')}</p>
          </div>
          <Link
            href="/services/digital"
            className="inline-flex items-center link-action hover:underline shrink-0 text-sm font-semibold"
          >
            {t('exploreDigitalBuilds')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
          {buildSteps.map((key, i) => {
            const Icon = buildStepIcons[i]
            const pillar = HOME_BUILD_STEP_PILLARS[i]
            return (
              <Reveal
                key={key}
                delayMs={i * 70}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Icon className="w-5 h-5" aria-hidden />
                  </div>
                  <PillarBadge label={tBrand(BUILD_PHASE_LABEL_KEYS[pillar])} />
                </div>
                <h3 className="font-serif font-bold text-slate-900">{t(`${key}Title` as 'buildStep1Title')}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t(`${key}Desc` as 'buildStep1Desc')}</p>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <ScheduleButton intent="website" variant="primary" size="lg">
            {tHome('cta')}
          </ScheduleButton>
          <p className="text-sm text-slate-500">{tHome('responseTime')}</p>
        </Reveal>
      </div>
    </section>
  )
}
