'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ExternalLink } from 'lucide-react'

const featuredKeys = ['featured1', 'featured2', 'featured3'] as const
const featuredUrls = [
  'https://www.keneffect.com/',
  'https://www.businesscocoon.com/products',
  'https://www.roalla.com',
] as const

export default function HomeOurWork() {
  const t = useTranslations('home.ourWork')
  const featured = featuredKeys.map((key, i) => ({
    name: t(key),
    url: featuredUrls[i],
  }))

  return (
    <section className="py-14 lg:py-20 bg-white relative">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 lg:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">{t('eyebrow')}</p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">{t('title')}</h2>
              <p className="mt-3 text-slate-600">{t('description')}</p>
              <Link
                href="/digital-creations"
                className="mt-5 inline-flex items-center text-primary font-semibold hover:underline hover:-translate-y-px transition-all duration-200"
              >
                {t('cta')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-3 lg:justify-end"
            >
              {featured.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-card hover:border-primary/30 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
                >
                  {item.name}
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" aria-hidden />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
