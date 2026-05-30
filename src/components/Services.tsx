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
  CheckCircle
} from 'lucide-react'
import ScheduleButton from './CalendlyButton'

const serviceIcons = [Target, TrendingUp, Users, BarChart3, Lightbulb, Zap] as const
const serviceAnchors = [
  'strategic',
  'operations',
  'people',
  'analytics',
  'innovation',
  'digital',
] as const
const serviceAccentStyles = [
  {
    bar: 'from-cyan-400 to-cyan-600',
    iconWrap: 'from-cyan-50 to-cyan-100 ring-cyan-200/80',
    icon: 'text-cyan-600',
    ideal: 'text-cyan-900 bg-cyan-50 border-cyan-200',
  },
  {
    bar: 'from-emerald-400 to-emerald-600',
    iconWrap: 'from-emerald-50 to-emerald-100 ring-emerald-200/80',
    icon: 'text-emerald-600',
    ideal: 'text-emerald-900 bg-emerald-50 border-emerald-200',
  },
  {
    bar: 'from-violet-400 to-violet-600',
    iconWrap: 'from-violet-50 to-violet-100 ring-violet-200/80',
    icon: 'text-violet-600',
    ideal: 'text-violet-900 bg-violet-50 border-violet-200',
  },
  {
    bar: 'from-amber-400 to-amber-600',
    iconWrap: 'from-amber-50 to-amber-100 ring-amber-200/80',
    icon: 'text-amber-600',
    ideal: 'text-amber-900 bg-amber-50 border-amber-200',
  },
] as const

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
      ctaService: 'strategic-planning' as const,
      ctaText: t('s0Cta'),
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
      ctaService: 'process-optimization' as const,
      ctaText: t('s1Cta'),
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
      ctaService: 'team-development' as const,
      ctaText: t('s2Cta'),
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
      ctaService: 'data-analytics' as const,
      ctaText: t('s3Cta'),
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
      ctaService: 'innovation-consulting' as const,
      ctaText: t('s4Cta'),
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
      ctaService: 'digital-transformation' as const,
      ctaText: t('s5Cta'),
      anchor: serviceAnchors[5],
    },
  ]

  return (
    <section id="services" className="section-padding bg-white py-20 lg:py-28 relative">
      <div className="section-divider" />
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-slate-900 mb-6">{t('title')}</h2>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-slate-600 leading-relaxed">
            {t('subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => (
            (() => {
              const accent = serviceAccentStyles[index] ?? null
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.01, transition: { duration: 0.25 } }}
                  id={service.anchor}
                  className="group relative overflow-hidden bg-white rounded-2xl p-8 lg:p-9 shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-200 hover:border-primary/40 flex flex-col min-h-[560px]"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-90 ${accent?.bar ?? 'from-primary to-primary-dark'}`} />
              <div className="mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ring-1 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 ${accent?.iconWrap ?? 'from-primary/20 to-primary-dark/20 ring-primary/30'}`}>
                      <service.icon className={`w-8 h-8 ${accent?.icon ?? 'text-primary'}`} />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-3">{service.title}</h3>
                </div>

                  <p className="text-slate-600 text-base leading-relaxed mb-4 min-h-[3rem]">{service.desc}</p>
                  <p className={`text-sm border rounded-lg px-3 py-2 mb-5 ${accent?.ideal ?? 'text-primary bg-primary/10 border-primary/30'}`}>
                    {service.ideal}
                  </p>
                  <div className="space-y-3 mb-6">
                    <p className="text-sm text-slate-700">
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary-dark mr-2">{t('outcomeLabel')}</span>
                      {service.outcome}
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-600 mr-2">{t('notForLabel')}</span>
                      {service.notFor}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start text-sm text-slate-600">
                        <CheckCircle className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${accent?.icon ?? 'text-primary'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5 border-t border-slate-200">
                    <Link
                      href={{ pathname: '/contact', query: { service: service.ctaService } }}
                      className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors duration-200"
                    >
                      {service.ctaText}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              )
            })()
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-8 md:p-10"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{t('engagementTitle')}</h3>
          <p className="text-slate-600 mb-8">{t('engagementSubtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[t('step1'), t('step2'), t('step3'), t('step4')].map((step, idx) => (
              <div key={step} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-primary mb-2">{t('stepLabel', { number: idx + 1 })}</p>
                <p className="text-sm text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          id="cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary via-primary-dark to-[#0B1320] rounded-2xl p-10 md:p-16 mt-20 text-center shadow-[0_25px_80px_rgba(0,0,0,0.55)] relative border border-white/20 ring-1 ring-primary/40 overflow-hidden"
        >
          <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="relative z-10">
            <span className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Executive planning
            </span>
            <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-sm">
              {t('ctaTitle')}
            </h3>
            <p className="text-xl text-white/95 mb-6 max-w-2xl mx-auto">
              {t('ctaSubtitle')}
            </p>
            <p className="text-sm text-white/90 mb-8 max-w-2xl mx-auto">
              {t('ctaQualifier')}
            </p>
            <ScheduleButton variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-[1.03] transition-transform duration-300 shadow-2xl ring-1 ring-white/40">
              {t('ctaButton')}
            </ScheduleButton>
            <p className="mt-6 text-sm text-white/85">
              <Link href="/assessment" className="underline hover:text-white">
                {t('ctaAssessment')}
              </Link>
            </p>
            <p className="mt-3 text-xs text-white/75">
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
      </div>
    </section>
  )
}

export default Services 