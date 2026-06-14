'use client'

import React from 'react'
import Reveal from './motion/Reveal'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Lightbulb,
  Zap,
  ArrowRight,
  CheckCircle,
  Search,
  Map,
  Rocket,
  Shield,
  Award,
  GraduationCap,
  Briefcase,
  type LucideIcon,
} from 'lucide-react'
import ScheduleButton from './ScheduleButton'
import StickyMobileCTA from './StickyMobileCTA'
import ServiceMiniFAQ from './services/ServiceMiniFAQ'
import ServiceTestimonialBand from './services/ServiceTestimonialBand'
import Breadcrumb from './Breadcrumb'
import BrandJourneyBand from './services/BrandJourneyBand'
import type { ConsultingFocus } from '@/lib/consultation-request'
import {
  BRAND_PILLARS,
  CONSULTING_ENGAGEMENT_STEP_PILLARS,
  CONSULTING_PILLAR_INTRO_KEYS,
  ENGAGEMENT_PHASE_LABEL_KEYS,
  ENGAGEMENT_PHASE_RANGE_KEYS,
  PILLAR_BADGE_KEYS,
  PILLAR_CTA_KEYS,
  PILLAR_SECTION_IDS,
  PILLAR_TITLE_KEYS,
  START_HERE_KEYS,
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
  servicePrimaryLinkClass,
} from './services/ServicePageSections'

const serviceIcons = [Target, TrendingUp, Users, BarChart3, Lightbulb, Zap] as const
const serviceAnchors = ['strategic', 'operations', 'people', 'analytics', 'innovation', 'digital'] as const
const engagementIcons = [Search, Map, Target, Rocket] as const
const credibilityIcons = [Award, GraduationCap, Briefcase, Shield] as const
const fitKeys = ['fit1', 'fit2', 'fit3'] as const

const SERVICE_PILLARS: BrandPillar[] = ['prepare', 'transform', 'emerge', 'emerge', 'soar', 'transform']

const PILLAR_SERVICES: Record<BrandPillar, number[]> = {
  prepare: [0],
  transform: [1, 5],
  emerge: [2, 3],
  soar: [4],
}

type ConsultingService = {
  title: string
  desc: string
  features: string[]
  ideal: string
  outcome: string
  notFor: string
  icon: LucideIcon
  focus: ConsultingFocus
  anchor: string
  pillar: BrandPillar
}

function ConsultingServiceCard({
  service,
  t,
}: {
  service: ConsultingService
  t: ReturnType<typeof useTranslations<'services'>>
}) {
  const tBrand = useTranslations('brandJourney')

  return (
    <Reveal as="article" id={service.anchor} className={serviceCardClass}>
      <div className="p-7 lg:p-8 flex flex-col flex-1">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-11 h-11 shrink-0 rounded-md border border-primary/20 bg-primary/10 flex items-center justify-center">
            <service.icon className="w-5 h-5 text-primary-dark" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2">
              <PillarBadge label={tBrand(PILLAR_BADGE_KEYS[service.pillar])} />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-900">{service.title}</h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">{service.desc}</p>
          </div>
        </div>

        <p className="text-sm font-medium text-slate-800 border-l-4 border-primary bg-primary/[0.06] rounded-r-md pl-3 py-2 mb-5 leading-relaxed">
          {service.ideal}
        </p>

        <div className="space-y-3 mb-5 text-sm">
          <p className="text-slate-800 bg-slate-50 rounded-md border border-slate-200 px-3 py-2.5">
            <span className="block text-xs font-semibold uppercase tracking-wide text-primary-dark mb-1">
              {t('outcomeLabel')}
            </span>
            {service.outcome}
          </p>
          <p className="text-slate-700 px-3">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1">
              {t('notForLabel')}
            </span>
            {service.notFor}
          </p>
        </div>

        <ul className="space-y-2 mb-6">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-start text-sm text-slate-700">
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-primary-dark" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5 border-t border-slate-200">
          <Link
            href={{ pathname: '/schedule', query: { intent: 'consulting', focus: service.focus } }}
            className={servicePrimaryLinkClass}
          >
            {t('requestConsultation')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </Reveal>
  )
}

const Services = () => {
  const t = useTranslations('services')
  const tBrand = useTranslations('brandJourney')
  const tBc = useTranslations('breadcrumb')
  const tCommon = useTranslations('common')

  const services: ConsultingService[] = [
    {
      title: t('s0Title'),
      desc: t('s0Desc'),
      features: [t('s0F1'), t('s0F2'), t('s0F3')],
      ideal: t('s0Ideal'),
      outcome: t('s0Outcome'),
      notFor: t('s0NotFor'),
      icon: serviceIcons[0],
      focus: 'strategy',
      anchor: serviceAnchors[0],
      pillar: SERVICE_PILLARS[0],
    },
    {
      title: t('s1Title'),
      desc: t('s1Desc'),
      features: [t('s1F1'), t('s1F2'), t('s1F3')],
      ideal: t('s1Ideal'),
      outcome: t('s1Outcome'),
      notFor: t('s1NotFor'),
      icon: serviceIcons[1],
      focus: 'operations',
      anchor: serviceAnchors[1],
      pillar: SERVICE_PILLARS[1],
    },
    {
      title: t('s2Title'),
      desc: t('s2Desc'),
      features: [t('s2F1'), t('s2F2'), t('s2F3')],
      ideal: t('s2Ideal'),
      outcome: t('s2Outcome'),
      notFor: t('s2NotFor'),
      icon: serviceIcons[2],
      focus: 'team',
      anchor: serviceAnchors[2],
      pillar: SERVICE_PILLARS[2],
    },
    {
      title: t('s3Title'),
      desc: t('s3Desc'),
      features: [t('s3F1'), t('s3F2'), t('s3F3')],
      ideal: t('s3Ideal'),
      outcome: t('s3Outcome'),
      notFor: t('s3NotFor'),
      icon: serviceIcons[3],
      focus: 'data',
      anchor: serviceAnchors[3],
      pillar: SERVICE_PILLARS[3],
    },
    {
      title: t('s4Title'),
      desc: t('s4Desc'),
      features: [t('s4F1'), t('s4F2'), t('s4F3')],
      ideal: t('s4Ideal'),
      outcome: t('s4Outcome'),
      notFor: t('s4NotFor'),
      icon: serviceIcons[4],
      focus: 'innovation',
      anchor: serviceAnchors[4],
      pillar: SERVICE_PILLARS[4],
    },
    {
      title: t('s5Title'),
      desc: t('s5Desc'),
      features: [t('s5F1'), t('s5F2'), t('s5F3')],
      ideal: t('s5Ideal'),
      outcome: t('s5Outcome'),
      notFor: t('s5NotFor'),
      icon: serviceIcons[5],
      focus: 'other',
      anchor: serviceAnchors[5],
      pillar: SERVICE_PILLARS[5],
    },
  ]

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label'), icon: Award },
    { value: t('stat2Value'), label: t('stat2Label'), icon: Briefcase },
    { value: t('stat3Value'), label: t('stat3Label'), icon: Users },
  ]

  const credibilityItems = [
    { icon: credibilityIcons[0], titleKey: 'cred1Title', descKey: 'cred1Desc', pillar: 'emerge' as const },
    { icon: credibilityIcons[1], titleKey: 'cred2Title', descKey: 'cred2Desc', pillar: 'soar' as const },
    { icon: credibilityIcons[2], titleKey: 'cred3Title', descKey: 'cred3Desc', pillar: 'all' as const },
    { icon: credibilityIcons[3], titleKey: 'cred4Title', descKey: 'cred4Desc', pillar: 'prepare' as const },
  ] as const

  const credPillarLabel = (pillar: 'prepare' | 'transform' | 'emerge' | 'soar' | 'all') => {
    if (pillar === 'all') return tBrand('pillarBadgeAll')
    return tBrand(PILLAR_BADGE_KEYS[pillar])
  }

  const engagementSteps = [t('step1'), t('step2'), t('step3'), t('step4')]

  const pillarFocus: Record<BrandPillar, ConsultingFocus> = {
    prepare: 'strategy',
    transform: 'operations',
    emerge: 'team',
    soar: 'innovation',
  }

  return (
    <section id="services" className="section-padding relative bg-slate-50/60">
      <ServicePageHero
        variant="consulting"
        eyebrow={t('heroEyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        subtitleHighlight={t('subtitleHighlight')}
        journeyLine={t('heroJourneyLine')}
        stats={stats}
        visual={
          <ConsultingHeroVisual
            proofTitle={t('heroProofTitle')}
            proofSubtitle={t('heroProofSubtitle')}
            outcomes={[t('heroOutcome1'), t('heroOutcome2'), t('heroOutcome3')]}
            caseLines={[t('heroCase1'), t('heroCase2')]}
          />
        }
        primaryCta={
          <ScheduleButton variant="primary" size="lg" icon>
            {t('ctaButton')}
          </ScheduleButton>
        }
        ctaSubtext={tCommon('ctaSubtext')}
        tertiaryLink={{ href: '/assessment', label: t('heroCtaAssessment') }}
      />

      <Breadcrumb items={[{ label: tBc('home'), href: '/' }, { label: tBc('services') }]} />

      <div className="max-w-6xl mx-auto">
        <BrandJourneyBand />

        <ServiceAnchorNav
          label={t('jumpNavPillarsLabel')}
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
              groupLabel: t('jumpNavLabel'),
              items: services.map((s) => ({ id: s.anchor, label: s.title })),
            },
          ]}
        />

        {BRAND_PILLARS.map((pillar) => (
          <section key={pillar} id={PILLAR_SECTION_IDS[pillar]} className={pillarSectionClass}>
            <PillarSectionHeader
              pillarTitle={tBrand(PILLAR_TITLE_KEYS[pillar])}
              intro={tBrand(CONSULTING_PILLAR_INTRO_KEYS[pillar])}
              startHere={tBrand(START_HERE_KEYS[pillar])}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-6">
              {PILLAR_SERVICES[pillar].map((idx) => (
                <ConsultingServiceCard key={services[idx].anchor} service={services[idx]} t={t} />
              ))}
            </div>
            <Link
              href={{ pathname: '/schedule', query: { intent: 'consulting', focus: pillarFocus[pillar] } }}
              className="inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
            >
              {tBrand(PILLAR_CTA_KEYS[pillar])}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </section>
        ))}

        <Reveal className="mt-16 pt-12 border-t-2 border-slate-200">
          <ServiceSectionHeading title={t('credibilityTitle')} description={t('credibilityDesc')} className="text-center mx-auto" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {credibilityItems.map((item) => (
              <div key={item.titleKey} className="rounded-lg border border-slate-300 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-md border border-primary/20 bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-primary-dark" />
                  </div>
                  <PillarBadge label={credPillarLabel(item.pillar)} />
                </div>
                <p className="font-bold text-slate-900 text-sm mb-1">{t(item.titleKey)}</p>
                <p className="text-sm text-slate-700 leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-16 pt-12 border-t-2 border-slate-200">
          <ServiceSectionHeading title={t('engagementTitle')} description={t('engagementSubtitle')} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {engagementSteps.map((step, idx) => {
              const Icon = engagementIcons[idx]
              const stepPillar = CONSULTING_ENGAGEMENT_STEP_PILLARS[idx]
              return (
                <div key={step} className="rounded-lg border border-slate-300 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-full bg-primary-dark text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <Icon className="w-4 h-4 text-primary-dark" />
                    <PillarBadge label={tBrand(ENGAGEMENT_PHASE_LABEL_KEYS[stepPillar])} />
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
                    {tBrand(ENGAGEMENT_PHASE_RANGE_KEYS[stepPillar])}
                  </p>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">{step}</p>
                </div>
              )
            })}
          </div>
        </Reveal>

        <Reveal className="mt-16 pt-12 border-t-2 border-slate-200 grid lg:grid-cols-2 gap-6">
          <div className="rounded-lg border-2 border-primary/30 bg-primary/[0.04] p-6 lg:p-8">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">{t('fitTitle')}</h2>
            <ul className="space-y-3">
              {fitKeys.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-sm font-medium text-slate-800">
                  <CheckCircle className="w-4 h-4 text-primary-dark shrink-0 mt-0.5" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-300 bg-slate-100 p-6 lg:p-8 flex flex-col justify-center gap-4">
            <p className="text-slate-800 leading-relaxed text-sm font-medium">{t('fitDigitalNote')}</p>
            <div className="flex flex-col gap-2">
              <Link href="/services/workshops" className="inline-flex items-center text-primary-dark font-semibold text-sm hover:underline">
                {t('crossLinkWorkshops')}
                <ArrowRight className="ml-1.5 w-4 h-4" />
              </Link>
              <Link href="/services/digital-events" className="inline-flex items-center text-primary-dark font-semibold text-sm hover:underline">
                {t('crossLinkDigitalEvents')}
                <ArrowRight className="ml-1.5 w-4 h-4" />
              </Link>
              <Link href="/services/digital" className="inline-flex items-center text-primary-dark font-semibold text-sm hover:underline">
                {t('compareBuildingLink')}
                <ArrowRight className="ml-1.5 w-4 h-4" />
              </Link>
            </div>
            <p className="text-sm text-slate-700 border-t border-slate-200 pt-4">
              {t('fitAssessmentTeaser')}{' '}
              <Link href="/assessment" className="link-action font-medium">
                {t('heroCtaAssessment')}
              </Link>
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-8 rounded-lg border border-slate-200 bg-white px-6 py-5 text-center">
          <p className="text-sm text-slate-700 leading-relaxed">{tBrand('crossLaneBridge')}</p>
        </Reveal>

        <Reveal className="mt-16 pt-12 border-t-2 border-slate-200">
          <ServiceSectionHeading title={t('faqTitle')} />
          <ServiceMiniFAQ namespace="services" />
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
              href="/assessment"
              className="inline-flex items-center justify-center text-sm font-medium text-slate-300 hover:text-white underline underline-offset-4 transition-colors"
            >
              {t('ctaAssessment')}
            </Link>
          }
          confidentiality={{ href: '/contact', label: t('confidentialityLink') }}
          links={[
            { href: '/services/workshops', label: t('crossLinkWorkshops') },
            { href: '/services/digital-events', label: t('crossLinkDigitalEvents') },
            { href: '/services/digital', label: t('crossLinkDigital') },
            { href: '/digital-creations', label: t('crossLinkOurWork') },
          ]}
        />
      </div>
      <StickyMobileCTA label={t('ctaButton')} sublabel={tCommon('ctaSubtext')} />
    </section>
  )
}

export default Services
