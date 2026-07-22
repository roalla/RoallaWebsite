'use client'

import React from 'react'
import Reveal from '../motion/Reveal'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  Globe,
  Layers,
  Workflow,
  ArrowRight,
  GraduationCap,
  Briefcase,
  ExternalLink,
} from 'lucide-react'
import BrowserFrame from '../digital/BrowserFrame'
import {
  getPortfolioItem,
  homeCapabilityExamples,
  portfolioImageAlts,
  type PortfolioItemId,
} from '@/lib/digitalPortfolio'

const capabilityCards = [
  {
    id: 'websites' as const,
    icon: Globe,
    titleKey: 'capabilityWebsitesTitle' as const,
    descKey: 'capabilityWebsitesDesc' as const,
    stackKey: 'capabilityStackWebsites' as const,
    href: { pathname: '/services/digital', hash: 'websites' } as const,
    exampleId: homeCapabilityExamples.websites,
  },
  {
    id: 'platforms' as const,
    icon: Layers,
    titleKey: 'capabilityPlatformsTitle' as const,
    descKey: 'capabilityPlatformsDesc' as const,
    stackKey: 'capabilityStackPlatforms' as const,
    href: { pathname: '/services/digital', hash: 'platforms' } as const,
    exampleId: homeCapabilityExamples.platforms,
  },
  {
    id: 'automation' as const,
    icon: Workflow,
    titleKey: 'capabilityAutomationTitle' as const,
    descKey: 'capabilityAutomationDesc' as const,
    stackKey: 'capabilityStackAutomation' as const,
    href: { pathname: '/services/digital', hash: 'automation' } as const,
    exampleId: homeCapabilityExamples.automation,
  },
]

const portfolioNameKey: Record<PortfolioItemId, string> = {
  'roalla-site': 't5Name',
  'business-cocoon': 't4Name',
  '4theblueprint': 't7Name',
  'soaring-puck': 't1Name',
  'cold-dejabru-event': 't6Name',
  'valentir-green-tech': 't8Name',
  boothlio: 't9Name',
  'pitch-hotshots': 't10Name',
  my360vision: 't11Name',
  'goalie-stop': 't12Name',
  grcstatus: 't13Name',
  unjargonit: 't14Name',
  'kaylan-kaptures': 't15Name',
  'hockey-gaze': 't16Name',
}

export default function HomeWhatWeDo() {
  const t = useTranslations('home.whatWeDo')
  const tPortfolio = useTranslations('digitalCreations')

  return (
    <section id="services" className="py-16 lg:py-24 bg-slate-50 relative scroll-mt-24">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-lg text-slate-600">{t('description')}</p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mb-8">
          {capabilityCards.map((card, index) => {
            const Icon = card.icon
            const example = getPortfolioItem(card.exampleId)
            if (!example?.imageUrl) return null
            const exampleName = tPortfolio(portfolioNameKey[card.exampleId] as 't10Name')

            return (
              <Reveal
                key={card.titleKey}
                delayMs={index * 40}
                className="home-tile group flex flex-col rounded-2xl bg-white p-4 sm:p-5 lg:p-6"
              >
                <div className="mb-4 overflow-hidden rounded-xl ring-1 ring-slate-200/80 transition-all duration-300 group-hover:ring-primary/40">
                  <BrowserFrame
                    imageUrl={example.imageUrl}
                    imageAlt={portfolioImageAlts[example.id]}
                    domain={example.domain}
                    href={example.tryUrl}
                    openLabel={t('seeExample')}
                    priority={index === 0}
                    className="!rounded-xl !shadow-none !border-0"
                  />
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10 shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-serif font-bold text-slate-900">{t(card.titleKey)}</h3>
                    <p className="mt-1 text-sm text-slate-600 leading-snug">{t(card.descKey)}</p>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-primary-dark/80">
                      {t(card.stackKey)}
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-2 pt-2">
                  <a
                    href={example.tryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary font-semibold hover:underline"
                  >
                    {t('seeExample')}
                    <span className="sr-only">: {exampleName}</span>
                    <ExternalLink className="ml-1.5 w-3.5 h-3.5" aria-hidden />
                  </a>
                  <Link
                    href={card.href}
                    className="inline-flex items-center text-sm text-slate-600 font-medium hover:text-primary-dark hover:underline"
                  >
                    {t('exploreCapability')}
                    <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                  </Link>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mb-8">
          <Link
            href="/services/digital"
            className="inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
          >
            {t('viewAllDigital')}
            <ArrowRight className="ml-1.5 w-4 h-4" />
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
