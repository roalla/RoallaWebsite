'use client'

import React from 'react'
import Reveal from './motion/Reveal'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  CheckCircle,
  QrCode,
  CalendarDays,
  Smartphone,
  Rocket,
  ExternalLink,
  Briefcase,
  BookOpen,
} from 'lucide-react'
import ScheduleButton from './ScheduleButton'
import StickyMobileCTA from './StickyMobileCTA'
import ServiceMiniFAQ from './services/ServiceMiniFAQ'
import ServiceTestimonialBand from './services/ServiceTestimonialBand'
import Breadcrumb from './Breadcrumb'
import BrowserFrame from './digital/BrowserFrame'
import { companyApps, type CompanyAppId } from '@/lib/companyApps'
import { portfolioItems, portfolioImageAlts } from '@/lib/digitalPortfolio'
import {
  ServicePageHero,
  ConsultingHeroVisual,
  ServiceAnchorNav,
  ServiceSectionHeading,
  ServicePageCTA,
  serviceCardClass,
  serviceCardIconMotionClass,
  serviceMiniTileClass,
  servicePrimaryLinkClass,
  serviceHeroSecondaryButtonClass,
} from './services/ServicePageSections'

const capabilityIcons = [QrCode, CalendarDays, Smartphone, Rocket] as const
const capabilityAnchors = ['booth', 'microsites', 'apps', 'activations'] as const
const formatKeys = ['format1', 'format2', 'format3'] as const
const formatIcons = [QrCode, CalendarDays, Smartphone] as const
const fitKeys = ['fit1', 'fit2', 'fit3'] as const

const appIcons: Record<CompanyAppId, typeof Briefcase> = {
  'business-cocoon': Briefcase,
  '4theblueprint': BookOpen,
}

const eventProof = portfolioItems.find((p) => p.id === 'cold-dejabru-event')!

type EventCapability = {
  title: string
  desc: string
  features: string[]
  ideal: string
  outcome: string
  icon: (typeof capabilityIcons)[number]
  anchor: (typeof capabilityAnchors)[number]
}

function EventCapabilityCard({
  topic,
  t,
}: {
  topic: EventCapability
  t: ReturnType<typeof useTranslations<'digitalEvents'>>
}) {
  return (
    <Reveal as="article" id={topic.anchor} className="scroll-mt-28 h-full">
      <div className={serviceCardClass}>
      <div className="p-6 lg:p-7 flex flex-col flex-1 h-full">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-11 h-11 shrink-0 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors duration-300 ${serviceCardIconMotionClass}`}
          >
            <topic.icon className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-serif font-bold text-slate-900">{topic.title}</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{topic.desc}</p>
          </div>
        </div>

        <p className="text-sm text-slate-700 border-l-2 border-primary/30 pl-3 mb-4 leading-relaxed">{topic.ideal}</p>

        <p className="text-sm text-slate-700 mb-4">
          <span className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">{t('outcomeLabel')}</span>
          {topic.outcome}
        </p>

        <ul className="space-y-2 mb-5 flex-1">
          {topic.features.map((feature) => (
            <li key={feature} className="flex items-start text-sm text-slate-600">
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Link
          href={{ pathname: '/schedule', query: { service: 'websites-brand' } }}
          className={servicePrimaryLinkClass}
        >
          {t('topicCta')}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
      </div>
    </Reveal>
  )
}

export default function DigitalEvents() {
  const t = useTranslations('digitalEvents')
  const tNav = useTranslations('nav')
  const tBc = useTranslations('breadcrumb')
  const tCommon = useTranslations('common')

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label'), icon: QrCode },
    { value: t('stat2Value'), label: t('stat2Label'), icon: Rocket },
    { value: t('stat3Value'), label: t('stat3Label'), icon: CalendarDays },
  ]

  const capabilities: EventCapability[] = capabilityAnchors.map((anchor, i) => ({
    anchor,
    icon: capabilityIcons[i],
    title: t(`topic${i}Title` as 'topic0Title'),
    desc: t(`topic${i}Desc` as 'topic0Desc'),
    ideal: t(`topic${i}Ideal` as 'topic0Ideal'),
    outcome: t(`topic${i}Outcome` as 'topic0Outcome'),
    features: [t(`topic${i}F1` as 'topic0F1'), t(`topic${i}F2` as 'topic0F2'), t(`topic${i}F3` as 'topic0F3')],
  }))

  return (
    <section id="digital-events" className="section-padding relative">
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
            icon={QrCode}
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
          { label: tBc('digitalEvents') },
        ]}
      />

      <div className="max-w-6xl mx-auto">
        <Reveal className="mb-10 max-w-3xl">
          <p className="text-slate-600 leading-relaxed">{t('intro')}</p>
        </Reveal>

        <ServiceAnchorNav
          label={t('jumpNavLabel')}
          items={capabilities.map((topic) => ({ id: topic.anchor, label: topic.title }))}
        />

        <section className="mt-12">
          <ServiceSectionHeading
            eyebrow={t('catalogEyebrow')}
            title={t('catalogTitle')}
            description={t('catalogDesc')}
            className="mb-8"
          />
          <div className="grid md:grid-cols-2 gap-6">
            {capabilities.map((topic) => (
              <EventCapabilityCard key={topic.anchor} topic={topic} t={t} />
            ))}
          </div>
        </section>

        <Reveal className="mt-16 pt-12 border-t border-slate-200">
          <ServiceSectionHeading
            eyebrow={t('appsEyebrow')}
            title={t('appsTitle')}
            description={t('appsDesc')}
            className="mb-6"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            {companyApps.map((app) => {
              const Icon = appIcons[app.id]
              return (
                <a
                  key={app.id}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-primary/40 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 group-hover:text-primary-dark">
                      {tNav(app.nameKey)}
                      <ExternalLink className="w-3 h-3 opacity-60" aria-hidden />
                    </p>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">{tNav(app.descKey)}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{app.domain}</p>
                  </div>
                </a>
              )
            })}
          </div>
        </Reveal>

        <Reveal className="mt-16 pt-12 border-t border-slate-200">
          <ServiceSectionHeading
            eyebrow={t('proofEyebrow')}
            title={t('proofTitle')}
            description={t('proofDesc')}
            className="mb-6"
          />
          <div className="max-w-md">
            <a href={eventProof.tryUrl} target="_blank" rel="noopener noreferrer" className="block group">
              <BrowserFrame
                imageUrl={eventProof.imageUrl}
                imageAlt={portfolioImageAlts['cold-dejabru-event']}
                domain={eventProof.domain}
                className="group-hover:shadow-card-hover transition-shadow duration-300"
              />
            </a>
            <Link href="/digital-creations" className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline">
              {t('proofCta')}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-16 pt-12 border-t border-slate-200">
          <ServiceSectionHeading title={t('formatsTitle')} description={t('formatsDesc')} className="mb-8" />
          <div className="grid sm:grid-cols-3 gap-5">
            {formatKeys.map((key, i) => (
              <div key={key} className={serviceMiniTileClass}>
                <div className={`w-9 h-9 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center mb-3 group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors duration-300 ${serviceCardIconMotionClass}`}>
                  {React.createElement(formatIcons[i], { className: 'w-4 h-4 text-primary' })}
                </div>
                <p className="font-semibold text-slate-900 text-sm mb-1">{t(`${key}Title` as 'format1Title')}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{t(`${key}Desc` as 'format1Desc')}</p>
              </div>
            ))}
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
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 lg:p-8 flex flex-col justify-center gap-4">
            <p className="text-slate-700 leading-relaxed text-sm">{t('fitDigitalNote')}</p>
            <Link href="/services/digital" className="inline-flex items-center text-primary font-medium text-sm hover:underline">
              {t('crossLinkDigital')}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
            <p className="text-slate-700 leading-relaxed text-sm border-t border-slate-200 pt-4">{t('fitPortfolioNote')}</p>
            <Link href="/digital-creations" className="inline-flex items-center text-primary font-medium text-sm hover:underline">
              {t('crossLinkPortfolio')}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-16 pt-12 border-t border-slate-200">
          <ServiceSectionHeading title={t('faqTitle')} />
          <ServiceMiniFAQ namespace="digitalEvents" />
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
          links={[
            { href: '/services/digital', label: t('crossLinkDigital') },
            { href: '/digital-creations', label: t('crossLinkPortfolio') },
          ]}
        />
      </div>
      <StickyMobileCTA label={t('ctaButton')} sublabel={tCommon('ctaSubtext')} />
    </section>
  )
}
