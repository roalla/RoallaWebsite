'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function HomeHeroContent() {
  const t = useTranslations('home.hero')
  const tCommon = useTranslations('common')

  return (
    <div className="container relative z-10 mx-auto px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
      <div className="max-w-2xl lg:max-w-3xl">
        <p className="mb-5 font-serif text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
          {tCommon('companyName')}
        </p>
        <h1 className="font-serif text-[2rem] font-extrabold leading-[1.06] tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl xl:text-[3.5rem]">
          <span className="block">{t('titleLine')}</span>
          <span className="hero-soar mt-1 block text-brand-gold">{t('titleHighlight')}</span>
        </h1>

        <div
          className="hero-rule mt-4 h-px w-16 bg-gradient-to-r from-brand-gold via-brand-gold/80 to-transparent sm:mt-5 sm:w-20"
          aria-hidden
        />

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:mt-5 sm:text-lg">
          {t('subtitle')}
        </p>

        <div className="mt-7 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-center sm:gap-6">
          <Link
            href="/contact"
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-brand-gold px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-md shadow-black/25 transition-colors hover:bg-brand-gold-light sm:w-auto sm:px-8 sm:text-base"
          >
            {t('primaryCta')}
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
          <a
            href="#choose-your-situation"
            className="inline-flex items-center justify-center text-sm font-semibold text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline sm:justify-start"
          >
            {t('secondaryCta')}
          </a>
        </div>

        <p className="mt-5 text-xs font-medium tracking-wide text-white/70 sm:text-sm">{t('proofLine')}</p>
      </div>
    </div>
  )
}
