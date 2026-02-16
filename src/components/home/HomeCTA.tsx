'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScheduleButton from '../CalendlyButton'

export default function HomeCTA() {
  const t = useTranslations('home.cta')
  return (
    <section className="py-16 lg:py-24 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-10 lg:p-14 shadow-xl"
        >
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">{t('title')}</h2>
          <p className="mt-4 text-white/90">{t('subtitle')}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <ScheduleButton
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90 border-0"
            >
              {t('schedule')}
            </ScheduleButton>
            <Link
              href="/resources"
              className="inline-flex items-center bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-6 rounded-lg transition-all border border-white/30 hover:border-white/50"
            >
              {t('exploreResources')}
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/80">
            {t.rich('orAssessment', {
              link: (chunks) => <a href="#assessment" className="underline hover:text-white">{chunks}</a>,
            })}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
