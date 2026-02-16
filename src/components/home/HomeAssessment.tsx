'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ClipboardList, ArrowRight } from 'lucide-react'

export default function HomeAssessment() {
  const t = useTranslations('home.assessment')
  return (
    <section id="assessment" className="py-16 lg:py-24 bg-surface-elevated relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
              <ClipboardList className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">{t('title')}</h2>
            <p className="mt-2 text-sm text-primary font-medium">{t('preview')}</p>
            <p className="mt-4 text-gray-300">{t('description')}</p>
            <Link
              href="/assessment"
              className="mt-8 inline-flex items-center bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              {t('cta')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
