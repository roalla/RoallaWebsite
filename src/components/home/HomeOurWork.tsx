'use client'

import React from 'react'
import Reveal from '../motion/Reveal'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Briefcase, Globe, CheckCircle2 } from 'lucide-react'

const consultingOutcomeKeys = ['consultingOutcome1', 'consultingOutcome2', 'consultingOutcome3'] as const
const digitalOutcomeKeys = ['digitalOutcome1', 'digitalOutcome2'] as const

export default function HomeOurWork() {
  const t = useTranslations('home.proofBand')
  const tWhatWeDo = useTranslations('home.whatWeDo')
  const tCommon = useTranslations('common')

  return (
    <section id="our-work" className="py-14 lg:py-20 bg-white relative scroll-mt-24">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{t('eyebrow')}</p>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-slate-600">{t('description')}</p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 lg:p-8 shadow-card">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-primary" aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900">{t('consultingTitle')}</h3>
                <p className="mt-1 text-sm text-slate-600">{t('consultingDesc')}</p>
              </div>
            </div>
            <ul className="space-y-3 flex-1">
              {consultingOutcomeKeys.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                  {tWhatWeDo(key)}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href={{ pathname: '/schedule', query: { intent: 'consulting' } }}
                className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 text-sm transition-colors"
              >
                {tCommon('scheduleConsultation')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/programs/business-enablement"
                className="inline-flex items-center link-action hover:underline text-sm font-semibold"
              >
                {t('consultingCta')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-primary/[0.04] p-6 lg:p-8 shadow-card">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-primary" aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900">{t('digitalTitle')}</h3>
                <p className="mt-1 text-sm text-slate-600">{t('digitalDesc')}</p>
                <p className="mt-2 text-xs font-medium text-primary-dark">{t('digitalStats')}</p>
                <p className="mt-1 text-xs text-slate-500">{t('digitalStatsNote')}</p>
              </div>
            </div>
            <ul className="space-y-3 flex-1">
              {digitalOutcomeKeys.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                  {tWhatWeDo(key)}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href={{ pathname: '/schedule', query: { intent: 'website' } }}
                className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 text-sm transition-colors"
              >
                {tCommon('scheduleConsultationDigital')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/services/portfolio"
                className="inline-flex items-center link-action hover:underline text-sm font-semibold"
              >
                {t('digitalCta')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
