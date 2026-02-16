'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { FileText, BookOpen, ArrowRight, TrendingUp, BarChart3, Lightbulb, Lock } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const resourceIcons = [FileText, BarChart3, TrendingUp, Lightbulb] as const
const resourceColors = ['from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600'] as const

const Resources = () => {
  const t = useTranslations('resources')
  const resources = [
    { type: t('guide'), title: t('r0Title'), description: t('r0Desc'), icon: resourceIcons[0], color: resourceColors[0] },
    { type: t('template'), title: t('r1Title'), description: t('r1Desc'), icon: resourceIcons[1], color: resourceColors[1] },
    { type: t('tool'), title: t('r2Title'), description: t('r2Desc'), icon: resourceIcons[2], color: resourceColors[2] },
    { type: t('framework'), title: t('r3Title'), description: t('r3Desc'), icon: resourceIcons[3], color: resourceColors[3] },
  ]
  const insights = [
    { title: t('i0Title'), description: t('i0Desc'), readTime: t('minRead', { count: 5 }) },
    { title: t('i1Title'), description: t('i1Desc'), readTime: t('minRead', { count: 7 }) },
    { title: t('i2Title'), description: t('i2Desc'), readTime: t('minRead', { count: 6 }) },
  ]

  return (
    <section id="resources" className="section-padding bg-black py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-white mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary via-primary-dark to-primary rounded-2xl p-10 md:p-16 text-center shadow-2xl mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('exclusiveTitle')}
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('exclusiveDesc')}
          </p>
          <Link
            href="/resources/request"
            className="inline-flex items-center bg-white text-primary hover:bg-white/90 font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Lock className="w-5 h-5 mr-2" />
            {t('requestAccess')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            {t('whatsIn')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-surface-card rounded-xl p-6 shadow-lg border border-white/10"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${resource.color} rounded-lg flex items-center justify-center mb-4`}>
                  <resource.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                  {resource.type}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{resource.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{resource.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="bg-surface-card rounded-2xl p-8 md:p-12 border border-white/10">
          <div className="flex items-center mb-8">
            <BookOpen className="w-8 h-8 text-primary mr-3" />
            <h3 className="text-3xl font-bold text-white">{t('featuredInsights')}</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-surface-card rounded-lg p-6 shadow-md border border-white/10 opacity-75"
              >
                <div className="text-xs font-semibold text-gray-500 mb-3">{insight.readTime}</div>
                <h4 className="text-lg font-bold text-white mb-3">{insight.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{insight.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/resources/request"
              className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              {t('requestAccessLink')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Resources
