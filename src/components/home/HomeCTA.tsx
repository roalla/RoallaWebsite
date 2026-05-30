'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import ScheduleButton from '../ScheduleButton'

export default function HomeCTA() {
  const t = useTranslations('home.cta')
  return (
    <section className="py-16 lg:py-24 bg-white relative">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center rounded-2xl bg-gradient-to-br from-primary-dark via-primary-dark to-primary-darker p-10 lg:p-14 shadow-xl"
        >
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">{t('title')}</h2>
          <p className="mt-4 text-white/90">{t('subtitle')}</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <ScheduleButton
              variant="secondary"
              size="lg"
              className="bg-white text-primary-dark hover:bg-white/90 border-0 w-full sm:w-auto"
            >
              {t('schedule')}
            </ScheduleButton>
            <a
              href="#assessment"
              className="inline-flex items-center justify-center w-full sm:w-auto text-white/95 hover:text-white font-medium py-4 px-6 underline underline-offset-4 transition-colors"
            >
              {t('orAssessmentShort')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
