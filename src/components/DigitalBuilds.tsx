'use client'

import React from 'react'
import Reveal from './motion/Reveal'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  Globe,
  Layers,
  Workflow,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Rocket,
  Package,
  Users,
} from 'lucide-react'
import ScheduleButton from './ScheduleButton'
import StickyMobileCTA from './StickyMobileCTA'
import ServiceMiniFAQ from './services/ServiceMiniFAQ'
import ServiceTestimonialBand from './services/ServiceTestimonialBand'
import Breadcrumb from './Breadcrumb'
import BrowserFrame from './digital/BrowserFrame'
import { SERVICE_PAGE_FAQ_KEYS } from '@/lib/service-faq-jsonld'
import {
  getOrderedPortfolioItems,
  getPortfolioItem,
  buildPortfolioScheduleQuery,
  digitalBuildScheduleNeed,
  portfolioImageAlts,
  type PortfolioItemConfig,
  type PortfolioItemId,
} from '@/lib/digitalPortfolio'
import {
  ServicePageHero,
  ConsultingHeroVisual,
  ServiceAnchorNav,
  ServiceSectionHeading,
  ServicePageCTA,
  serviceCardClass,
  serviceHeroSecondaryButtonClass,
  servicePrimaryLinkClass,
} from './services/ServicePageSections'

const buildIcons = [Globe, Layers, Workflow, Sparkles] as const
const buildAnchors = ['websites', 'platforms', 'automation', 'ai-support'] as const

const digitalBuildIntent = {
  websites: 'website',
  platforms: 'platform',
  automation: 'automation',
  'ai-support': 'ai-support',
} as const satisfies Record<(typeof buildAnchors)[number], 'website' | 'platform' | 'automation' | 'ai-support'>

const fitKeys = ['fit1', 'fit2', 'fit3'] as const

function portfolioItemName(
  tPortfolio: ReturnType<typeof useTranslations<'digitalCreations'>>,
  item: PortfolioItemConfig,
) {
  const map = {
    t1: 't1Name',
    t3: 't3Name',
    t4: 't4Name',
    t5: 't5Name',
    t6: 't6Name',
    t7: 't7Name',
    t8: 't8Name',
    t9: 't9Name',
    t10: 't10Name',
    t11: 't11Name',
    t12: 't12Name',
    t13: 't13Name',
    t14: 't14Name',
    t15: 't15Name',
    t16: 't16Name',
  } as const
  return tPortfolio(map[item.i18nPrefix])
}

type DigitalBuild = {
  title: string
  desc: string
  features: string[]
  icon: (typeof buildIcons)[number]
  requestCta: string
  proofText: string
  proofHash: PortfolioItemId
  proofReference: PortfolioItemId
  timeline: string
  anchor: (typeof buildAnchors)[number]
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
  return (
    <Reveal as="article" id={build.anchor} className={`${serviceCardClass} scroll-mt-28`}>
      <div className="p-6 lg:p-7 flex flex-col flex-1">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-11 h-11 shrink-0 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center">
            <build.icon className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-serif font-bold text-slate-900">{build.title}</h3>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{build.timeline}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-5">{build.desc}</p>

        <ul className="space-y-2 mb-6">
          {build.features.map((feature) => (
            <li key={feature} className="flex items-start text-sm text-slate-600">
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5 border-t border-slate-100 space-y-3">
          <Link
            href={{
              pathname: '/schedule',
              query: buildPortfolioScheduleQuery(
                getPortfolioItem(build.proofReference)!,
                undefined,
                digitalBuildScheduleNeed[build.anchor],
                digitalBuildIntent[build.anchor],
              ),
            }}
            className={servicePrimaryLinkClass}
          >
            {build.requestCta}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <a
            href={`/${locale}/services/portfolio#${build.proofHash}`}
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-primary hover:underline"
          >
            {build.proofText}
            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </Reveal>
  )
}

const DigitalBuilds = () => {
  const t = useTranslations('digitalBuilds')
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
      icon: buildIcons[0],
      requestCta: t('s0RequestCta'),
      proofText: t('s0Proof'),
      proofHash: 'ken-effect',
      proofReference: 'ken-effect',
      timeline: t('websiteTimeline'),
      anchor: buildAnchors[0],
    },
    {
      title: t('s1Title'),
      desc: t('s1Desc'),
      features: [t('s1F1'), t('s1F2'), t('s1F3')],
      icon: buildIcons[1],
      requestCta: t('s1RequestCta'),
      proofText: t('s1Proof'),
      proofHash: 'my360vision',
      proofReference: 'my360vision',
      timeline: t('platformTimeline'),
      anchor: buildAnchors[1],
    },
    {
      title: t('s2Title'),
      desc: t('s2Desc'),
      features: [t('s2F1'), t('s2F2'), t('s2F3')],
      icon: buildIcons[2],
      requestCta: t('s2RequestCta'),
      proofText: t('s2Proof'),
      proofHash: 'boothlio',
      proofReference: 'boothlio',
      timeline: t('automationTimeline'),
      anchor: buildAnchors[2],
    },
    {
      title: t('s3Title'),
      desc: t('s3Desc'),
      features: [t('s3F1'), t('s3F2'), t('s3F3')],
      icon: buildIcons[3],
      requestCta: t('s3RequestCta'),
      proofText: t('s3Proof'),
      proofHash: 'business-cocoon',
      proofReference: 'pitch-hotshots',
      timeline: t('aiTimeline'),
      anchor: buildAnchors[3],
    },
  ]

  return (
    <section id="digital-builds" className="section-padding relative">
      <ServicePageHero
        variant="digital"
        eyebrow={t('heroEyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        subtitleHighlight={t('subtitleHighlight')}
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
          <ScheduleButton variant="primary" size="lg" icon intent="website">
            {tCommon('scheduleConsultation')}
          </ScheduleButton>
        }
        secondaryCta={
          <Link href="/services/portfolio" className={serviceHeroSecondaryButtonClass}>
            {t('heroCtaPortfolio')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        }
        ctaSubtext={tCommon('ctaSubtext')}
      />

      <Breadcrumb
        items={[
          { label: tBc('home'), href: '/' },
          { label: tBc('websitesAndDigital') },
        ]}
      />

      <div className="max-w-6xl mx-auto">
        <ServiceAnchorNav
          label={t('jumpNavLabel')}
          items={builds.map((b) => ({ id: b.anchor, label: b.title }))}
        />

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {builds.map((build) => (
            <DigitalBuildCard key={build.anchor} build={build} t={t} locale={locale} />
          ))}
        </div>

        <Reveal className="mt-10 rounded-xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-center">
          <p className="text-sm font-medium text-slate-700 leading-relaxed">{t('heroJourneyLine')}</p>
        </Reveal>

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
                .map((item, index) => {
                  const scheduleQuery = buildPortfolioScheduleQuery(item)
                  return (
                    <div key={item.id} className="group">
                      <a href={`/${locale}/services/portfolio#${item.id}`} className="block">
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
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        <a
                          href={`/${locale}/services/portfolio#${item.id}`}
                          className="text-xs font-semibold text-primary-dark hover:underline"
                        >
                          {t('proofSeeCaseStudy')}
                        </a>
                        <Link
                          href={{ pathname: '/schedule', query: scheduleQuery }}
                          className="text-xs font-semibold text-slate-600 hover:text-primary hover:underline"
                        >
                          {t('proofRequestBuild')}
                        </Link>
                      </div>
                    </div>
                  )
                })}
            </div>
            <Link
              href="/services/portfolio"
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
            <Link
              href="/programs/business-enablement"
              className="inline-flex items-center text-primary font-medium text-sm hover:underline"
            >
              {t('compareConsultingLink')}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-16 pt-12 border-t border-slate-200">
          <ServiceSectionHeading title={t('faqTitle')} />
          <ServiceMiniFAQ namespace="digitalBuilds" keys={SERVICE_PAGE_FAQ_KEYS} />
        </Reveal>

        <ServiceTestimonialBand />

        <ServicePageCTA
          badge={t('ctaBadge')}
          title={t('ctaTitle')}
          subtitle={t('ctaSubtitle')}
          qualifier={t('ctaQualifier')}
          ctaSubtext={tCommon('ctaSubtext')}
          primaryCta={
            <ScheduleButton
              variant="secondary"
              size="lg"
              icon
              className="bg-white text-slate-900 hover:bg-slate-100 border-0"
              intent="website"
            >
              {tCommon('scheduleConsultation')}
            </ScheduleButton>
          }
          secondaryCta={
            <Link
              href="/services/portfolio"
              className="inline-flex items-center justify-center rounded-md border border-slate-600 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              {t('heroCtaPortfolio')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          }
          links={[
            { href: '/programs/business-enablement', label: t('crossLinkConsulting') },
            { href: '/programs/workshops', label: t('crossLinkWorkshops') },
          ]}
        />
      </div>
      <StickyMobileCTA
        label={tCommon('scheduleConsultation')}
        intent="website"
        sublabel={tCommon('ctaSubtext')}
      />
    </section>
  )
}

export default DigitalBuilds
