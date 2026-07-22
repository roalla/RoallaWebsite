'use client'

import React from 'react'
import Reveal from '../motion/Reveal'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Briefcase, CheckCircle2, ExternalLink } from 'lucide-react'
import BrowserFrame from '../digital/BrowserFrame'
import {
  getPortfolioItem,
  homeProofItemIds,
  portfolioImageAlts,
  portfolioMetrics,
  type PortfolioItemId,
} from '@/lib/digitalPortfolio'

const consultingOutcomeKeys = ['consultingOutcome1', 'consultingOutcome2', 'consultingOutcome3'] as const

const portfolioNameKey: Record<(typeof homeProofItemIds)[number], string> = {
  'pitch-hotshots': 't10Name',
  'kaylan-kaptures': 't15Name',
  'goalie-stop': 't12Name',
}

const outcomeKeyById: Record<(typeof homeProofItemIds)[number], 'outcomePitch' | 'outcomeKaylan' | 'outcomeGoalie'> = {
  'pitch-hotshots': 'outcomePitch',
  'kaylan-kaptures': 'outcomeKaylan',
  'goalie-stop': 'outcomeGoalie',
}

export default function HomeOurWork() {
  const t = useTranslations('home.proofBand')
  const tWhatWeDo = useTranslations('home.whatWeDo')
  const tPortfolio = useTranslations('digitalCreations')

  const liveProjects = homeProofItemIds
    .map((id) => getPortfolioItem(id as PortfolioItemId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item?.imageUrl && item.tryUrl))

  return (
    <section id="our-work" className="py-14 lg:py-20 bg-white relative scroll-mt-24">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{t('eyebrow')}</p>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-slate-600">{t('description')}</p>
        </Reveal>

        <Reveal className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-900">{t('digitalTitle')}</h3>
            <p className="mt-1 text-sm text-slate-600">{t('liveProjectsEyebrow')}</p>
          </div>
          <p className="text-xs font-medium text-primary-dark">
            {t('digitalStats', {
              websiteCount: portfolioMetrics.websites,
              digitalProductCount: portfolioMetrics.digitalProducts,
              totalCount: portfolioMetrics.total,
            })}
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mb-10">
          {liveProjects.map((item, index) => {
            const id = item.id as (typeof homeProofItemIds)[number]
            const name = tPortfolio(portfolioNameKey[id] as 't10Name')
            return (
              <Reveal key={item.id} delayMs={index * 50} className="home-tile group flex flex-col rounded-2xl bg-slate-50/80 p-3 sm:p-4">
                <div className="mb-3 flex items-center gap-2 px-1">
                  <span className="home-live-dot" aria-hidden />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                    {t('liveBadge')}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">{item.domain}</span>
                </div>
                <BrowserFrame
                  imageUrl={item.imageUrl}
                  imageAlt={portfolioImageAlts[item.id]}
                  domain={item.domain}
                  href={item.tryUrl}
                  openLabel={t('openLive')}
                  priority={index === 0}
                />
                <div className="mt-4 px-1 flex-1 flex flex-col">
                  <h4 className="text-base font-serif font-bold text-slate-900">{name}</h4>
                  <p className="mt-1.5 text-sm text-slate-600 leading-snug flex-1">{t(outcomeKeyById[id])}</p>
                  <a
                    href={item.tryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
                  >
                    {t('openLive')}
                    <ExternalLink className="ml-1.5 w-3.5 h-3.5" aria-hidden />
                  </a>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mb-10">
          <Link
            href="/services/portfolio"
            className="inline-flex items-center link-action hover:underline text-sm font-semibold"
          >
            {t('digitalCta')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Reveal>

        <Reveal className="home-tile flex flex-col rounded-2xl bg-gradient-to-br from-slate-50 to-white p-6 lg:p-8 max-w-3xl">
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
          <Link
            href="/programs/business-enablement"
            className="mt-6 inline-flex items-center link-action hover:underline text-sm font-semibold"
          >
            {t('consultingCta')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
