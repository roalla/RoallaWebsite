'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScheduleButton from '../CalendlyButton'

export default function HomeHero() {
  const t = useTranslations('home.hero')
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
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white leading-tight"
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
              className="inline-flex items-center font-semibold text-gray-300 hover:text-primary transition-colors"
            >
              {t('exploreServices')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-sm text-gray-400"
          >
            {t('stats')}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative aspect-video max-w-2xl mx-auto lg:mx-0"
        >
          <video
            className="w-full h-full rounded-xl border border-white/10 object-cover shadow-2xl"
            controls
            playsInline
            preload="metadata"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
        </div>
      </div>
    </section>
  )
}
