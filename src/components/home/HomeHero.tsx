'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, Heart, Award, Play } from 'lucide-react'
import { useTranslations } from 'next-intl'
import ScheduleButton from '../ScheduleButton'

const statIcons = [Briefcase, Award, Heart]
const YOUTUBE_EMBED =
  'https://www.youtube-nocookie.com/embed/daMDqDodumw?autoplay=1&mute=1&loop=1&playlist=daMDqDodumw&rel=0&controls=0'

export default function HomeHero() {
  const t = useTranslations('home.hero')
  const [videoActive, setVideoActive] = useState(false)
  const stats = [
    { value: t('stat1Value'), label: t('stat1Label'), icon: statIcons[0] },
    { value: t('stat2Value'), label: t('stat2Label'), icon: statIcons[1] },
    { value: t('stat3Value'), label: t('stat3Label'), icon: statIcons[2] },
  ]

  return (
    <section className="relative min-h-[85vh] flex items-center bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden pt-24 lg:pt-28">
      <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,122,135,0.07) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 right-0 w-[60%] h-[70%] bg-gradient-to-bl from-primary/15 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-16">
        <div className="grid lg:grid-cols-[1fr,1fr] gap-12 lg:gap-16 items-center">
          <div className="max-w-xl">
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
              className="mt-6 text-xl text-slate-600 max-w-2xl"
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
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-start gap-1 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-card"
                >
                  <stat.icon className="w-4 h-4 text-primary-dark flex-shrink-0" aria-hidden />
                  <span className="text-lg font-serif font-semibold text-slate-900">{stat.value}</span>
                  <span className="text-xs text-slate-500">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-video max-w-2xl mx-auto lg:mx-0 hidden md:block"
          >
            <div className="absolute -inset-[1px] rounded-[13px] bg-gradient-to-br from-primary/40 to-primary-dark/20 p-[1px] shadow-[0_0_30px_rgba(0,122,135,0.15)]">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-900 shadow-inner">
                {videoActive ? (
                  <iframe
                    src={YOUTUBE_EMBED}
                    title="ROALLA intro video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setVideoActive(true)}
                    className="group absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-primary-dark/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    aria-label="Play ROALLA intro video"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-primary-dark shadow-lg transition-transform group-hover:scale-105">
                      <Play className="h-7 w-7 ml-1" fill="currentColor" aria-hidden />
                    </span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
