'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'

const stepKeys = ['step1', 'step2', 'step3', 'step4'] as const

export default function HomeHowWeWork() {
  const t = useTranslations('home.howWeWork')
  const steps = stepKeys.map((key, i) => ({ label: t(key), num: i + 1 }))

  return (
    <section className="py-16 lg:py-24 bg-slate-50 relative">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-serif font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-slate-600">{t('description')}</p>
          <p className="mt-2 text-sm text-slate-500">
            {t('noteConsulting')} · {t('noteDigital')}
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-card"
              >
                <span className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center mb-3 shrink-0">
                  {step.num}
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">{step.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link href="/about" className="inline-flex items-center text-primary font-semibold hover:underline hover:-translate-y-px transition-all duration-200">
            {t('learnMore')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
