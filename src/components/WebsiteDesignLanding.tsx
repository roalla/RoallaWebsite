'use client'

import React from 'react'
import Reveal from './motion/Reveal'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  CheckCircle,
  Clock,
  ExternalLink,
  Globe,
  Layout,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react'
import ScheduleButton from './ScheduleButton'
import StickyMobileCTA from './StickyMobileCTA'
import ServiceMiniFAQ from './services/ServiceMiniFAQ'
import Breadcrumb from './Breadcrumb'
import BrowserFrame from './digital/BrowserFrame'
import {
  getPortfolioItem,
  portfolioImageAlts,
  type PortfolioItemId,
} from '@/lib/digitalPortfolio'
import {
  ConsultingHeroVisual,
  ServiceAnchorNav,
  ServicePageCTA,
  ServicePageHero,
  ServiceSectionHeading,
  serviceCardClass,
  serviceHeroSecondaryButtonClass,
  servicePrimaryLinkClass,
  serviceSecondaryButtonClass,
} from './services/ServicePageSections'

const WEBSITE_PORTFOLIO_IDS = ['ken-effect', 'valentir-green-tech', 'cold-dejabru-event'] as const satisfies readonly PortfolioItemId[]

const marketPainKeys = ['market1', 'market2', 'market3', 'market4'] as const
const offerIncludeKeys = ['offerI1', 'offerI2', 'offerI3', 'offerI4', 'offerI5', 'offerI6'] as const
const offerNotIncludeKeys = ['offerN1', 'offerN2', 'offerN3'] as const
const processSteps = [
  { icon: Search, titleKey: 'process1Title', descKey: 'process1Desc', hintKey: 'process1Hint' },
  { icon: Layout, titleKey: 'process2Title', descKey: 'process2Desc', hintKey: 'process2Hint' },
  { icon: Rocket, titleKey: 'process3Title', descKey: 'process3Desc', hintKey: 'process3Hint' },
  { icon: ShieldCheck, titleKey: 'process4Title', descKey: 'process4Desc', hintKey: 'process4Hint' },
] as const
const fitKeys = ['fit1', 'fit2', 'fit3'] as const
const notFitKeys = ['notFit1', 'notFit2'] as const

const portfolioNameKeys = {
  'ken-effect': 't3Name',
  'valentir-green-tech': 't8Name',
  'cold-dejabru-event': 't6Name',
} as const

const portfolioDescKeys = {
  'ken-effect': 't3CaseStudy',
  'valentir-green-tech': 't8CaseStudy',
  'cold-dejabru-event': 't6CaseStudy',
} as const

export default function WebsiteDesignLanding() {
  const t = useTranslations('websiteDesign')
  const tCommon = useTranslations('common')
  const tPortfolio = useTranslations('digitalCreations')
  const tBc = useTranslations('breadcrumb')

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label'), icon: Clock },
    { value: t('stat2Value'), label: t('stat2Label'), icon: Globe },
    { value: t('stat3Value'), label: t('stat3Label'), icon: Sparkles },
  ]

  return (
    <section id="website-design" className="section-padding relative">
      <ServicePageHero
        variant="digital"
        eyebrow={t('heroEyebrow')}
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        subtitleHighlight={t('heroSubtitleHighlight')}
        stats={stats}
        statsNote={t('heroStatsNote')}
        visual={
          <ConsultingHeroVisual
            icon={Globe}
            proofTitle={t('heroProofTitle')}
            proofSubtitle={t('heroProofSubtitle')}
            outcomes={[t('heroOutcome1'), t('heroOutcome2'), t('heroOutcome3')]}
          />
        }
        primaryCta={
          <ScheduleButton variant="primary" size="lg" icon intent="website" service="websites-brand" need="new">
            {t('heroCtaPrimary')}
          </ScheduleButton>
        }
        secondaryCta={
          <Link href="/services/portfolio" className={serviceHeroSecondaryButtonClass}>
            {t('heroCtaSecondary')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        }
        ctaSubtext={t('heroCtaSubtext')}
      />

      <Breadcrumb
        items={[
          { label: tBc('home'), href: '/' },
          { label: tBc('services'), href: '/services' },
          { label: tBc('websiteDesign') },
        ]}
      />

      <div className="max-w-6xl mx-auto">
        <ServiceAnchorNav
          label={t('jumpNavLabel')}
          items={[
            { id: 'market', label: t('marketNav') },
            { id: 'offer', label: t('offerNav') },
            { id: 'process', label: t('processNav') },
            { id: 'work', label: t('workNav') },
            { id: 'faq', label: t('faqNav') },
          ]}
        />

        <section id="market" className="scroll-mt-28 mb-16">
          <ServiceSectionHeading
            eyebrow={t('marketEyebrow')}
            title={t('marketTitle')}
            description={t('marketDesc')}
          />
          <div className="grid md:grid-cols-2 gap-4">
            {marketPainKeys.map((key) => (
              <Reveal
                key={key}
                className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 flex gap-3"
              >
                <XCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" aria-hidden />
                <p className="text-sm text-slate-700 leading-relaxed">{t(key)}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-6 rounded-xl border border-primary/20 bg-primary/[0.04] p-5 md:p-6">
            <p className="text-sm md:text-base text-slate-800 leading-relaxed font-medium">{t('marketResolution')}</p>
          </Reveal>
        </section>

        <section id="offer" className="scroll-mt-28 mb-16 pt-4 border-t border-slate-200">
          <ServiceSectionHeading
            eyebrow={t('offerEyebrow')}
            title={t('offerTitle')}
            description={t('offerDesc')}
          />
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
            <Reveal className={`${serviceCardClass} p-6 md:p-8`}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-dark">
                  {t('offerBadge')}
                </span>
                <span className="text-sm font-medium text-slate-600">{t('offerTimeline')}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-900">{t('offerName')}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t('offerIdeal')}</p>
              <ul className="mt-6 space-y-3">
                {offerIncludeKeys.map((key) => (
                  <li key={key} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                    {t(key)}
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{t('offerNotIncludedLabel')}</p>
                <ul className="space-y-2">
                  {offerNotIncludeKeys.map((key) => (
                    <li key={key} className="text-sm text-slate-600 leading-relaxed">
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <ScheduleButton
                  variant="primary"
                  size="md"
                  icon
                  block
                  intent="website"
                  service="websites-brand"
                  need="new"
                  className="w-full"
                >
                  {t('offerCta')}
                </ScheduleButton>
                <p className="mt-2 text-xs text-center text-slate-500">{t('offerCtaNote')}</p>
              </div>
            </Reveal>

            <Reveal className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{t('redesignEyebrow')}</p>
                <h3 className="text-lg font-serif font-bold text-slate-900">{t('redesignTitle')}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t('redesignDesc')}</p>
                <ScheduleButton
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  intent="website"
                  service="websites-brand"
                  need="redesign"
                >
                  {t('redesignCta')}
                </ScheduleButton>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{t('conversionEyebrow')}</p>
                <h3 className="text-lg font-serif font-bold text-slate-900">{t('conversionTitle')}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t('conversionDesc')}</p>
                <ScheduleButton
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  intent="website"
                  service="websites-brand"
                  need="conversion"
                >
                  {t('conversionCta')}
                </ScheduleButton>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed px-1">
                {t('offerFootnote')}{' '}
                <Link href="/services/digital" className="text-primary-dark font-medium underline underline-offset-2 hover:text-primary">
                  {t('offerFootnoteLink')}
                </Link>
              </p>
            </Reveal>
          </div>
        </section>

        <section id="process" className="scroll-mt-28 mb-16 pt-4 border-t border-slate-200">
          <ServiceSectionHeading title={t('processTitle')} description={t('processDesc')} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {processSteps.map(({ icon: Icon, titleKey, descKey, hintKey }, index) => (
              <Reveal key={titleKey} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-primary-dark tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                  <Icon className="w-4 h-4 text-primary" aria-hidden />
                </div>
                <h3 className="font-serif font-bold text-slate-900">{t(titleKey)}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t(descKey)}</p>
                <p className="mt-3 text-xs font-medium text-primary-dark">{t(hintKey)}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="work" className="scroll-mt-28 mb-16 pt-4 border-t border-slate-200">
          <ServiceSectionHeading
            eyebrow={t('workEyebrow')}
            title={t('workTitle')}
            description={t('workDesc')}
          />
          <div className="grid md:grid-cols-3 gap-6">
            {WEBSITE_PORTFOLIO_IDS.map((id) => {
              const item = getPortfolioItem(id)
              if (!item?.imageUrl) return null
              const nameKey = portfolioNameKeys[id]
              const descKey = portfolioDescKeys[id]
              return (
                <Reveal key={id} className={`${serviceCardClass} overflow-hidden`}>
                  <BrowserFrame
                    imageUrl={item.imageUrl}
                    imageAlt={portfolioImageAlts[id]}
                    domain={item.domain}
                    className="rounded-none border-0 shadow-none"
                  />
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-serif font-bold text-slate-900">{tPortfolio(nameKey)}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">{tPortfolio(descKey)}</p>
                    <div className="mt-4 flex flex-col gap-2">
                      <a
                        href={item.tryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={serviceSecondaryButtonClass + ' justify-center text-sm'}
                      >
                        {t('workVisitSite')}
                        <ExternalLink className="ml-2 w-3.5 h-3.5" aria-hidden />
                      </a>
                      <ScheduleButton
                        variant="primary"
                        size="sm"
                        block
                        intent="website"
                        service="websites-brand"
                        reference={id}
                        className="w-full"
                      >
                        {t('workSimilarCta')}
                      </ScheduleButton>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
          <div className="mt-8 text-center">
            <Link href="/services/portfolio" className={servicePrimaryLinkClass + ' inline-flex w-auto px-6'}>
              {t('workPortfolioCta')}
              <ArrowRight className="ml-2 w-4 h-4" aria-hidden />
            </Link>
          </div>
        </section>

        <section id="fit" className="scroll-mt-28 mb-16 pt-4 border-t border-slate-200">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <ServiceSectionHeading title={t('fitTitle')} className="mb-4" />
              <ul className="space-y-3">
                {fitKeys.map((key) => (
                  <li key={key} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ServiceSectionHeading title={t('notFitTitle')} className="mb-4" />
              <ul className="space-y-3">
                {notFitKeys.map((key) => (
                  <li key={key} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <XCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden />
                    {t(key)}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate-600">
                {t('notFitNote')}{' '}
                <Link href="/services/digital" className="text-primary-dark font-medium underline underline-offset-2">
                  {t('notFitLink')}
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-28 mb-4 pt-4 border-t border-slate-200">
          <ServiceSectionHeading title={t('faqTitle')} className="mb-6" />
          <ServiceMiniFAQ namespace="websiteDesign" />
        </section>

        <ServicePageCTA
          badge={t('ctaBadge')}
          title={t('ctaTitle')}
          subtitle={t('ctaSubtitle')}
          qualifier={t('ctaQualifier')}
          primaryCta={
            <ScheduleButton
              variant="primary"
              size="lg"
              icon
              intent="website"
              service="websites-brand"
              need="new"
              className="bg-white text-slate-900 hover:bg-slate-100 border-0"
            >
              {t('ctaButton')}
            </ScheduleButton>
          }
          ctaSubtext={t('ctaSubtext')}
          links={[
            { href: '/services/portfolio', label: t('ctaLinkPortfolio') },
            { href: '/services/digital', label: t('ctaLinkDigital') },
          ]}
        />
      </div>

      <StickyMobileCTA
        label={t('heroCtaPrimary')}
        intent="website"
        service="websites-brand"
        need="new"
        sublabel={t('heroCtaSubtext')}
      />
    </section>
  )
}
