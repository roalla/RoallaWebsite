'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function HomeHeroContent() {
  const t = useTranslations('home.hero')

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-12 sm:pb-16 lg:pb-20">
      <div className="max-w-2xl lg:max-w-3xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-light">
          {t('eyebrow')}
        </p>
        <h1 className="text-[2rem] sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-serif font-extrabold tracking-[-0.02em] leading-[1.06] text-white">
          <span className="block">{t('titleLine')}</span>
          <span className="hero-soar mt-1 block text-brand-gold">{t('titleHighlight')}</span>
        </h1>

        <div className="hero-rule mt-4 sm:mt-5 h-px w-16 sm:w-20 bg-gradient-to-r from-brand-gold via-brand-gold/80 to-transparent" aria-hidden />

        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-white/90 max-w-2xl leading-relaxed">
          {t('subtitle')}
        </p>

        <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <Link
            href="/use-cases"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-3.5 rounded-lg bg-brand-gold hover:bg-brand-gold-light text-slate-950 font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] shadow-md shadow-black/25"
          >
            {t('primaryCta')}
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
          <Link
            href="/services/portfolio"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-3.5 rounded-lg border-2 border-white/80 hover:border-white hover:bg-white/10 text-white font-semibold text-sm sm:text-base transition-all duration-300"
          >
            {t('secondaryCta')}
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
        </div>
        <p className="mt-5 text-xs sm:text-sm font-medium text-white/75">
          {t('trustLine')}
        </p>
      </div>
    </div>
  )
}
