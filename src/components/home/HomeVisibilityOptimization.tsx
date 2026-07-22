'use client'

import React from 'react'
import { ArrowRight, CheckCircle2, SearchCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'

const capabilityKeys = [
  'technicalSeo',
  'structuredData',
  'contentArchitecture',
  'localVisibility',
  'accessibility',
  'performance',
  'conversion',
  'aiReadability',
  'analytics',
  'monitoring',
] as const

export default function HomeVisibilityOptimization() {
  const t = useTranslations('home.visibility')

  return (
    <section id="visibility-optimization" className="relative bg-slate-950 py-16 lg:py-24 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] gap-10 lg:gap-16 items-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-light mb-5">
              <SearchCheck className="w-4 h-4" aria-hidden />
              {t('eyebrow')}
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">{t('title')}</h2>
            <p className="mt-4 text-lg text-slate-300 leading-relaxed">{t('description')}</p>
            <p className="mt-5 text-sm text-slate-400 leading-relaxed border-l-2 border-brand-gold pl-4">
              {t('qualification')}
            </p>
            <Link
              href="/schedule"
              className="mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-brand-gold px-6 py-3 font-semibold text-slate-950 transition-all hover:bg-brand-gold-light hover:scale-[1.02]"
            >
              {t('cta')}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </Reveal>

          <Reveal delayMs={80} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 sm:p-8">
            <h3 className="text-lg font-serif font-bold text-white mb-5">{t('capabilitiesTitle')}</h3>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {capabilityKeys.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-primary-light shrink-0 mt-0.5" aria-hidden />
                  {t(key)}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
