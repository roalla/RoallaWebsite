'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Search, Target, Rocket, CheckCircle, ArrowRight } from 'lucide-react'

const stepKeys = ['discovery', 'planning', 'implementation', 'improvement'] as const
const stepIcons = [Search, Target, Rocket, CheckCircle]

export default function HomeHowWeWork() {
  const t = useTranslations('home.howWeWork')
  const steps = stepKeys.map((key, i) => ({ icon: stepIcons[i], label: t(key) }))
  return (
    <section className="py-16 lg:py-24 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-serif font-bold text-white">{t('title')}</h2>
          <p className="mt-3 text-gray-300 max-w-xl mx-auto">{t('description')}</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-surface-card border border-white/10 flex items-center justify-center mb-3">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-300">{step.label}</span>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link href="/about" className="inline-flex items-center text-primary font-semibold hover:underline">
            {t('learnMore')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
