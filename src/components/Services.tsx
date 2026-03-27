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
      ctaHref: '/contact?service=strategic-planning' as const,
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
      ctaHref: '/contact?service=process-optimization' as const,
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
      ctaHref: '/contact?service=team-development' as const,
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
      ctaHref: '/contact?service=data-analytics' as const,
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
      ctaHref: '/contact?service=innovation-consulting' as const,
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
      ctaHref: '/contact?service=digital-transformation' as const,
      ctaText: t('s5Cta'),
      anchor: serviceAnchors[5],
    },
  ]

  return (
    <section id="services" className="section-padding bg-black py-20 lg:py-28 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-white mb-6">{t('title')}</h2>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-300 leading-relaxed">
            {t('subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {services.map((service) => (
              <a
                key={service.anchor}
                href={`#${service.anchor}`}
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-gray-200 hover:border-primary/40 hover:text-white transition-colors"
              >
                {service.title}
              </a>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              id={service.anchor}
              className="group bg-surface-card rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 hover:border-primary/30"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary-dark/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
              </div>

              <p className="text-gray-300 text-base leading-relaxed mb-3 min-h-[3rem]">{service.desc}</p>
              <p className="text-sm text-primary/90 mb-6">{service.ideal}</p>
              <p className="text-sm text-gray-300 mb-2">
                <span className="font-semibold text-white">{t('outcomeLabel')} </span>
                {service.outcome}
              </p>
              <p className="text-sm text-gray-400 mb-6">
                <span className="font-semibold text-gray-300">{t('notForLabel')} </span>
                {service.notFor}
              </p>

              <ul className="space-y-3 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start text-sm text-gray-400">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={service.ctaHref}
                className="inline-flex items-center mt-6 text-primary font-semibold hover:text-primary-dark hover:-translate-y-px transition-all duration-200 group-hover:underline"
              >
                {service.ctaText}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 rounded-2xl border border-white/10 bg-surface-card/80 p-8 md:p-10"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{t('engagementTitle')}</h3>
          <p className="text-gray-300 mb-8">{t('engagementSubtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[t('step1'), t('step2'), t('step3'), t('step4')].map((step, idx) => (
              <div key={step} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-primary mb-2">{t('stepLabel', { number: idx + 1 })}</p>
                <p className="text-sm text-gray-200">{step}</p>
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
          className="bg-gradient-to-r from-primary via-primary-dark to-primary rounded-2xl p-10 md:p-16 mt-20 text-center shadow-2xl relative"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('ctaTitle')}
          </h3>
          <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          <p className="text-sm text-white/85 mb-8 max-w-2xl mx-auto">
            {t('ctaQualifier')}
          </p>
          <ScheduleButton variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-[1.02] transition-transform duration-300">
            {t('ctaButton')}
          </ScheduleButton>
          <p className="mt-6 text-sm text-white/80">
            <Link href="/assessment" className="underline hover:text-white">
              {t('ctaAssessment')}
            </Link>
          </p>
          <p className="mt-3 text-xs text-white/70">
            <Link href="/trust" className="underline hover:text-white">
              {t('confidentialityLink')}
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Services 