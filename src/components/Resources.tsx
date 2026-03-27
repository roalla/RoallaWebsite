'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowRight, Lock } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const Resources = () => {
  const t = useTranslations('resources')

  return (
    <section id="resources" className="section-padding bg-black py-20 lg:py-28 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
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
          id="cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary via-primary-dark to-[#0B1320] rounded-2xl p-10 md:p-16 text-center shadow-[0_25px_80px_rgba(0,0,0,0.55)] mb-16 relative border border-white/20 ring-1 ring-primary/40 overflow-hidden"
        >
          <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="relative z-10">
            <span className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Members only
            </span>
          <p className="text-sm text-white/90 mb-4 font-medium">{t('benefitsTeaser')}</p>
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white/25 ring-1 ring-white/30 rounded-xl flex items-center justify-center shadow-xl">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-sm">
            {t('exclusiveTitle')}
          </h3>
          <p className="text-xl text-white/95 mb-4 max-w-2xl mx-auto">
            {t('exclusiveDesc')}
          </p>
          <p className="text-sm text-white/90 mb-8">{t('socialProof')}</p>
          <Link
            href="/resources/request"
            className="inline-flex items-center bg-white text-primary hover:bg-white/90 font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-2xl hover:shadow-[0_10px_32px_rgba(255,255,255,0.28)] hover:scale-[1.03] ring-1 ring-white/40"
          >
            <Lock className="w-5 h-5 mr-2" />
            {t('requestAccess')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Resources
