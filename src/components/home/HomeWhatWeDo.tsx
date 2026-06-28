'use client'

import React from 'react'
import Reveal from '../motion/Reveal'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  Briefcase,
  Globe,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import BrowserFrame from '../digital/BrowserFrame'
import {
  buildPortfolioScheduleQuery,
  getOrderedPortfolioItems,
  portfolioImageAlts,
} from '@/lib/digitalPortfolio'

const consultingOutcomeKeys = ['consultingOutcome1', 'consultingOutcome2'] as const
const digitalOutcomeKeys = ['digitalOutcome1', 'digitalOutcome2'] as const

export default function HomeWhatWeDo() {
  const t = useTranslations('home.whatWeDo')
  const tPortfolio = useTranslations('digitalCreations')
  const locale = useLocale()

  const nameMap = { t1: 't1Name', t3: 't3Name', t4: 't4Name', t5: 't5Name', t6: 't6Name', t7: 't7Name', t8: 't8Name', t9: 't9Name', t10: 't10Name', t11: 't11Name' } as const
  const descMap = { t1: 't1Desc', t3: 't3Desc', t4: 't4Desc', t5: 't5Desc', t6: 't6Desc', t7: 't7Desc', t8: 't8Desc', t9: 't9Desc', t10: 't10Desc', t11: 't11Desc' } as const

  const featured = getOrderedPortfolioItems()
    .slice(0, 3)
    .map((item) => ({
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
    <section id="services" className="py-16 lg:py-24 bg-slate-50 relative scroll-mt-24">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-lg text-slate-600">{t('description')}</p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {/* Business Enablement */}
          <Reveal className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 lg:p-8 shadow-card hover:shadow-card-hover hover:border-primary/25 transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10 shrink-0">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">{t('businessEnablementTitle')}</h3>
                <p className="mt-1 text-slate-600 text-sm leading-relaxed">{t('businessEnablementDesc')}</p>
              </div>
            </div>
            <ul className="space-y-3 flex-1 mb-6">
              {consultingOutcomeKeys.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                  {t(key)}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 mt-auto">
              <Link
                href="/services"
                className="inline-flex items-center text-primary font-semibold hover:underline hover:-translate-y-px transition-all duration-200"
              >
                {t('exploreBusinessEnablement')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/services/workshops"
                className="inline-flex items-center text-sm text-slate-600 font-medium hover:text-primary hover:underline transition-colors"
              >
                <GraduationCap className="w-4 h-4 mr-1.5 shrink-0" aria-hidden />
                {t('workshopsAlso')}
                <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>

          {/* Digital Creations */}
          <Reveal delayMs={60} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 lg:p-8 shadow-card hover:shadow-card-hover hover:border-primary/25 transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10 shrink-0">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">{t('websitesAndDigitalTitle')}</h3>
                <p className="mt-1 text-slate-600 text-sm leading-relaxed">{t('websitesAndDigitalDesc')}</p>
              </div>
            </div>
            <ul className="space-y-3 flex-1 mb-6">
              {digitalOutcomeKeys.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                  {t(key)}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mt-auto">
              <Link
                href="/services/digital"
                className="inline-flex items-center text-primary font-semibold hover:underline hover:-translate-y-px transition-all duration-200"
              >
                {t('exploreWebsitesAndDigital')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/services/digital"
                className="inline-flex items-center text-sm text-slate-600 font-medium hover:text-primary hover:underline transition-colors"
              >
                {t('digitalScopesLink')}
                <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Portfolio previews */}
        <Reveal className="mb-6">
          <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
            {featured.map((item, index) => (
              <div key={item.id} className="group flex flex-col">
                <a href={`/${locale}/services/portfolio#${item.id}`} className="block">
                  <BrowserFrame
                    imageUrl={item.imageUrl}
                    imageAlt={portfolioImageAlts[item.id as keyof typeof portfolioImageAlts]}
                    brandPreview={item.brandPreview}
                    domain={item.domain}
                    priority={index === 0}
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
        </Reveal>

        <Reveal className="text-center">
          <Link
            href="/services/portfolio"
            className="inline-flex items-center link-action font-semibold hover:underline"
          >
            {t('viewAllWork')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
