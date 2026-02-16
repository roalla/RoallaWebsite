'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, Target, Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScheduleButton from '../CalendlyButton'

const statIcons = [Briefcase, Target, Heart]

export default function HomeHero() {
  const t = useTranslations('home.hero')
  const stats = [
    { value: t('stat1Value'), label: t('stat1Label'), icon: statIcons[0] },
    { value: t('stat2Value'), label: t('stat2Label'), icon: statIcons[1] },
    { value: t('stat3Value'), label: t('stat3Label'), icon: statIcons[2] },
  ]
  return (
    <section className="relative min-h-[85vh] flex items-center bg-black overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 right-0 w-[60%] h-[70%] bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        <div className="grid lg:grid-cols-[1fr,1fr] gap-12 lg:gap-16 items-center">
        <div className="max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white leading-tight tracking-tight"
          >
            {t('title')}{' '}
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              {t('titleHighlight')}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-xl text-gray-300 max-w-2xl"
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
            <Link
              href="/services"
              className="inline-flex items-center font-semibold text-gray-300 hover:text-primary hover:-translate-y-px transition-all duration-200"
            >
              {t('exploreServices')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap gap-4"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10"
              >
                <stat.icon className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm font-semibold text-white">{stat.value}</span>
                <span className="text-xs text-gray-400">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative aspect-video max-w-2xl mx-auto lg:mx-0"
        >
          <div className="absolute -inset-[1px] rounded-[13px] bg-gradient-to-br from-primary/40 to-primary-dark/20 p-[1px] shadow-[0_0_30px_rgba(0,180,197,0.15)]">
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-black shadow-inner">
              <iframe
                src="https://www.youtube-nocookie.com/embed/UmrQDUiLLYY?autoplay=1&mute=1&loop=1&playlist=UmrQDUiLLYY&rel=0&controls=0"
                title="ROALLA intro video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  )
}
