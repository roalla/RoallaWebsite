'use client'

import React from 'react'
import Reveal from './motion/Reveal'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  Languages,
  Lock,
  MapPin,
  Rocket,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import ScheduleButton from './ScheduleButton'
import StickyMobileCTA from './StickyMobileCTA'
import ServiceMiniFAQ from './services/ServiceMiniFAQ'
import Breadcrumb from './Breadcrumb'
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

const includeKeys = ['include1', 'include2', 'include3', 'include4', 'include5', 'include6'] as const
const excludeKeys = ['exclude1', 'exclude2', 'exclude3', 'exclude4'] as const
const addonKeys = ['addon1', 'addon2', 'addon3'] as const
const termKeys = ['term1', 'term2', 'term3'] as const
const processSteps = [
  { icon: MapPin, titleKey: 'process1Title', descKey: 'process1Desc' },
  { icon: DollarSign, titleKey: 'process2Title', descKey: 'process2Desc' },
  { icon: Rocket, titleKey: 'process3Title', descKey: 'process3Desc' },
  { icon: ShieldCheck, titleKey: 'process4Title', descKey: 'process4Desc' },
] as const
const coverageKeys = ['coverage1', 'coverage2', 'coverage3'] as const
const valueKeys = ['value1', 'value2', 'value3'] as const
const certKeys = ['certItil', 'certAi', 'certSecurity', 'certExecutive'] as const

export default function FoundingClientLanding() {
  const t = useTranslations('foundingClient')
  const tBc = useTranslations('breadcrumb')

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label'), icon: DollarSign },
    { value: t('stat2Value'), label: t('stat2Label'), icon: Clock },
    { value: t('stat3Value'), label: t('stat3Label'), icon: Globe },
  ]

  return (
    <section id="founding-client" className="section-padding relative">
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

      <Breadcrumb
        items={[
          { label: tBc('home'), href: '/' },
          { label: tBc('websiteDesign'), href: '/website-design' },
          { label: tBc('foundingClient') },
        ]}
      />

      <div className="max-w-6xl mx-auto">
        <Reveal className="mb-10 rounded-xl border border-amber-200 bg-amber-50/80 px-5 py-4 flex flex-wrap items-center gap-3">
          <Languages className="w-5 h-5 text-amber-800 shrink-0" aria-hidden />
          <p className="text-sm text-amber-950 leading-relaxed flex-1">{t('languageBanner')}</p>
        </Reveal>

        <ServiceAnchorNav
          label={t('jumpNavLabel')}
          items={[
            { id: 'why', label: t('whyNav') },
            { id: 'offer', label: t('offerNav') },
            { id: 'process', label: t('processNav') },
            { id: 'coverage', label: t('coverageNav') },
            { id: 'faq', label: t('faqNav') },
          ]}
        />

        <section id="why" className="scroll-mt-28 mb-16">
          <ServiceSectionHeading
            eyebrow={t('whyEyebrow')}
            title={t('whyTitle')}
            description={t('whyDesc')}
          />
          <Reveal className="flex flex-wrap gap-2 mb-6">
            {certKeys.map((key) => (
              <span
                key={key}
                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-dark"
              >
                {t(key)}
              </span>
            ))}
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {valueKeys.map((key, index) => {
              const icons = [Briefcase, Award, Lock] as const
              const Icon = icons[index] ?? Briefcase
              return (
                <Reveal key={key} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <Icon className="w-5 h-5 text-primary mb-3" aria-hidden />
                  <p className="text-sm text-slate-700 leading-relaxed">{t(key)}</p>
                </Reveal>
              )
            })}
          </div>
          <Reveal className="mt-6 rounded-xl border border-slate-200 bg-slate-50/80 p-5 md:p-6">
            <p className="text-sm md:text-base text-slate-800 leading-relaxed">{t('whyResolution')}</p>
          </Reveal>
        </section>

        <section id="offer" className="scroll-mt-28 mb-16 pt-4 border-t border-slate-200">
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
              <p className="text-sm text-slate-600 leading-relaxed">{t('offerIdeal')}</p>
              <ul className="mt-6 space-y-3">
                {includeKeys.map((key) => (
                  <li key={key} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                    {t(key)}
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{t('excludeLabel')}</p>
                <ul className="space-y-2">
                  {excludeKeys.map((key) => (
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
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{t('addonEyebrow')}</p>
                <ul className="space-y-3">
                  {addonKeys.map((key) => (
                    <li key={key} className="text-sm text-slate-700 leading-relaxed">
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

        <section id="coverage" className="scroll-mt-28 mb-16 pt-4 border-t border-slate-200">
          <ServiceSectionHeading
            eyebrow={t('coverageEyebrow')}
            title={t('coverageTitle')}
            description={t('coverageDesc')}
          />
          <div className="grid md:grid-cols-3 gap-4">
            {coverageKeys.map((key) => (
              <Reveal key={key} className="rounded-xl border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-sm text-slate-700 leading-relaxed">{t(key)}</p>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-600 leading-relaxed">{t('coverageFootnote')}</p>
        </section>

        <section id="faq" className="scroll-mt-28 mb-4 pt-4 border-t border-slate-200">
          <ServiceSectionHeading title={t('faqTitle')} className="mb-6" />
          <ServiceMiniFAQ namespace="foundingClient" />
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
