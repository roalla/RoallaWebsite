'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Lightbulb } from 'lucide-react'

export default function HomeFeaturedInsight() {
  const t = useTranslations('home.featuredInsight')
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">{t('title')}</h2>
          <Link
            href="/resources"
            className="group block rounded-xl border border-gray-200 p-6 lg:p-8 hover:border-primary/30 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {t('articleTitle')}
                </h3>
                <p className="mt-2 text-gray-600 text-sm">{t('articleDescription')}</p>
                <span className="mt-3 inline-flex items-center text-sm font-medium text-primary group-hover:underline">
                  {t('readMore')}
                  <ArrowRight className="ml-1 w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
