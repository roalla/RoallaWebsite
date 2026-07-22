'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'

export default function HomeHeroContent() {
  const t = useTranslations('home.hero')
  const tCommon = useTranslations('common')

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-16 lg:pb-24">
      <div className="max-w-2xl lg:max-w-3xl">
        <Reveal when="mount" delayMs={80}>
          <h1 className="text-[1.5rem] sm:text-4xl lg:text-5xl font-sans font-extrabold uppercase tracking-[0.04em] leading-[1.12] text-white">
            <span className="block">{t('titleLine')}</span>
            <span className="hero-soar mt-1 block text-brand-gold">{t('titleHighlight')}</span>
          </h1>
        </Reveal>

        <Reveal when="mount" delayMs={160} className="mt-4 sm:mt-5" aria-hidden>
          <div className="hero-rule h-px w-16 sm:w-20 bg-gradient-to-r from-brand-gold via-brand-gold/80 to-transparent" />
        </Reveal>

        <Reveal when="mount" delayMs={220}>
          <p className="mt-4 sm:mt-5 text-base sm:text-lg text-white/85 max-w-xl leading-relaxed">
            {t('subtitle')}
          </p>
        </Reveal>

        <Reveal
          when="mount"
          delayMs={300}
          className="mt-7 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
        >
          <Link
            href="/schedule"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-3.5 rounded-lg bg-brand-gold hover:bg-brand-gold-light text-slate-950 font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] shadow-md shadow-black/25"
          >
            {tCommon('scheduleConsultationDigital')}
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
          <Link
            href="/services/portfolio"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-3.5 rounded-lg border-2 border-white/80 hover:border-white hover:bg-white/10 text-white font-semibold text-sm sm:text-base transition-all duration-300"
          >
            {t('exploreDigitalLink')}
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </div>
  )
}
