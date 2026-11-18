'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'
import InquiryNextSteps from '../conversion/InquiryNextSteps'

export default function HomeCTA() {
  const t = useTranslations('home.cta')
  return (
    <section id="home-cta" className="relative scroll-mt-24 bg-slate-50 py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-4xl border border-slate-200 bg-white px-8 py-12 text-center sm:px-12 lg:py-14">
          <h2 className="font-serif text-2xl font-bold text-slate-950 sm:text-3xl">{t('title')}</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600">{t('subtitle')}</p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-gold px-8 py-3.5 text-base font-semibold text-slate-950 transition-colors hover:bg-brand-gold-light"
            >
              {t('schedule')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <p className="text-sm text-slate-500">{t('responseTime')}</p>
            <InquiryNextSteps className="mt-2 w-full text-left" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
