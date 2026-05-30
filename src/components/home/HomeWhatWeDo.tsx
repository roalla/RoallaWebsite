'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Target, TrendingUp, Users, BarChart3, Lightbulb, Zap, ArrowRight } from 'lucide-react'

const pillarKeys = ['strategicPlanning', 'processOptimization', 'teamDevelopment', 'dataAnalytics', 'innovationConsulting', 'digitalTransformation'] as const
const pillarIcons = [Target, TrendingUp, Users, BarChart3, Lightbulb, Zap]

export default function HomeWhatWeDo() {
  const t = useTranslations('home.whatWeDo')
  const pillars = pillarKeys.map((key, i) => ({ icon: pillarIcons[i], label: t(key) }))
  return (
    <section className="py-16 lg:py-24 bg-slate-50 relative">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <h2 className="text-3xl font-serif font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-slate-600">{t('description')}</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {pillars.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex flex-col items-center text-center p-6 rounded-xl border border-slate-200 bg-white hover:border-primary/30 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-4 border border-primary/10">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
        >
          <Link
            href="/services"
            className="inline-flex items-center text-primary font-semibold hover:underline hover:-translate-y-px transition-all duration-200"
          >
            {t('exploreServices')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link
            href="/services/digital"
            className="inline-flex items-center text-slate-600 font-medium hover:text-primary hover:underline hover:-translate-y-px transition-all duration-200"
          >
            {t('exploreDigital')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
