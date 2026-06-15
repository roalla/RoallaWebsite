'use client'

import React from 'react'
import Reveal from './motion/Reveal'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  Globe,
  Layers,
  Workflow,
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
  ExternalLink,
} from 'lucide-react'
import ScheduleButton from './ScheduleButton'
import StickyMobileCTA from './StickyMobileCTA'
import ServiceMiniFAQ from './services/ServiceMiniFAQ'
import ServiceTestimonialBand from './services/ServiceTestimonialBand'
import Breadcrumb from './Breadcrumb'
import BrowserFrame from './digital/BrowserFrame'
import BrandJourneyBand from './services/BrandJourneyBand'
import {
  getOrderedPortfolioItems,
  portfolioImageAlts,
  type PortfolioItemConfig,
} from '@/lib/digitalPortfolio'
import {
  BRAND_PILLARS,
  DIGITAL_PILLAR_INTRO_KEYS,
  PILLAR_BADGE_KEYS,
  PILLAR_CTA_KEYS,
  PILLAR_SECTION_IDS,
  PILLAR_TITLE_KEYS,
  START_HERE_KEYS,
  BUILD_PHASE_LABEL_KEYS,
  BUILD_PHASE_RANGE_KEYS,
  type BrandPillar,
} from '@/lib/brand-journey'
import {
  ServicePageHero,
  ConsultingHeroVisual,
  ServiceAnchorNav,
  ServiceSectionHeading,
  ServicePageCTA,
  PillarBadge,
  PillarSectionHeader,
  pillarSectionClass,
  serviceCardClass,
  serviceSecondaryButtonClass,
  serviceHeroSecondaryButtonClass,
  servicePrimaryLinkClass,
} from './services/ServicePageSections'

const buildIcons = [Globe, Layers, Workflow] as const
const buildAnchors = ['websites', 'platforms', 'automation'] as const

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

const fitKeys = ['fit1', 'fit2', 'fit3'] as const

const BUILD_PILLARS: Record<(typeof buildAnchors)[number], BrandPillar> = {
  websites: 'emerge',
  platforms: 'soar',
  automation: 'soar',
}

function portfolioItemName(
  tPortfolio: ReturnType<typeof useTranslations<'digitalCreations'>>,
  item: PortfolioItemConfig,
) {
  const map = { t1: 't1Name', t3: 't3Name', t4: 't4Name', t5: 't5Name', t6: 't6Name', t7: 't7Name' } as const
  return tPortfolio(map[item.i18nPrefix])
}

type DigitalBuild = {
  title: string
  desc: string
  features: string[]
  deliverables: string[]
  deliverablesTitle: string
  ideal: string
  outcome: string
  notFor: string
  icon: typeof buildIcons[number]
  ctaService: 'websites-brand' | 'custom-platforms'
  requestCta: string
  proofText: string
  proofHash: string
  timeline: string
  anchor: string
  pillar: BrandPillar
}

function DigitalBuildCard({
  build,
  t,
  locale,
}: {
  build: DigitalBuild
  t: ReturnType<typeof useTranslations<'digitalBuilds'>>
  locale: string
}) {
  const tBrand = useTranslations('brandJourney')

  return (
    <Reveal as="article" id={build.anchor} className={serviceCardClass}>
      <div className="p-7 lg:p-8 flex flex-col flex-1">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-11 h-11 shrink-0 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center">
            <build.icon className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2">
              <PillarBadge label={tBrand(PILLAR_BADGE_KEYS[build.pillar])} />
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900">{build.title}</h3>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{build.timeline}</p>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{build.desc}</p>
          </div>
        </div>

        <p className="text-sm text-slate-700 border-l-2 border-primary/30 pl-3 mb-5 leading-relaxed">{build.ideal}</p>

        <div className="space-y-3 mb-5 text-sm">
          <p className="text-slate-700">
            <span className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">{t('outcomeLabel')}</span>
            {build.outcome}
          </p>
          <p className="text-slate-600">
            <span className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">{t('notForLabel')}</span>
            {build.notFor}
          </p>
        </div>

        <ul className="space-y-2 mb-6">
          {build.features.map((feature) => (
            <li key={feature} className="flex items-start text-sm text-slate-600">
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">{build.deliverablesTitle}</p>
          <ul className="space-y-2">
            {build.deliverables.map((item) => (
              <li key={item} className="flex items-start text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-5 border-t border-slate-100 space-y-2.5">
          <Link
            href={{ pathname: '/schedule', query: { service: build.ctaService } }}
            className={servicePrimaryLinkClass}
          >
            {build.requestCta}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <a
            href={`/${locale}/digital-creations#${build.proofHash}`}
            className="inline-flex w-full items-center justify-center text-slate-700 font-medium py-2.5 px-4 rounded-md text-sm border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            {build.proofText}
            <ExternalLink className="ml-2 w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </Reveal>
  )
}

function BuildStepCards({
  stepIndices,
  t,
  tBrand,
  pillar,
}: {
  stepIndices: number[]
  t: ReturnType<typeof useTranslations<'digitalBuilds'>>
  tBrand: ReturnType<typeof useTranslations<'brandJourney'>>
  pillar: BrandPillar
}) {
  return (
    <div className={`grid gap-5 ${stepIndices.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
      {stepIndices.map((idx) => {
        const step = buildSteps[idx]
        return (
          <div key={step.stepKey} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center">
                {idx + 1}
              </span>
              <step.icon className="w-4 h-4 text-primary" />
              {idx === stepIndices[0] && <PillarBadge label={tBrand(BUILD_PHASE_LABEL_KEYS[pillar])} />}
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
              {tBrand(BUILD_PHASE_RANGE_KEYS[pillar])}
            </p>
            <p className="font-semibold text-slate-900 text-sm mb-1">{t(step.titleKey)}</p>
            <p className="text-xs text-slate-500 mb-2">{t(step.hintKey)}</p>
            <p className="text-sm text-slate-600 leading-relaxed">{t(step.stepKey)}</p>
          </div>
        )
      })}
    </div>
  )
}

const DigitalBuilds = () => {
  const t = useTranslations('digitalBuilds')
  const tBrand = useTranslations('brandJourney')
  const tBc = useTranslations('breadcrumb')
  const tPortfolio = useTranslations('digitalCreations')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label'), icon: Package },
    { value: t('stat2Value'), label: t('stat2Label'), icon: Rocket },
    { value: t('stat3Value'), label: t('stat3Label'), icon: Users },
  ]

  const builds: DigitalBuild[] = [
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
      ctaService: 'websites-brand',
      requestCta: t('s0RequestCta'),
      proofText: t('s0Proof'),
      proofHash: 'ken-effect',
      timeline: t('websiteTimeline'),
      anchor: buildAnchors[0],
      pillar: BUILD_PILLARS.websites,
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
      ctaService: 'custom-platforms',
      requestCta: t('s1RequestCta'),
      proofText: t('s1Proof'),
      proofHash: 'business-cocoon',
      timeline: t('platformTimeline'),
      anchor: buildAnchors[1],
      pillar: BUILD_PILLARS.platforms,
    },
    {
      title: t('s2Title'),
      desc: t('s2Desc'),
      features: [t('s2F1'), t('s2F2'), t('s2F3')],
      deliverables: [t('s2D1'), t('s2D2'), t('s2D3'), t('s2D4')],
      deliverablesTitle: t('s2DeliverablesTitle'),
      ideal: t('s2Ideal'),
      outcome: t('s2Outcome'),
      notFor: t('s2NotFor'),
      icon: buildIcons[2],
      ctaService: 'custom-platforms',
      requestCta: t('s2RequestCta'),
      proofText: t('s2Proof'),
      proofHash: 'business-cocoon',
      timeline: t('automationTimeline'),
      anchor: buildAnchors[2],
      pillar: BUILD_PILLARS.automation,
    },
  ]

  const websiteBuild = builds[0]
  const platformBuild = builds[1]
  const automationBuild = builds[2]

  return (
    <section id="digital-builds" className="section-padding relative">
      <ServicePageHero
        variant="digital"
        eyebrow={t('heroEyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        subtitleHighlight={t('subtitleHighlight')}
        journeyLine={t('heroJourneyLine')}
        stats={stats}
        visual={
          <ConsultingHeroVisual
            icon={Layers}
            proofTitle={t('heroProofTitle')}
            proofSubtitle={t('heroProofSubtitle')}
            outcomes={[t('heroOutcome1'), t('heroOutcome2'), t('heroOutcome3')]}
          />
        }
        primaryCta={
          <ScheduleButton variant="primary" size="lg" icon>
            {t('ctaButton')}
          </ScheduleButton>
        }
        secondaryCta={
          <Link href="/digital-creations" className={serviceHeroSecondaryButtonClass}>
            {t('heroCtaPortfolio')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        }
        ctaSubtext={tCommon('ctaSubtext')}
      />

      <Breadcrumb
        items={[
          { label: tBc('home'), href: '/' },
          { label: tBc('services'), href: '/services' },
          { label: tBc('websitesAndDigital') },
        ]}
      />

      <div className="max-w-6xl mx-auto">
        <BrandJourneyBand />

        <ServiceAnchorNav
          label={tBrand('jumpNavPillars')}
          items={[]}
          groups={[
            {
              groupLabel: tBrand('jumpNavPillars'),
              items: BRAND_PILLARS.map((pillar) => ({
                id: PILLAR_SECTION_IDS[pillar],
                label: tBrand(PILLAR_TITLE_KEYS[pillar]),
              })),
            },
            {
              groupLabel: t('buildTitle'),
              items: builds.map((b) => ({ id: b.anchor, label: b.title })),
            },
          ]}
        />

        {BRAND_PILLARS.map((pillar) => (
          <section key={pillar} id={PILLAR_SECTION_IDS[pillar]} className={pillarSectionClass}>
            <PillarSectionHeader
              pillarTitle={tBrand(PILLAR_TITLE_KEYS[pillar])}
              intro={tBrand(DIGITAL_PILLAR_INTRO_KEYS[pillar])}
              startHere={tBrand(START_HERE_KEYS[pillar])}
              phaseRange={tBrand(BUILD_PHASE_RANGE_KEYS[pillar])}
            />
            {pillar === 'prepare' && <BuildStepCards stepIndices={[0, 1]} t={t} tBrand={tBrand} pillar="prepare" />}
            {pillar === 'transform' && <BuildStepCards stepIndices={[2]} t={t} tBrand={tBrand} pillar="transform" />}
            {pillar === 'emerge' && (
              <div className="max-w-3xl">
                <DigitalBuildCard build={websiteBuild} t={t} locale={locale} />
              </div>
            )}
            {pillar === 'soar' && (
              <>
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                  <DigitalBuildCard build={platformBuild} t={t} locale={locale} />
                  <DigitalBuildCard build={automationBuild} t={t} locale={locale} />
                </div>
                <p className="text-sm font-medium text-slate-700 mb-4">{t('buildSubtitle')}</p>
                <BuildStepCards stepIndices={[3]} t={t} tBrand={tBrand} pillar="soar" />
              </>
            )}
            <Link
              href={
                pillar === 'soar'
                  ? { pathname: '/schedule', query: { service: 'custom-platforms' } }
                  : '/schedule'
              }
              className="mt-6 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
            >
              {tBrand(PILLAR_CTA_KEYS[pillar])}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </section>
        ))}

        <Reveal className="mt-16 pt-12 border-t border-slate-200">
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-primary/[0.04] p-6 lg:p-8">
            <ServiceSectionHeading
              eyebrow={t('proofEyebrow')}
              title={t('proofTitle')}
              description={t('proofTeaserDesc')}
              className="mb-6"
            />
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mb-6">
              {getOrderedPortfolioItems()
                .slice(0, 2)
                .map((item, index) => (
                  <a
                    key={item.id}
                    href={item.tryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <BrowserFrame
                      imageUrl={item.imageUrl}
                      imageAlt={portfolioImageAlts[item.id]}
                      domain={item.domain}
                      priority={index === 0}
                      className="group-hover:shadow-card-hover transition-shadow duration-300"
                    />
                    <p className="mt-2 text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">
                      {portfolioItemName(tPortfolio, item)}
                    </p>
                  </a>
                ))}
            </div>
            <Link
              href="/digital-creations"
              className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 text-sm transition-colors"
            >
              {t('proofViewPortfolio')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-16 pt-12 border-t border-slate-200 grid lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 lg:p-8">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">{t('fitTitle')}</h2>
            <ul className="space-y-3">
              {fitKeys.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 lg:p-8 flex flex-col justify-center">
            <p className="text-slate-700 leading-relaxed mb-4 text-sm">{t('fitConsultingNote')}</p>
            <Link href="/services" className="inline-flex items-center text-primary font-medium text-sm hover:underline">
              {t('compareConsultingLink')}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-8 rounded-lg border border-slate-200 bg-white px-6 py-5 text-center">
          <p className="text-sm text-slate-700 leading-relaxed">{tBrand('crossLaneBridge')}</p>
        </Reveal>

        <Reveal className="mt-16 pt-12 border-t border-slate-200">
          <ServiceSectionHeading title={t('credibilityTitle')} className="text-center mx-auto mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {credibilityItems.map((item) => (
              <div key={item.titleKey} className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="w-9 h-9 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center mb-3">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <p className="font-semibold text-slate-900 text-sm mb-1">{t(item.titleKey)}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-16 pt-12 border-t border-slate-200">
          <ServiceSectionHeading title={t('faqTitle')} />
          <ServiceMiniFAQ namespace="digitalBuilds" />
        </Reveal>

        <Reveal className="mt-8 rounded-lg border border-slate-200 bg-slate-50 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{t('typicalEngagementTitle')}</p>
          <p className="text-sm text-slate-700 leading-relaxed">{t('typicalEngagementDesc')}</p>
        </Reveal>

        <ServiceTestimonialBand />

        <ServicePageCTA
          badge={t('ctaBadge')}
          title={t('ctaTitle')}
          subtitle={t('ctaSubtitle')}
          qualifier={t('ctaQualifier')}
          ctaSubtext={tCommon('ctaSubtext')}
          primaryCta={
            <ScheduleButton variant="secondary" size="lg" icon className="bg-white text-slate-900 hover:bg-slate-100 border-0">
              {t('ctaButton')}
            </ScheduleButton>
          }
          secondaryCta={
            <Link
              href="/digital-creations"
              className="inline-flex items-center justify-center rounded-md border border-slate-600 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              {t('heroCtaPortfolio')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          }
          links={[
            { href: '/services', label: t('crossLinkConsulting') },
            { href: '/services/workshops', label: t('crossLinkWorkshops') },
          ]}
        />
      </div>
      <StickyMobileCTA label={t('ctaButton')} sublabel={tCommon('ctaSubtext')} />
    </section>
  )
}

export default DigitalBuilds
