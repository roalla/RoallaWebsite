'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Globe, Layers, ArrowRight, CheckCircle } from 'lucide-react'
import ScheduleButton from './CalendlyButton'

const buildIcons = [Globe, Layers] as const
const buildAnchors = ['websites', 'platforms'] as const
const buildAccentStyles = [
  {
    bar: 'from-sky-400 to-sky-600',
    iconWrap: 'from-sky-400/25 to-sky-600/25 ring-sky-300/30',
    icon: 'text-sky-300',
    ideal: 'text-sky-100 bg-sky-500/15 border-sky-300/30',
  },
  {
    bar: 'from-rose-400 to-rose-600',
    iconWrap: 'from-rose-400/25 to-rose-600/25 ring-rose-300/30',
    icon: 'text-rose-300',
    ideal: 'text-rose-100 bg-rose-500/15 border-rose-300/30',
  },
] as const

const DigitalBuilds = () => {
  const t = useTranslations('digitalBuilds')
  const locale = useLocale()
  const builds = [
    {
      title: t('s0Title'),
      desc: t('s0Desc'),
      features: [t('s0F1'), t('s0F2'), t('s0F3')],
      ideal: t('s0Ideal'),
      outcome: t('s0Outcome'),
      notFor: t('s0NotFor'),
      icon: buildIcons[0],
      ctaService: 'websites-brand' as const,
      ctaText: t('s0Cta'),
      proofText: t('s0Proof'),
      proofHash: 'ken-effect',
      anchor: buildAnchors[0],
    },
    {
      title: t('s1Title'),
      desc: t('s1Desc'),
      features: [t('s1F1'), t('s1F2'), t('s1F3')],
      ideal: t('s1Ideal'),
      outcome: t('s1Outcome'),
      notFor: t('s1NotFor'),
      icon: buildIcons[1],
      ctaService: 'custom-platforms' as const,
      ctaText: t('s1Cta'),
      proofText: t('s1Proof'),
      proofHash: 'business-cocoon',
      anchor: buildAnchors[1],
    },
  ]

  return (
    <section id="digital-builds" className="section-padding bg-black py-20 lg:py-28 relative">
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
          <p className="mt-6 max-w-3xl mx-auto text-sm text-gray-400 leading-relaxed">
            {t('clarifier')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {builds.map((build) => (
              <a
                key={build.anchor}
                href={`#${build.anchor}`}
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-gray-200 hover:border-primary/40 hover:text-white transition-colors"
              >
                {build.title}
              </a>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {builds.map((build, index) => {
            const accent = buildAccentStyles[index]
            return (
              <motion.div
                key={build.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.01, transition: { duration: 0.25 } }}
                id={build.anchor}
                className="group relative overflow-hidden bg-white/[0.06] rounded-2xl p-8 lg:p-9 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-primary/50 flex flex-col min-h-[560px]"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-90 ${accent.bar}`} />
                <div className="mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ring-1 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 ${accent.iconWrap}`}>
                    <build.icon className={`w-8 h-8 ${accent.icon}`} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-3">{build.title}</h3>
                </div>

                <p className="text-gray-200 text-base leading-relaxed mb-4 min-h-[3rem]">{build.desc}</p>
                <p className={`text-sm border rounded-lg px-3 py-2 mb-5 ${accent.ideal}`}>
                  {build.ideal}
                </p>
                <div className="space-y-3 mb-6">
                  <p className="text-sm text-gray-200">
                    <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white mr-2">{t('outcomeLabel')}</span>
                    {build.outcome}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-gray-200 mr-2">{t('notForLabel')}</span>
                    {build.notFor}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {build.features.map((feature) => (
                    <li key={feature} className="flex items-start text-sm text-gray-300">
                      <CheckCircle className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${accent.icon}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-5 border-t border-white/15 space-y-3">
                  <Link
                    href={{ pathname: '/contact', query: { service: build.ctaService } }}
                    className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors duration-200"
                  >
                    {build.ctaText}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <p className="text-sm text-gray-400">
                    <a
                      href={`/${locale}/digital-creations#${build.proofHash}`}
                      className="text-primary/80 hover:text-primary underline underline-offset-2"
                    >
                      {build.proofText}
                    </a>
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 rounded-2xl border border-white/10 bg-surface-card/80 p-8 md:p-10"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{t('buildTitle')}</h3>
          <p className="text-gray-300 mb-8">{t('buildSubtitle')}</p>
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
          className="bg-gradient-to-br from-primary via-primary-dark to-[#0B1320] rounded-2xl p-10 md:p-16 mt-20 text-center shadow-[0_25px_80px_rgba(0,0,0,0.55)] relative border border-white/20 ring-1 ring-primary/40 overflow-hidden"
        >
          <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="relative z-10">
            <span className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white mb-4">
              {t('ctaBadge')}
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
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/85">
              <Link href="/services" className="underline hover:text-white inline-flex items-center">
                {t('crossLinkConsulting')}
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

export default DigitalBuilds
