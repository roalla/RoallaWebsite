'use client'

import React from 'react'
import { motion } from 'framer-motion'
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
} from 'lucide-react'
import ScheduleButton from './CalendlyButton'
import type { ConsultingFocus } from '@/lib/consultation-request'
import {
  ServicePageHero,
  ServiceLaneCompare,
  ServiceAnchorNav,
  ServiceSectionHeading,
  ServicePageCTA,
  serviceCardClass,
  serviceSecondaryButtonClass,
  servicePrimaryLinkClass,
} from './services/ServicePageSections'

const serviceIcons = [Target, TrendingUp, Users, BarChart3, Lightbulb, Zap] as const
const serviceAnchors = ['strategic', 'operations', 'people', 'analytics', 'innovation', 'digital'] as const
const engagementIcons = [Search, Map, Target, Rocket] as const
const credibilityIcons = [Award, GraduationCap, Briefcase, Shield] as const
const faqKeys = ['faq1', 'faq2', 'faq3'] as const
const fitKeys = ['fit1', 'fit2', 'fit3'] as const

const Services = () => {
  const t = useTranslations('services')
  const services = [
    {
      title: t('s0Title'),
      desc: t('s0Desc'),
      features: [t('s0F1'), t('s0F2'), t('s0F3')],
      ideal: t('s0Ideal'),
      outcome: t('s0Outcome'),
      notFor: t('s0NotFor'),
      icon: serviceIcons[0],
      focus: 'strategy' as ConsultingFocus,
      anchor: serviceAnchors[0],
    },
    {
      title: t('s1Title'),
      desc: t('s1Desc'),
      features: [t('s1F1'), t('s1F2'), t('s1F3')],
      ideal: t('s1Ideal'),
      outcome: t('s1Outcome'),
      notFor: t('s1NotFor'),
      icon: serviceIcons[1],
      focus: 'operations' as ConsultingFocus,
      anchor: serviceAnchors[1],
    },
    {
      title: t('s2Title'),
      desc: t('s2Desc'),
      features: [t('s2F1'), t('s2F2'), t('s2F3')],
      ideal: t('s2Ideal'),
      outcome: t('s2Outcome'),
      notFor: t('s2NotFor'),
      icon: serviceIcons[2],
      focus: 'team' as ConsultingFocus,
      anchor: serviceAnchors[2],
    },
    {
      title: t('s3Title'),
      desc: t('s3Desc'),
      features: [t('s3F1'), t('s3F2'), t('s3F3')],
      ideal: t('s3Ideal'),
      outcome: t('s3Outcome'),
      notFor: t('s3NotFor'),
      icon: serviceIcons[3],
      focus: 'data' as ConsultingFocus,
      anchor: serviceAnchors[3],
    },
    {
      title: t('s4Title'),
      desc: t('s4Desc'),
      features: [t('s4F1'), t('s4F2'), t('s4F3')],
      ideal: t('s4Ideal'),
      outcome: t('s4Outcome'),
      notFor: t('s4NotFor'),
      icon: serviceIcons[4],
      focus: 'innovation' as ConsultingFocus,
      anchor: serviceAnchors[4],
    },
    {
      title: t('s5Title'),
      desc: t('s5Desc'),
      features: [t('s5F1'), t('s5F2'), t('s5F3')],
      ideal: t('s5Ideal'),
      outcome: t('s5Outcome'),
      notFor: t('s5NotFor'),
      icon: serviceIcons[5],
      focus: 'other' as ConsultingFocus,
      anchor: serviceAnchors[5],
    },
  ]

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') },
  ]

  const credibilityItems = [
    { icon: credibilityIcons[0], titleKey: 'cred1Title', descKey: 'cred1Desc' },
    { icon: credibilityIcons[1], titleKey: 'cred2Title', descKey: 'cred2Desc' },
    { icon: credibilityIcons[2], titleKey: 'cred3Title', descKey: 'cred3Desc' },
    { icon: credibilityIcons[3], titleKey: 'cred4Title', descKey: 'cred4Desc' },
  ] as const

  return (
    <section id="services" className="section-padding relative max-w-6xl mx-auto">
      <ServicePageHero
        eyebrow={t('heroEyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        subtitleHighlight={t('subtitleHighlight')}
        stats={stats}
        primaryCta={
          <ScheduleButton variant="primary" size="lg" icon>
            {t('ctaButton')}
          </ScheduleButton>
        }
        secondaryCta={
          <Link href="/assessment" className={serviceSecondaryButtonClass}>
            {t('heroCtaAssessment')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        }
      />

      <ServiceLaneCompare
        activeLane="consulting"
        consultingLabel={t('compareConsultingLabel')}
        consultingDesc={t('compareConsultingDesc')}
        buildingLabel={t('compareBuildingLabel')}
        buildingDesc={t('compareBuildingDesc')}
        buildingLinkText={t('compareBuildingLink')}
      />

      <ServiceAnchorNav
        label={t('jumpNavLabel')}
        items={services.map((s) => ({ id: s.anchor, label: s.title }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {services.map((service, index) => (
          <motion.article
            key={service.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.04 }}
            viewport={{ once: true }}
            id={service.anchor}
            className={serviceCardClass}
          >
            <div className="p-7 lg:p-8 flex flex-col flex-1">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-11 h-11 shrink-0 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <service.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-slate-900">{service.title}</h2>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{service.desc}</p>
                </div>
              </div>

              <p className="text-sm text-slate-700 border-l-2 border-primary/30 pl-3 mb-5 leading-relaxed">{service.ideal}</p>

              <div className="space-y-3 mb-5 text-sm">
                <p className="text-slate-700">
                  <span className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">{t('outcomeLabel')}</span>
                  {service.outcome}
                </p>
                <p className="text-slate-600">
                  <span className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">{t('notForLabel')}</span>
                  {service.notFor}
                </p>
              </div>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-5 border-t border-slate-100">
                <Link
                  href={{ pathname: '/schedule', query: { intent: 'consulting', focus: service.focus } }}
                  className={servicePrimaryLinkClass}
                >
                  {t('requestConsultation')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 pt-12 border-t border-slate-200"
      >
        <ServiceSectionHeading title={t('credibilityTitle')} description={t('credibilityDesc')} className="text-center mx-auto" />
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 pt-12 border-t border-slate-200"
      >
        <ServiceSectionHeading title={t('engagementTitle')} description={t('engagementSubtitle')} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[t('step1'), t('step2'), t('step3'), t('step4')].map((step, idx) => {
            const Icon = engagementIcons[idx]
            return (
              <div key={step} className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
              </div>
            )
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 pt-12 border-t border-slate-200 grid lg:grid-cols-2 gap-6"
      >
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
          <p className="text-slate-700 leading-relaxed mb-4 text-sm">{t('fitDigitalNote')}</p>
          <Link href="/services/digital" className="inline-flex items-center text-primary font-medium text-sm hover:underline">
            {t('compareBuildingLink')}
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 pt-12 border-t border-slate-200"
      >
        <ServiceSectionHeading title={t('faqTitle')} />
        <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white">
          {faqKeys.map((key) => (
            <div key={key} className="px-6 py-5">
              <p className="font-semibold text-slate-900 text-sm mb-2">{t(`${key}Q` as `${typeof key}Q`)}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{t(`${key}A` as `${typeof key}A`)}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <ServicePageCTA
        badge={t('ctaBadge')}
        title={t('ctaTitle')}
        subtitle={t('ctaSubtitle')}
        qualifier={t('ctaQualifier')}
        primaryCta={
          <ScheduleButton variant="secondary" size="lg" className="bg-white text-slate-900 hover:bg-slate-100 border-0">
            {t('ctaButton')}
          </ScheduleButton>
        }
        secondaryCta={
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center rounded-md border border-slate-600 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            {t('heroCtaAssessment')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        }
        confidentiality={{ href: '/contact', label: t('confidentialityLink') }}
        links={[
          { href: '/services/digital', label: t('crossLinkDigital') },
          { href: '/digital-creations', label: t('crossLinkOurWork') },
        ]}
      />
    </section>
  )
}

export default Services
