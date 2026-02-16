'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScheduleButton from '../CalendlyButton'

export default function HomeClosing() {
  const t = useTranslations('home.closing')
  return (
    <section className="py-12 lg:py-16 bg-black relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8"
        >
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold text-white">{t('readyToStart')}</h3>
            <p className="mt-1 text-sm text-gray-400">
              {t('questions')}{' '}
              <Link href="/faq" className="text-primary hover:underline">{t('faq')}</Link>
              {' '}{t('or')}{' '}
              <Link href="/contact" className="text-primary hover:underline">{t('contact')}</Link>
            </p>
          </div>
          <ScheduleButton variant="primary" size="lg" icon>
            {t('scheduleCta')}
          </ScheduleButton>
        </motion.div>
      </div>
    </section>
  )
}
