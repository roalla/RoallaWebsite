'use client'

import React from 'react'
import Reveal from '../motion/Reveal'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  Globe,
  Layers,
  Workflow,
  Sparkles,
  CalendarDays,
  ArrowRight,
  GraduationCap,
  Briefcase,
} from 'lucide-react'
import HomeDeliveryPhases from './HomeDeliveryPhases'

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

  return (
    <section id="services" className="py-16 lg:py-24 bg-slate-50 relative scroll-mt-24">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-lg text-slate-600">{t('description')}</p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mb-10">
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

        <HomeDeliveryPhases />

        <Reveal className="rounded-xl border border-slate-200 bg-white px-5 py-4 lg:px-6 lg:py-5 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-slate-700 leading-relaxed">{t('portfolioTeaser')}</p>
          <Link
            href="/services/portfolio"
            className="inline-flex items-center shrink-0 link-action font-semibold hover:underline text-sm"
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
