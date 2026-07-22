'use client'

import React from 'react'
import Reveal from './motion/Reveal'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  MapPin,
  Rocket,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import ScheduleButton from './ScheduleButton'
import StickyMobileCTA from './StickyMobileCTA'
import ServiceMiniFAQ from './services/ServiceMiniFAQ'
import {
  ConsultingHeroVisual,
  ServiceAnchorNav,
  ServicePageCTA,
  ServicePageHero,
  ServiceSectionHeading,
  serviceCardClass,
  serviceHeroSecondaryButtonClass,
  servicePrimaryLinkClass,
} from './services/ServicePageSections'
import { FOUNDING_CLIENT_FAQ_KEYS } from '@/lib/service-faq-jsonld'

const includeKeys = ['include1', 'include2', 'include3', 'include4', 'include5', 'include6'] as const
const excludeKeys = ['exclude1', 'exclude2', 'exclude3', 'exclude4', 'exclude5', 'exclude6', 'exclude7'] as const
const termKeys = ['term1', 'term2', 'term3'] as const
const processSteps = [
  { icon: MapPin, titleKey: 'process1Title', descKey: 'process1Desc' },
  { icon: DollarSign, titleKey: 'process2Title', descKey: 'process2Desc' },
  { icon: Rocket, titleKey: 'process3Title', descKey: 'process3Desc' },
  { icon: ShieldCheck, titleKey: 'process4Title', descKey: 'process4Desc' },
] as const

export default function FoundingClientLanding() {
  const t = useTranslations('foundingClient')

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label'), icon: DollarSign },
    { value: t('stat2Value'), label: t('stat2Label'), icon: Clock },
    { value: t('stat3Value'), label: t('stat3Label'), icon: Globe },
  ]

  return (
    <section id="website-package" className="section-padding relative">
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
            icon={Sparkles}
            proofTitle={t('heroProofTitle')}
            proofSubtitle={t('heroProofSubtitle')}
            outcomes={[t('heroOutcome1'), t('heroOutcome2'), t('heroOutcome3')]}
          />
        }
        primaryCta={
          <ScheduleButton
            variant="primary"
            size="lg"
            icon
            intent="website"
            service="websites-brand"
            need="new"
            offer="founding"
          >
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

      <div className="max-w-6xl mx-auto">
        <ServiceAnchorNav
          label={t('jumpNavLabel')}
          items={[
            { id: 'offer', label: t('offerNav') },
            { id: 'process', label: t('processNav') },
            { id: 'faq', label: t('faqNav') },
          ]}
        />

        <section id="offer" className="scroll-mt-28 mb-16">
          <ServiceSectionHeading eyebrow={t('offerEyebrow')} title={t('offerTitle')} description={t('offerDesc')} />
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
            <Reveal className={`${serviceCardClass} p-6 md:p-8 border-primary/25 ring-1 ring-primary/10`}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-dark">
                  {t('offerBadge')}
                </span>
                <span className="text-sm font-medium text-slate-600">{t('offerTimeline')}</span>
              </div>
              <div className="flex flex-wrap items-baseline gap-2 mb-2">
                <p className="text-4xl font-serif font-bold text-slate-900">{t('offerPrice')}</p>
                <p className="text-sm text-slate-500 line-through">{t('offerComparePrice')}</p>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-2">{t('offerHostingNote')}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{t('offerIdeal')}</p>
              <ul className="mt-6 space-y-3">
                {includeKeys.map((key) => (
                  <li key={key} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                    {t(key)}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-500 leading-relaxed">{t('aodaFootnote')}</p>
              <details className="mt-6 pt-4 border-t border-slate-200 group">
                <summary className="cursor-pointer text-sm font-semibold text-slate-700 list-none flex items-center justify-between">
                  {t('excludeLabel')}
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <ul className="mt-3 space-y-2">
                  {excludeKeys.map((key) => (
                    <li key={key} className="text-sm text-slate-600 leading-relaxed">
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </details>
              <div className="mt-8">
                <ScheduleButton
                  variant="primary"
                  size="md"
                  icon
                  block
                  intent="website"
                  service="websites-brand"
                  need="new"
                  offer="founding"
                  className="w-full"
                >
                  {t('offerCta')}
                </ScheduleButton>
                <p className="mt-2 text-xs text-center text-slate-500">{t('offerCtaNote')}</p>
              </div>
            </Reveal>

            <Reveal className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{t('paymentEyebrow')}</p>
                <h3 className="text-lg font-serif font-bold text-slate-900">{t('paymentTitle')}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t('paymentDesc')}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{t('termsEyebrow')}</p>
                <ul className="space-y-2">
                  {termKeys.map((key) => (
                    <li key={key} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="process" className="scroll-mt-28 mb-16 pt-4 border-t border-slate-200">
          <ServiceSectionHeading title={t('processTitle')} description={t('processDesc')} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {processSteps.map(({ icon: Icon, titleKey, descKey }, index) => (
              <Reveal key={titleKey} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-primary-dark tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                  <Icon className="w-4 h-4 text-primary" aria-hidden />
                </div>
                <h3 className="font-serif font-bold text-slate-900">{t(titleKey)}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t(descKey)}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="faq" className="scroll-mt-28 mb-4 pt-4 border-t border-slate-200">
          <ServiceSectionHeading title={t('faqTitle')} className="mb-6" />
          <ServiceMiniFAQ namespace="foundingClient" keys={FOUNDING_CLIENT_FAQ_KEYS} />
        </section>

        <ServicePageCTA
          badge={t('ctaBadge')}
          title={t('ctaTitle')}
          subtitle={t('ctaSubtitle')}
          qualifier={t('ctaQualifier')}
          primaryCta={
            <ScheduleButton
              variant="secondary"
              size="lg"
              icon
              intent="website"
              service="websites-brand"
              need="new"
              offer="founding"
              className="bg-white text-slate-900 hover:bg-slate-100 border-0"
            >
              {t('ctaButton')}
            </ScheduleButton>
          }
          ctaSubtext={t('ctaSubtext')}
          links={[
            { href: '/website-design', label: t('ctaLinkWebsite') },
            { href: '/services/portfolio', label: t('ctaLinkPortfolio') },
          ]}
        />
      </div>

      <StickyMobileCTA
        label={t('heroCtaPrimary')}
        intent="website"
        service="websites-brand"
        need="new"
        offer="founding"
        sublabel={t('heroCtaSubtext')}
      />
    </section>
  )
}
