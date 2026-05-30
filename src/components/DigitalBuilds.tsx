'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import {
  Globe,
  Layers,
  ArrowRight,
  CheckCircle,
  Search,
  Layout,
  Hammer,
  Rocket,
  Package,
  Clock,
  Users,
  Cpu,
  Briefcase,
  ExternalLink,
  HelpCircle,
} from 'lucide-react'
import ScheduleButton from './CalendlyButton'
import BrowserFrame from './digital/BrowserFrame'
import {
  getPortfolioProofImages,
  portfolioImageAlts,
  portfolioItems,
  type PortfolioItemConfig,
} from '@/lib/digitalPortfolio'

const buildIcons = [Globe, Layers] as const
const buildAnchors = ['websites', 'platforms'] as const
const buildAccentStyles = [
  {
    bar: 'from-primary to-primary-dark',
    iconWrap: 'from-primary/10 to-primary/5 ring-primary/20',
    icon: 'text-primary',
    ideal: 'text-primary-darker bg-primary/5 border-primary/20',
  },
  {
    bar: 'from-primary-dark to-[#007a87]',
    iconWrap: 'from-primary/15 to-primary/5 ring-primary/25',
    icon: 'text-primary-dark',
    ideal: 'text-slate-800 bg-slate-50 border-primary/20',
  },
] as const

const buildSteps = [
  { icon: Search, titleKey: 'step1Title', stepKey: 'step1', hintKey: 'step1Hint' },
  { icon: Layout, titleKey: 'step2Title', stepKey: 'step2', hintKey: 'step2Hint' },
  { icon: Hammer, titleKey: 'step3Title', stepKey: 'step3', hintKey: 'step3Hint' },
  { icon: Rocket, titleKey: 'step4Title', stepKey: 'step4', hintKey: 'step4Hint' },
] as const

const credibilityItems = [
  { icon: Package, titleKey: 'credDeliverables', descKey: 'credDeliverablesDesc' },
  { icon: Clock, titleKey: 'credTimelines', descKey: 'credTimelinesDesc' },
  { icon: Users, titleKey: 'credCollaboration', descKey: 'credCollaborationDesc' },
  { icon: Cpu, titleKey: 'credStack', descKey: 'credStackDesc' },
] as const

const faqKeys = ['faq1', 'faq2', 'faq3'] as const
const fitKeys = ['fit1', 'fit2', 'fit3'] as const

function portfolioItemName(
  tPortfolio: ReturnType<typeof useTranslations<'digitalCreations'>>,
  item: PortfolioItemConfig,
) {
  const map = { t1: 't1Name', t3: 't3Name', t4: 't4Name', t5: 't5Name' } as const
  return tPortfolio(map[item.i18nPrefix])
}

function ProofThumbnails({
  category,
  locale,
}: {
  category: 'website' | 'platform'
  locale: string
}) {
  const proofs = getPortfolioProofImages(category)
  if (proofs.length === 0) return null

  return (
    <div className="flex gap-2 mt-3">
      {proofs.map((proof) => (
        <a
          key={proof.id}
          href={`/${locale}/digital-creations#${proof.id}`}
          className="relative w-20 h-14 rounded-lg overflow-hidden border border-slate-200 hover:border-primary/40 shadow-sm transition-all hover:scale-105"
          title={portfolioImageAlts[proof.id]}
        >
          {proof.imageUrl && (
            <Image src={proof.imageUrl} alt="" fill className="object-cover object-top" unoptimized sizes="80px" />
          )}
        </a>
      ))}
    </div>
  )
}

const DigitalBuilds = () => {
  const t = useTranslations('digitalBuilds')
  const tPortfolio = useTranslations('digitalCreations')
  const locale = useLocale()

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') },
  ]

  const builds = [
    {
      title: t('s0Title'),
      desc: t('s0Desc'),
      features: [t('s0F1'), t('s0F2'), t('s0F3')],
      deliverables: [t('s0D1'), t('s0D2'), t('s0D3'), t('s0D4')],
      deliverablesTitle: t('s0DeliverablesTitle'),
      ideal: t('s0Ideal'),
      outcome: t('s0Outcome'),
      notFor: t('s0NotFor'),
      icon: buildIcons[0],
      ctaService: 'websites-brand' as const,
      requestCta: t('s0RequestCta'),
      proofText: t('s0Proof'),
      proofHash: 'ken-effect',
      proofCategory: 'website' as const,
      timeline: t('websiteTimeline'),
      anchor: buildAnchors[0],
      featuredProof: portfolioItems.find((p) => p.id === 'ken-effect'),
    },
    {
      title: t('s1Title'),
      desc: t('s1Desc'),
      features: [t('s1F1'), t('s1F2'), t('s1F3')],
      deliverables: [t('s1D1'), t('s1D2'), t('s1D3'), t('s1D4')],
      deliverablesTitle: t('s1DeliverablesTitle'),
      ideal: t('s1Ideal'),
      outcome: t('s1Outcome'),
      notFor: t('s1NotFor'),
      icon: buildIcons[1],
      ctaService: 'custom-platforms' as const,
      requestCta: t('s1RequestCta'),
      proofText: t('s1Proof'),
      proofHash: 'business-cocoon',
      proofCategory: 'platform' as const,
      timeline: t('platformTimeline'),
      anchor: buildAnchors[1],
      featuredProof: portfolioItems.find((p) => p.id === 'business-cocoon'),
    },
  ]

  const subtitleParts = t('subtitle').split(t('subtitleHighlight'))
  const hasHighlight = subtitleParts.length > 1

  return (
    <section id="digital-builds" className="section-padding relative">
      {/* Hero band */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-primary/5 px-6 py-10 lg:px-12 lg:py-14 mb-14 shadow-card"
      >
        <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative text-center max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">{t('heroEyebrow')}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-slate-900 leading-tight">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {hasHighlight ? (
              <>
                {subtitleParts[0]}
                <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent font-semibold">
                  {t('subtitleHighlight')}
                </span>
                {subtitleParts[1]}
              </>
            ) : (
              t('subtitle')
            )}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ScheduleButton variant="primary" size="lg" icon className="shadow-md">
              {t('ctaButton')}
            </ScheduleButton>
            <Link
              href="/digital-creations"
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-primary/40 hover:text-primary transition-colors shadow-sm"
            >
              {t('heroCtaPortfolio')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-sm px-4 py-3"
              >
                <p className="text-xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Consulting vs Building */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-10"
      >
        <Link
          href="/services"
          className="group rounded-xl border border-slate-200 bg-slate-50 p-5 text-left hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-slate-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('compareConsultingLabel')}</p>
          </div>
          <p className="text-sm text-slate-700">{t('compareConsultingDesc')}</p>
          <span className="mt-3 inline-flex items-center text-sm font-medium text-slate-600 group-hover:text-primary">
            {t('compareConsultingLink')}
            <ArrowRight className="ml-1 w-3.5 h-3.5" />
          </span>
        </Link>
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-5 text-left ring-1 ring-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Hammer className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t('compareBuildingLabel')}</p>
          </div>
          <p className="text-sm text-slate-700">{t('compareBuildingDesc')}</p>
        </div>
      </motion.div>

      {/* Anchor pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {builds.map((build) => (
          <a
            key={build.anchor}
            href={`#${build.anchor}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-primary/40 hover:text-primary shadow-sm transition-colors"
          >
            {build.title}
          </a>
        ))}
      </div>

      {/* Service tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
        {builds.map((build, index) => {
          const accent = buildAccentStyles[index]
          const proof = build.featuredProof
          return (
            <motion.div
              key={build.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              id={build.anchor}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-200 hover:border-primary/35 flex flex-col scroll-mt-28"
            >
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent.bar}`} />
              {proof && (
                <div className="p-4 pb-0 bg-slate-50/50 border-b border-slate-100">
                  <BrowserFrame
                    imageUrl={proof.imageUrl}
                    imageAlt={portfolioImageAlts[proof.id]}
                    brandPreview={proof.brandPreview}
                    domain={proof.domain}
                    className="shadow-md"
                  />
                </div>
              )}
              <div className="p-8 lg:p-9 flex flex-col flex-1">
                <div className="mb-5">
                  <div className={`w-14 h-14 bg-gradient-to-br ring-1 rounded-xl flex items-center justify-center mb-4 ${accent.iconWrap}`}>
                    <build.icon className={`w-7 h-7 ${accent.icon}`} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-2">{build.title}</h2>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide">{build.timeline}</p>
                </div>

                <p className="text-slate-600 text-base leading-relaxed mb-4">{build.desc}</p>
                <p className={`text-sm border rounded-lg px-3 py-2 mb-5 ${accent.ideal}`}>{build.ideal}</p>

                <div className="space-y-3 mb-6">
                  <p className="text-sm text-slate-700">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary-dark mr-2">
                      {t('outcomeLabel')}
                    </span>
                    {build.outcome}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-600 mr-2">
                      {t('notForLabel')}
                    </span>
                    {build.notFor}
                  </p>
                </div>

                <ul className="space-y-2 mb-6">
                  {build.features.map((feature) => (
                    <li key={feature} className="flex items-start text-sm text-slate-600">
                      <CheckCircle className={`w-4 h-4 mr-2 flex-shrink-0 mt-0.5 ${accent.icon}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mb-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">{build.deliverablesTitle}</p>
                  <ul className="space-y-2">
                    {build.deliverables.map((item) => (
                      <li key={item} className="flex items-start text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-5 border-t border-slate-200 space-y-3">
                  <Link
                    href={{ pathname: '/schedule', query: { service: build.ctaService } }}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 text-sm transition-colors"
                  >
                    {build.requestCta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                  <a
                    href={`/${locale}/digital-creations#${build.proofHash}`}
                    className="inline-flex w-full items-center justify-center text-primary font-medium py-2 px-4 rounded-lg text-sm border border-primary/25 hover:bg-primary/5 transition-colors"
                  >
                    {build.proofText}
                    <ExternalLink className="ml-2 w-3.5 h-3.5" />
                  </a>
                  <ProofThumbnails category={build.proofCategory} locale={locale} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Live proof gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 rounded-2xl border border-slate-200 bg-white p-6 lg:p-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">{t('proofEyebrow')}</p>
            <h2 className="text-2xl font-serif font-bold text-slate-900">{t('proofTitle')}</h2>
            <p className="mt-2 text-slate-600 max-w-2xl text-sm">{t('proofDesc')}</p>
          </div>
          <Link href="/digital-creations" className="inline-flex items-center text-primary font-semibold text-sm hover:underline shrink-0">
            {t('crossLinkOurWork')}
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {portfolioItems.map((item) => (
            <a
              key={item.id}
              href={item.tryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-slate-200 overflow-hidden hover:border-primary/35 hover:shadow-card-hover transition-all"
            >
              <div className="relative h-28 bg-slate-100">
                {item.brandPreview ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-primary/5">
                    <span className="font-serif font-bold text-slate-800">ROALLA</span>
                  </div>
                ) : item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={portfolioImageAlts[item.id]}
                    fill
                    className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                    unoptimized
                    sizes="240px"
                  />
                ) : null}
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm text-slate-900 group-hover:text-primary transition-colors">
                  {portfolioItemName(tPortfolio, item)}
                </p>
                {item.domain && <p className="text-xs text-slate-500 mt-0.5">{item.domain}</p>}
              </div>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Good fit */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 grid lg:grid-cols-2 gap-6"
      >
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:p-8">
          <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">{t('fitTitle')}</h2>
          <ul className="space-y-3">
            {fitKeys.map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                {t(key)}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 lg:p-8 flex flex-col justify-center">
          <HelpCircle className="w-8 h-8 text-primary mb-3" />
          <p className="text-slate-700 leading-relaxed mb-4">{t('fitConsultingNote')}</p>
          <Link href="/services" className="inline-flex items-center text-primary font-semibold text-sm hover:underline">
            {t('compareConsultingLink')}
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* Credibility */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-8 md:p-10"
      >
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 text-center">{t('credibilityTitle')}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {credibilityItems.map((item) => (
            <div key={item.titleKey} className="text-left rounded-xl bg-white border border-slate-200 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-semibold text-slate-900 text-sm mb-1">{t(item.titleKey)}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{t(item.descKey)}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Build process */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm"
      >
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2">{t('buildTitle')}</h2>
        <p className="text-slate-600 mb-8">{t('buildSubtitle')}</p>
        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {buildSteps.map((step, idx) => (
              <div
                key={step.stepKey}
                className="relative rounded-xl border border-slate-200 bg-slate-50 p-5 hover:border-primary/25 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="relative z-10 w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-semibold text-slate-900 text-sm mb-1">{t(step.titleKey)}</p>
                <p className="text-xs text-primary font-medium mb-2">{t(step.hintKey)}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{t(step.stepKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mini FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 lg:p-10"
      >
        <h2 className="text-xl font-serif font-bold text-slate-900 mb-6">{t('faqTitle')}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {faqKeys.map((key) => (
            <div key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-semibold text-slate-900 text-sm mb-2">{t(`${key}Q` as `${typeof key}Q`)}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{t(`${key}A` as `${typeof key}A`)}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        id="cta"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-primary via-primary-dark to-[#007a87] rounded-2xl p-10 md:p-16 mt-16 text-center shadow-[0_25px_80px_rgba(0,180,197,0.25)] relative border border-primary/20 overflow-hidden"
      >
        <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
        <div className="relative z-10">
          <span className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white mb-4">
            {t('ctaBadge')}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">{t('ctaTitle')}</h2>
          <p className="text-xl text-white/95 mb-6 max-w-2xl mx-auto">{t('ctaSubtitle')}</p>
          <p className="text-sm text-white/90 mb-8 max-w-2xl mx-auto">{t('ctaQualifier')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ScheduleButton variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-[1.03] transition-transform shadow-2xl">
              {t('ctaButton')}
            </ScheduleButton>
            <Link
              href="/digital-creations"
              className="inline-flex items-center justify-center bg-white/15 hover:bg-white/25 text-white font-semibold py-4 px-8 rounded-lg border-2 border-white/30 transition-all"
            >
              {t('heroCtaPortfolio')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/85">
            <Link href="/services" className="underline hover:text-white inline-flex items-center">
              {t('crossLinkConsulting')}
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default DigitalBuilds
