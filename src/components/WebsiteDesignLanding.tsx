'use client'

import React from 'react'
import Image from 'next/image'
import Reveal from './motion/Reveal'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  Check,
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
import StickyMobileCTA from './StickyMobileCTA'
import ServiceMiniFAQ from './services/ServiceMiniFAQ'
import BrowserFrame from './digital/BrowserFrame'
import WebsiteDesignLogoStrip from './WebsiteDesignLogoStrip'
import {
  getPortfolioItem,
  portfolioImageAlts,
  type PortfolioItemId,
} from '@/lib/digitalPortfolio'

const ENTRY_PAGE = '/website-design'
const CAMPAIGN = 'website-design'

const WEBSITE_PORTFOLIO_IDS = ['kaylan-kaptures', 'wj-wellness', 'goalie-stop'] as const satisfies readonly PortfolioItemId[]

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
  'kaylan-kaptures': 't15Name',
  'wj-wellness': 't18Name',
  'goalie-stop': 't12Name',
} as const

const portfolioDescKeys = {
  'kaylan-kaptures': 't15CaseStudy',
  'wj-wellness': 't18CaseStudy',
  'goalie-stop': 't12CaseStudy',
} as const

function estimateHref(conversionSource: string, need?: string) {
  return {
    pathname: '/website-estimate' as const,
    query: {
      campaign: CAMPAIGN,
      conversion_source: conversionSource,
      entry_page: ENTRY_PAGE,
      ...(need ? { need } : {}),
    },
  }
}

function contactHref(conversionSource: string, need?: string, reference?: string) {
  return {
    pathname: '/contact' as const,
    query: {
      intent: 'website',
      service: 'websites-brand',
      campaign: CAMPAIGN,
      conversion_source: conversionSource,
      entry_page: ENTRY_PAGE,
      from_page: ENTRY_PAGE,
      ...(need ? { need } : {}),
      ...(reference ? { reference } : {}),
    },
  }
}

function SectionHeading({
  eyebrow,
  title,
  description,
  tone = 'light',
}: {
  eyebrow?: string
  title: string
  description?: string
  tone?: 'light' | 'dark'
}) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow ? (
        <p
          className={[
            'text-xs font-bold uppercase tracking-[0.18em]',
            tone === 'dark' ? 'text-cyan-300' : 'text-primary-dark',
          ].join(' ')}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={[
          'mt-3 font-serif text-3xl font-bold sm:text-4xl',
          tone === 'dark' ? 'text-white' : 'text-slate-950',
        ].join(' ')}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={[
            'mt-4 text-base leading-7',
            tone === 'dark' ? 'text-slate-300' : 'text-slate-600',
          ].join(' ')}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}

export default function WebsiteDesignLanding() {
  const t = useTranslations('websiteDesign')
  const tPortfolio = useTranslations('digitalCreations')

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label'), icon: Clock },
    { value: t('stat2Value'), label: t('stat2Label'), icon: Globe },
    { value: t('stat3Value'), label: t('stat3Label'), icon: Sparkles },
  ]

  const jumpItems = [
    { id: 'market', label: t('marketNav') },
    { id: 'offer', label: t('offerNav') },
    { id: 'process', label: t('processNav') },
    { id: 'work', label: t('workNav') },
    { id: 'fit', label: t('fitNav') },
    { id: 'faq', label: t('faqNav') },
  ]

  return (
    <div id="website-design">
      <section
        data-header-tone="dark"
        className="relative isolate overflow-hidden bg-slate-950 px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8 lg:pb-20 lg:pt-36"
      >
        <div className="absolute inset-0 -z-10" aria-hidden>
          <Image
            src="/images/services/website-design-hero.opt.webp"
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[72%_center] opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-slate-950/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/35 via-transparent to-slate-950/80" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <Reveal when="mount">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{t('heroEyebrow')}</p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              {t('heroTitle')}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">{t('heroSubtitle')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={estimateHref('website_design_hero')}
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-gold px-6 py-3 font-bold text-slate-950 hover:bg-brand-gold-light"
              >
                {t('heroCtaPrimary')}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={contactHref('website_design_hero_contact', 'new')}
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/15"
              >
                {t('heroCtaSecondary')}
              </Link>
              <Link
                href="/services/portfolio"
                className="inline-flex min-h-12 items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-slate-200 underline-offset-4 hover:text-white hover:underline"
              >
                {t('heroCtaTertiary')}
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-400">{t('heroCtaSubtext')}</p>
          </Reveal>

          <Reveal when="mount" delayMs={100} className="rounded-2xl border border-white/15 bg-slate-950/70 p-5 backdrop-blur-sm sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">{t('heroProofTitle')}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{t('heroProofSubtitle')}</p>
            <ul className="mt-5 space-y-3">
              {[t('heroOutcome1'), t('heroOutcome2'), t('heroOutcome3')].map((item) => (
                <li key={item} className="flex gap-3 text-sm font-medium leading-6 text-slate-100">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal when="mount" delayMs={140} className="relative mx-auto mt-10 grid max-w-6xl gap-3 border-t border-white/15 pt-6 sm:grid-cols-3">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3 text-sm text-slate-200">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-cyan-300">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span>
                <span className="block font-serif text-xl font-bold text-white">{value}</span>
                <span className="text-slate-400">{label}</span>
              </span>
            </div>
          ))}
        </Reveal>
        <p className="relative mx-auto mt-4 max-w-6xl text-xs text-slate-400">{t('heroStatsNote')}</p>
      </section>

      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <WebsiteDesignLogoStrip eyebrow={t('logoStripEyebrow')} listLabel={t('logoStripLabel')} />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-slate-600">
          {t('foundingPromoQuiet')}{' '}
          <Link
            href="/website-package"
            className="font-semibold text-primary-dark underline-offset-4 hover:underline"
          >
            {t('foundingPromoCta')}
          </Link>
        </p>
      </div>

      <nav
        aria-label={t('jumpNavLabel')}
        className="sticky top-16 z-20 border-y border-slate-200 bg-white/95 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {jumpItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary/40 hover:text-primary-dark"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <section id="market" className="scroll-mt-28 bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow={t('marketEyebrow')} title={t('marketTitle')} description={t('marketDesc')} />
          <ul className="grid gap-3 md:grid-cols-2">
            {marketPainKeys.map((key) => (
              <Reveal as="li" key={key} className="flex gap-3 border-t border-slate-200 pt-4">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                <p className="text-sm leading-6 text-slate-700">{t(key)}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-8 border-l-2 border-primary/50 pl-4">
            <p className="text-base font-medium leading-7 text-slate-800">{t('marketResolution')}</p>
          </Reveal>
        </div>
      </section>

      <section id="offer" className="scroll-mt-28 border-y border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow={t('offerEyebrow')} title={t('offerTitle')} description={t('offerDesc')} />
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <Reveal className="rounded-2xl border border-brand-gold/40 bg-gradient-to-br from-brand-gold/15 via-white to-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-slate-950 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-gold">
                  {t('offerBadge')}
                </span>
                <span className="text-sm font-medium text-slate-600">{t('offerTimeline')}</span>
              </div>
              <h3 className="mt-4 font-serif text-2xl font-bold text-slate-950">{t('offerName')}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t('offerIdeal')}</p>
              <ul className="mt-6 space-y-3">
                {offerIncludeKeys.map((key) => (
                  <li key={key} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {t(key)}
                  </li>
                ))}
              </ul>
              <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('offerNotIncludedLabel')}
                </p>
                <ul className="space-y-2">
                  {offerNotIncludeKeys.map((key) => (
                    <li key={key} className="text-sm leading-relaxed text-slate-600">
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={estimateHref('website_design_offer', 'new')}
                  className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-bold text-slate-950 hover:bg-primary-light"
                >
                  {t('offerCta')}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href={contactHref('website_design_offer_contact', 'new')}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:border-slate-400"
                >
                  {t('offerContactCta')}
                </Link>
              </div>
              <p className="mt-3 text-center text-xs text-slate-500">{t('offerCtaNote')}</p>
            </Reveal>

            <Reveal className="space-y-4">
              <div className="border-t-2 border-primary/30 bg-white px-5 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
                  {t('redesignEyebrow')}
                </p>
                <h3 className="mt-2 font-serif text-xl font-bold text-slate-950">{t('redesignTitle')}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t('redesignDesc')}</p>
                <Link
                  href={estimateHref('website_design_redesign', 'redesign')}
                  className="mt-4 inline-flex items-center text-sm font-bold text-primary-dark underline-offset-4 hover:underline"
                >
                  {t('redesignCta')}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </div>
              <div className="border-t-2 border-primary/30 bg-white px-5 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
                  {t('conversionEyebrow')}
                </p>
                <h3 className="mt-2 font-serif text-xl font-bold text-slate-950">{t('conversionTitle')}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t('conversionDesc')}</p>
                <Link
                  href={estimateHref('website_design_conversion', 'conversion')}
                  className="mt-4 inline-flex items-center text-sm font-bold text-primary-dark underline-offset-4 hover:underline"
                >
                  {t('conversionCta')}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </div>
              <p className="px-1 text-sm leading-relaxed text-slate-500">
                {t('offerFootnote')}{' '}
                <Link
                  href="/services/digital"
                  className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
                >
                  {t('offerFootnoteLink')}
                </Link>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section
        id="evidence"
        className="scroll-mt-28 bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{t('evidenceEyebrow')}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">{t('evidenceTitle')}</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">{t('evidenceLead')}</p>
          </Reveal>
          <Reveal delayMs={80}>
            <Link
              href={estimateHref('website_design_evidence')}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-gold px-6 py-3 font-bold text-slate-950 hover:bg-brand-gold-light"
            >
              {t('evidenceCta')}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="process" className="scroll-mt-28 bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading title={t('processTitle')} description={t('processDesc')} />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map(({ icon: Icon, titleKey, descKey, hintKey }, index) => (
              <Reveal as="li" key={titleKey} className="border-t border-slate-200 pt-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>
                  <Icon className="h-4 w-4 text-primary-dark" aria-hidden />
                </div>
                <h3 className="mt-4 font-serif text-xl font-bold text-slate-950">{t(titleKey)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t(descKey)}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-primary-dark">
                  {t(hintKey)}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="work"
        className="scroll-mt-28 border-y border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow={t('workEyebrow')} title={t('workTitle')} description={t('workDesc')} />
          <div className="grid gap-6 md:grid-cols-3">
            {WEBSITE_PORTFOLIO_IDS.map((id) => {
              const item = getPortfolioItem(id)
              if (!item?.imageUrl) return null
              const nameKey = portfolioNameKeys[id]
              const descKey = portfolioDescKeys[id]
              return (
                <Reveal
                  key={id}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <BrowserFrame
                    imageUrl={item.imageUrl}
                    imageAlt={portfolioImageAlts[id]}
                    domain={item.domain}
                    className="rounded-none border-0 shadow-none"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-serif text-xl font-bold text-slate-950">{tPortfolio(nameKey)}</h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{tPortfolio(descKey)}</p>
                    <div className="mt-4 flex flex-col gap-2">
                      <a
                        href={item.tryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:border-slate-400"
                      >
                        {t('workVisitSite')}
                        <ExternalLink className="ml-2 h-3.5 w-3.5" aria-hidden />
                      </a>
                      <Link
                        href={contactHref('website_design_portfolio_similar', 'new', id)}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-slate-950 hover:bg-primary-light"
                      >
                        {t('workSimilarCta')}
                      </Link>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/services/portfolio"
              className="inline-flex items-center font-bold text-primary-dark underline-offset-4 hover:underline"
            >
              {t('workPortfolioCta')}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section id="fit" className="scroll-mt-28 bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div>
            <SectionHeading title={t('fitTitle')} />
            <ul className="space-y-3">
              {fitKeys.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading title={t('notFitTitle')} />
            <ul className="space-y-3">
              {notFitKeys.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                  {t(key)}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate-600">
              {t('notFitNote')}{' '}
              <Link
                href="/services/digital"
                className="font-medium text-primary-dark underline underline-offset-2"
              >
                {t('notFitLink')}
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="scroll-mt-28 border-t border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading title={t('faqTitle')} />
          <ServiceMiniFAQ namespace="websiteDesign" />
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{t('ctaBadge')}</p>
            <h2 className="mt-3 max-w-3xl font-serif text-3xl font-bold sm:text-4xl">{t('ctaTitle')}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{t('ctaSubtitle')}</p>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">{t('ctaQualifier')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={estimateHref('website_design_footer')}
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-gold px-6 py-3 font-bold text-slate-950 hover:bg-brand-gold-light"
              >
                {t('ctaButton')}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={contactHref('website_design_footer_contact', 'new')}
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/15"
              >
                {t('ctaContact')}
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-400">{t('ctaSubtext')}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-slate-300">
              <Link href="/services/portfolio" className="underline-offset-4 hover:text-white hover:underline">
                {t('ctaLinkPortfolio')}
              </Link>
              <Link href="/services/digital" className="underline-offset-4 hover:text-white hover:underline">
                {t('ctaLinkDigital')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <StickyMobileCTA
        label={t('heroCtaPrimary')}
        intent="website"
        service="websites-brand"
        need="new"
        sublabel={t('heroCtaSubtext')}
      />
    </div>
  )
}
