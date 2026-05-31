'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Briefcase, Award, Layers, CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScheduleButton from '../ScheduleButton'
import BrowserFrame from '../digital/BrowserFrame'
import { portfolioItems, portfolioImageAlts } from '@/lib/digitalPortfolio'

const statIcons = [Briefcase, Award, Layers]
const consultingOutcomeKeys = ['consultingOutcome1', 'consultingOutcome2', 'consultingOutcome3'] as const

const heroFeatured = portfolioItems.find((p) => p.id === 'ken-effect')!

export default function HomeHero() {
  const t = useTranslations('home.hero')
  const reduceMotion = useReducedMotion()
  const stats = [
    { value: t('stat1Value'), label: t('stat1Label'), icon: statIcons[0] },
    { value: t('stat2Value'), label: t('stat2Label'), icon: statIcons[1] },
    { value: t('stat3Value'), label: t('stat3Label'), icon: statIcons[2] },
  ]

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-24 lg:pt-28 bg-slate-50">
      {!reduceMotion && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/Keneffectsite.jpg"
            className="absolute inset-0 h-full w-full object-cover scale-105 opacity-[0.52]"
          >
            <source src="/hero-loop.webm" type="video/webm" />
            <source src="/hero-loop.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      <div
        className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/82 to-white/55 lg:to-white/40"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/65"
        aria-hidden
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div>
            <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-white/80 shadow-[0_8px_40px_rgba(15,23,42,0.08)] p-6 sm:p-8 lg:p-10">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-serif font-extrabold text-slate-900 leading-tight tracking-tight"
              >
                {t('title')}{' '}
                <span className="text-primary-dark">{t('titleHighlight')}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-6 text-lg sm:text-xl text-slate-700 max-w-xl leading-relaxed"
              >
                {t('subtitle')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <ScheduleButton variant="primary" size="lg" icon>
                  {t('cta')}
                </ScheduleButton>
                <a
                  href="#assessment"
                  className="inline-flex items-center font-semibold text-slate-800 hover:text-primary-dark transition-colors text-sm sm:text-base"
                >
                  {t('orAssessment')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.28 }}
                className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm"
              >
                <Link
                  href="/services"
                  className="inline-flex items-center font-semibold text-primary-dark hover:underline"
                >
                  {t('exploreConsultingLink')}
                  <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/digital-creations"
                  className="inline-flex items-center font-semibold text-slate-600 hover:text-primary-dark hover:underline transition-colors"
                >
                  {t('exploreDigitalLink')}
                  <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-start gap-1 px-4 py-3 rounded-xl bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-card"
                >
                  <stat.icon className="w-4 h-4 text-primary-dark flex-shrink-0" aria-hidden />
                  <span className="text-lg font-serif font-semibold text-slate-900">{stat.value}</span>
                  <span className="text-xs text-slate-500 leading-snug">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="space-y-4"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">
                {t('digitalProofLabel')}
              </p>
              <a
                href={heroFeatured.tryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <BrowserFrame
                  imageUrl={heroFeatured.imageUrl}
                  imageAlt={portfolioImageAlts['ken-effect']}
                  domain={heroFeatured.domain}
                  priority
                  className="group-hover:shadow-card-hover transition-shadow duration-300"
                />
              </a>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-sm p-5 sm:p-6 shadow-card">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-primary" aria-hidden />
                </div>
                <div>
                  <h2 className="text-base font-serif font-bold text-slate-900">{t('consultingProofTitle')}</h2>
                  <p className="text-sm text-slate-600 mt-0.5">{t('consultingProofSubtitle')}</p>
                </div>
              </div>
              <ul className="space-y-2.5">
                {consultingOutcomeKeys.map((key) => (
                  <li key={key} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                    {t(key)}
                  </li>
                ))}
              </ul>
              <Link
                href="/services"
                className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
              >
                {t('exploreConsultingLink')}
                <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
