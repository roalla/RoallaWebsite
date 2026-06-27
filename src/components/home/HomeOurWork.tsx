'use client'

import React from 'react'
import Reveal from '../motion/Reveal'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Briefcase, Globe, CheckCircle2, ExternalLink } from 'lucide-react'
import BrowserFrame from '../digital/BrowserFrame'
import {
  buildPortfolioScheduleQuery,
  getOrderedPortfolioItems,
  portfolioImageAlts,
} from '@/lib/digitalPortfolio'

const consultingOutcomeKeys = ['consultingOutcome1', 'consultingOutcome2', 'consultingOutcome3'] as const

export default function HomeOurWork() {
  const t = useTranslations('home.proofBand')
  const tWhatWeDo = useTranslations('home.whatWeDo')
  const tPortfolio = useTranslations('digitalCreations')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const nameMap = { t1: 't1Name', t3: 't3Name', t4: 't4Name', t5: 't5Name', t6: 't6Name', t7: 't7Name', t8: 't8Name', t9: 't9Name', t10: 't10Name', t11: 't11Name' } as const
  const descMap = { t1: 't1Desc', t3: 't3Desc', t4: 't4Desc', t5: 't5Desc', t6: 't6Desc', t7: 't7Desc', t8: 't8Desc', t9: 't9Desc', t10: 't10Desc', t11: 't11Desc' } as const

  const featured = getOrderedPortfolioItems().map((item) => ({
    id: item.id,
    name: tPortfolio(nameMap[item.i18nPrefix]),
    outcome: tPortfolio(descMap[item.i18nPrefix]),
    url: item.tryUrl,
    imageUrl: item.imageUrl,
    brandPreview: item.brandPreview,
    domain: item.domain,
    scheduleQuery: buildPortfolioScheduleQuery(item),
  }))

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
          {/* Consulting proof */}
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
                href="/services"
                className="inline-flex items-center link-action hover:underline text-sm font-semibold"
              >
                {t('consultingCta')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Digital proof */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-primary/[0.04] p-6 lg:p-8 shadow-card">
            <div className="flex items-start gap-3 mb-4">
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

            <div className="grid grid-cols-2 gap-3 flex-1">
              {featured.map((item, index) => (
                <div key={item.id} className="group flex flex-col">
                  <a href={`/${locale}/services/portfolio#${item.id}`} className="block">
                    <BrowserFrame
                      imageUrl={item.imageUrl}
                      imageAlt={portfolioImageAlts[item.id as keyof typeof portfolioImageAlts]}
                      brandPreview={item.brandPreview}
                      domain={item.domain}
                      priority={index < 2}
                      className="group-hover:shadow-card-hover transition-shadow duration-300"
                    />
                  </a>
                  <span className="mt-2 text-sm font-semibold text-slate-800">{item.name}</span>
                  <span className="mt-0.5 text-xs text-slate-500 leading-snug line-clamp-2">
                    {item.outcome}
                  </span>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    <Link
                      href={{ pathname: '/schedule', query: item.scheduleQuery }}
                      className="text-xs font-semibold text-primary-dark hover:underline"
                    >
                      {tPortfolio('discussBuildLike')}
                    </Link>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-primary"
                    >
                      {tPortfolio('viewLive')}
                      <ExternalLink className="w-3 h-3" aria-hidden />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/services/portfolio"
              className="mt-6 inline-flex items-center link-action hover:underline"
            >
              {t('digitalCta')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
