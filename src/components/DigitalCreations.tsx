'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ExternalLink, ArrowRight, CheckCircle, Zap, Lightbulb, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import ScheduleButton from './CalendlyButton'

const toolIcons = [Sparkles, Zap, Lightbulb] as const
const toolImageUrls = ['/advisory-board-match.jpg', '/soaring-puck.jpg', '/true-north-audit.jpg'] as const
const toolImageAlts = [
  'The Business Cocoon platform showing Coffee Break feature and dashboard interface',
  'Soaring Puck dashboard showing team management, player tracking, and operational tools interface',
  'True North Audit AI-powered platform landing page showing enterprise-grade infrastructure security and compliance features',
]
const tryUrls = ['https://www.businesscocoon.com', 'https://www.soaringpuck.com', 'https://www.truenorthaudit.com'] as const

const DigitalCreations = () => {
  const t = useTranslations('digitalCreations')
  const tools = [
    { name: t('t0Name'), desc: t('t0Desc'), bullets: [t('t0B1'), t('t0B2'), t('t0B3')], icon: toolIcons[0], imageUrl: toolImageUrls[0], imageAlt: toolImageAlts[0], tryUrl: tryUrls[0] },
    { name: t('t1Name'), desc: t('t1Desc'), bullets: [t('t1B1'), t('t1B2'), t('t1B3')], icon: toolIcons[1], imageUrl: toolImageUrls[1], imageAlt: toolImageAlts[1], tryUrl: tryUrls[1] },
    { name: t('t2Name'), desc: t('t2Desc'), bullets: [t('t2B1'), t('t2B2'), t('t2B3')], icon: toolIcons[2], imageUrl: toolImageUrls[2], imageAlt: toolImageAlts[2], tryUrl: tryUrls[2] },
  ]

  return (
    <section id="digital-creations" className="section-padding bg-black py-20 lg:py-28 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-white mb-4">
            {t('portfolioTitle')}
          </h2>
          <p className="text-lg md:text-xl text-gray-400 font-medium mb-8">
            {t('portfolioSubtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <p className="text-lg text-gray-300 leading-relaxed mb-6">{t('intro1')}</p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              {t('introBullet1')}
            </li>
            <li className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              {t('introBullet2')}
            </li>
            <li className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              {t('introBullet3')}
            </li>
          </ul>
          <p className="text-sm text-primary/90">
            <a href="https://www.truenorthaudit.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              {t('assessmentTieIn')}
            </a>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16 relative">
          <div className="absolute inset-x-0 -top-8 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-surface-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 hover:border-primary/30 overflow-hidden"
            >
              <div className="relative h-48 bg-surface-elevated overflow-hidden">
                <Image
                  src={tool.imageUrl}
                  alt={tool.imageAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized
                  priority={index === 0}
                  fetchPriority={index === 0 ? 'high' : undefined}
                />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold z-10 bg-green-500/30 text-green-200">
                  {t('liveTool')}
                </div>
              </div>

              <div className="p-6 lg:p-8">
                <h3 className="text-xl font-bold text-white mb-3">{tool.name}</h3>
                <p className="text-gray-300 text-base leading-relaxed mb-4">{tool.desc}</p>

                <ul className="space-y-2 mb-6">
                  {tool.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-primary/80 mb-4 italic">{t('caseStudy')}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={tool.tryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm flex-1 sm:flex-none hover:scale-[1.02]"
                  >
                    {t('tryTool')}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center text-primary hover:text-primary-dark font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm border border-primary hover:bg-primary/5 hover:-translate-y-px"
                  >
                    {t('learnMore')}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          id="digital-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary via-primary-dark to-primary rounded-2xl p-10 md:p-16 text-center shadow-2xl relative"
        >
          <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('ctaTitle')}
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ScheduleButton variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-[1.02] transition-transform duration-300">
              {t('scheduleCall')}
            </ScheduleButton>
            <a
              href="mailto:sales@roalla.com"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 border-2 border-white/30 hover:border-white/50 hover:scale-[1.02]"
            >
              {t('contactUs')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default DigitalCreations
