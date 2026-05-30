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
  Briefcase,
  Hammer,
  Search,
  Map,
  Rocket,
  HelpCircle,
  Shield,
  Award,
  GraduationCap,
} from 'lucide-react'
import ScheduleButton from './CalendlyButton'
import type { ConsultingFocus } from '@/lib/consultation-request'

const serviceIcons = [Target, TrendingUp, Users, BarChart3, Lightbulb, Zap] as const
const serviceAnchors = ['strategic', 'operations', 'people', 'analytics', 'innovation', 'digital'] as const

const accentStyles = [
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

  const subtitleParts = t('subtitle').split(t('subtitleHighlight'))
  const hasHighlight = subtitleParts.length > 1

  return (
    <section id="services" className="section-padding relative">
      {/* Hero */}
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
              href="/assessment"
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-primary/40 hover:text-primary transition-colors shadow-sm"
            >
              {t('heroCtaAssessment')}
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
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-5 text-left ring-1 ring-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t('compareConsultingLabel')}</p>
          </div>
          <p className="text-sm text-slate-700">{t('compareConsultingDesc')}</p>
        </div>
        <Link
          href="/services/digital"
          className="group rounded-xl border border-slate-200 bg-slate-50 p-5 text-left hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <Hammer className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('compareBuildingLabel')}</p>
          </div>
          <p className="text-sm text-slate-700">{t('compareBuildingDesc')}</p>
          <span className="mt-3 inline-flex items-center text-sm font-medium text-slate-600 group-hover:text-primary">
            {t('compareBuildingLink')}
            <ArrowRight className="ml-1 w-3.5 h-3.5" />
          </span>
        </Link>
      </motion.div>

      {/* Jump nav */}
      <nav aria-label={t('jumpNavLabel')} className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 text-center">{t('jumpNavLabel')}</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {services.map((service) => (
            <a
              key={service.anchor}
              href={`#${service.anchor}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-primary/40 hover:text-primary shadow-sm transition-colors"
            >
              {service.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Service cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {services.map((service, index) => {
          const accent = accentStyles[index % 2]
          return (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.06 }}
              viewport={{ once: true }}
              id={service.anchor}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-200 hover:border-primary/35 flex flex-col scroll-mt-28 hover:-translate-y-1"
            >
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent.bar}`} />
              <div className="p-8 lg:p-9 flex flex-col flex-1">
                <div className="mb-5">
                  <div className={`w-14 h-14 bg-gradient-to-br ring-1 rounded-xl flex items-center justify-center mb-4 ${accent.iconWrap}`}>
                    <service.icon className={`w-7 h-7 ${accent.icon}`} />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mb-2">{service.title}</h2>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">{service.desc}</p>
                <p className={`text-sm border rounded-lg px-3 py-2 mb-5 ${accent.ideal}`}>{service.ideal}</p>

                <div className="space-y-3 mb-5">
                  <p className="text-sm text-slate-700">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary-dark mr-2">
                      {t('outcomeLabel')}
                    </span>
                    {service.outcome}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-600 mr-2">
                      {t('notForLabel')}
                    </span>
                    {service.notFor}
                  </p>
                </div>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start text-sm text-slate-600">
                      <CheckCircle className={`w-4 h-4 mr-2 flex-shrink-0 mt-0.5 ${accent.icon}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-5 border-t border-slate-200">
                  <Link
                    href={{ pathname: '/schedule', query: { intent: 'consulting', focus: service.focus } }}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 text-sm transition-colors"
                  >
                    {t('requestConsultation')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>

      {/* Credibility */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-8 md:p-10"
      >
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2 text-center">{t('credibilityTitle')}</h2>
        <p className="text-slate-600 text-sm text-center mb-8 max-w-2xl mx-auto">{t('credibilityDesc')}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {credibilityItems.map((item) => (
            <div key={item.titleKey} className="rounded-xl bg-white border border-slate-200 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-semibold text-slate-900 text-sm mb-1">{t(item.titleKey)}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{t(item.descKey)}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Engagement model */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm"
      >
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2">{t('engagementTitle')}</h2>
        <p className="text-slate-600 mb-8">{t('engagementSubtitle')}</p>
        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[t('step1'), t('step2'), t('step3'), t('step4')].map((step, idx) => {
              const Icon = engagementIcons[idx]
              return (
                <div
                  key={step}
                  className="relative rounded-xl border border-slate-200 bg-slate-50 p-5 hover:border-primary/25 hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="relative z-10 w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs uppercase tracking-wide text-primary mb-2">{t('stepLabel', { number: idx + 1 })}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Fit + digital note */}
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
          <p className="text-slate-700 leading-relaxed mb-4">{t('fitDigitalNote')}</p>
          <Link href="/services/digital" className="inline-flex items-center text-primary font-semibold text-sm hover:underline">
            {t('compareBuildingLink')}
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </Link>
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
              href="/assessment"
              className="inline-flex items-center justify-center bg-white/15 hover:bg-white/25 text-white font-semibold py-4 px-8 rounded-lg border-2 border-white/30 transition-all"
            >
              {t('heroCtaAssessment')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/85">
            <Link href="/contact" className="underline hover:text-white">
              {t('confidentialityLink')}
            </Link>
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/85">
            <Link href="/services/digital" className="underline hover:text-white inline-flex items-center">
              {t('crossLinkDigital')}
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
            <Link href="/digital-creations" className="underline hover:text-white inline-flex items-center">
              {t('crossLinkOurWork')}
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default Services
