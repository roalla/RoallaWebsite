'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Briefcase, Heart, Award } from 'lucide-react'
import { useTranslations } from 'next-intl'
import ScheduleButton from '../ScheduleButton'

const statIcons = [Briefcase, Award, Heart]

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
            className="absolute inset-0 h-full w-full object-cover scale-105 opacity-[0.52]"
          >
            <source src="/hero-loop.webm" type="video/webm" />
            <source src="/hero-loop.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      <div
        className="absolute inset-0 bg-gradient-to-b from-white/72 via-white/62 to-white/78"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(0,122,135,0.06) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden
      />
      <div className="absolute top-0 right-0 w-[55%] h-[65%] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-primary/8 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-20">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-slate-900 leading-tight tracking-tight"
          >
            {t('title')}{' '}
            <span className="text-primary-dark">{t('titleHighlight')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-xl text-slate-600 max-w-2xl leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <ScheduleButton variant="primary" size="lg" icon>
              {t('cta')}
            </ScheduleButton>
            <a
              href="#assessment"
              className="inline-flex items-center font-semibold text-slate-700 hover:text-primary-dark transition-colors"
            >
              {t('orAssessment')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-start gap-1 px-4 py-3 rounded-xl bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-card"
              >
                <stat.icon className="w-4 h-4 text-primary-dark flex-shrink-0" aria-hidden />
                <span className="text-lg font-serif font-semibold text-slate-900">{stat.value}</span>
                <span className="text-xs text-slate-500">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
