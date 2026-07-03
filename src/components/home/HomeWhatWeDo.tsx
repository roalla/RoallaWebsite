'use client'

import React from 'react'
import Reveal from '../motion/Reveal'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  Globe,
  Layers,
  Workflow,
  Sparkles,
  CalendarDays,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Briefcase,
} from 'lucide-react'
import BrowserFrame from '../digital/BrowserFrame'
import {
  buildPortfolioScheduleQuery,
  getOrderedPortfolioItems,
  portfolioImageAlts,
} from '@/lib/digitalPortfolio'

const capabilityCards = [
  {
    icon: Globe,
    titleKey: 'capabilityWebsitesTitle',
    descKey: 'capabilityWebsitesDesc',
    href: { pathname: '/services/digital', hash: 'websites' } as const,
  },
  {
    icon: Layers,
    titleKey: 'capabilityPlatformsTitle',
    descKey: 'capabilityPlatformsDesc',
    href: { pathname: '/services/digital', hash: 'platforms' } as const,
  },
  {
    icon: Workflow,
    titleKey: 'capabilityAutomationTitle',
    descKey: 'capabilityAutomationDesc',
    href: { pathname: '/services/digital', hash: 'automation' } as const,
  },
  {
    icon: Sparkles,
    titleKey: 'capabilityAiTitle',
    descKey: 'capabilityAiDesc',
    href: { pathname: '/services/digital', hash: 'ai-support' } as const,
  },
  {
    icon: CalendarDays,
    titleKey: 'capabilityEventsTitle',
    descKey: 'capabilityEventsDesc',
    href: '/services/digital-events' as const,
  },
] as const

export default function HomeWhatWeDo() {
  const t = useTranslations('home.whatWeDo')
  const tPortfolio = useTranslations('digitalCreations')
  const locale = useLocale()

  const nameMap = { t1: 't1Name', t3: 't3Name', t4: 't4Name', t5: 't5Name', t6: 't6Name', t7: 't7Name', t8: 't8Name', t9: 't9Name', t10: 't10Name', t11: 't11Name', t12: 't12Name', t13: 't13Name' } as const
  const descMap = { t1: 't1Desc', t3: 't3Desc', t4: 't4Desc', t5: 't5Desc', t6: 't6Desc', t7: 't7Desc', t8: 't8Desc', t9: 't9Desc', t10: 't10Desc', t11: 't11Desc', t12: 't12Desc', t13: 't13Desc' } as const

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mb-12">
          {capabilityCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Reveal key={card.titleKey} delayMs={index * 40} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 lg:p-6 shadow-card hover:shadow-card-hover hover:border-primary/25 transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10 shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-slate-900">{t(card.titleKey)}</h3>
                    <p className="mt-1 text-sm text-slate-600 leading-snug">{t(card.descKey)}</p>
                  </div>
                </div>
                <Link
                  href={card.href}
                  className="mt-auto inline-flex items-center text-sm text-primary font-semibold hover:underline"
                >
                  {t('exploreCapability')}
                  <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Link>
              </Reveal>
            )
          })}
        </div>

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

        <Reveal className="text-center mb-10">
          <Link
            href="/services/portfolio"
            className="inline-flex items-center link-action font-semibold hover:underline"
          >
            {t('viewAllWork')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Reveal>

        <Reveal className="rounded-xl border border-slate-200 bg-white/80 px-5 py-4 lg:px-6 lg:py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{t('programsStripTitle')}</p>
          <p className="text-sm text-slate-700 leading-relaxed">{t('programsStripDesc')}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            <Link
              href="/programs/business-enablement"
              className="inline-flex items-center text-sm font-semibold text-slate-700 hover:text-primary hover:underline"
            >
              <Briefcase className="w-4 h-4 mr-1.5 shrink-0" aria-hidden />
              {t('programsBusinessEnablement')}
              <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Link>
            <Link
              href="/programs/workshops"
              className="inline-flex items-center text-sm font-semibold text-slate-700 hover:text-primary hover:underline"
            >
              <GraduationCap className="w-4 h-4 mr-1.5 shrink-0" aria-hidden />
              {t('programsWorkshops')}
              <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
