'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Briefcase, Globe, CheckCircle2, ExternalLink } from 'lucide-react'
import BrowserFrame from '../digital/BrowserFrame'
import { portfolioItems, portfolioImageAlts } from '@/lib/digitalPortfolio'

const featuredIds = ['business-cocoon', 'soaring-puck', 'ken-effect', 'roalla-site'] as const
const consultingOutcomeKeys = ['consultingOutcome1', 'consultingOutcome2', 'consultingOutcome3'] as const

export default function HomeOurWork() {
  const t = useTranslations('home.proofBand')
  const tWhatWeDo = useTranslations('home.whatWeDo')
  const tPortfolio = useTranslations('digitalCreations')
  const nameMap = { t1: 't1Name', t3: 't3Name', t4: 't4Name', t5: 't5Name' } as const

  const featured = featuredIds
    .map((id) => portfolioItems.find((p) => p.id === id))
    .filter(Boolean)
    .map((item) => ({
      id: item!.id,
      name: tPortfolio(nameMap[item!.i18nPrefix]),
      url: item!.tryUrl,
      imageUrl: item!.imageUrl,
      brandPreview: item!.brandPreview,
      domain: item!.domain,
    }))

  return (
    <section className="py-14 lg:py-20 bg-white relative">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{t('eyebrow')}</p>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-slate-600">{t('description')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Consulting proof */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 lg:p-8 shadow-card"
          >
            <div className="flex items-start gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-primary" aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900">{t('consultingTitle')}</h3>
                <p className="mt-1 text-sm text-slate-600">{t('consultingDesc')}</p>
              </div>
            </div>
            <ul className="space-y-3 flex-1">
              {consultingOutcomeKeys.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                  {tWhatWeDo(key)}
                </li>
              ))}
            </ul>
            <Link
              href="/services"
              className="mt-6 inline-flex items-center link-action hover:underline"
            >
              {t('consultingCta')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>

          {/* Digital proof */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="flex flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-primary/[0.04] p-6 lg:p-8 shadow-card"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-primary" aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900">{t('digitalTitle')}</h3>
                <p className="mt-1 text-sm text-slate-600">{t('digitalDesc')}</p>
                <p className="mt-2 text-xs font-medium text-primary-dark">{t('digitalStats')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {featured.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col"
                >
                  <BrowserFrame
                    imageUrl={item.imageUrl}
                    imageAlt={portfolioImageAlts[item.id as keyof typeof portfolioImageAlts]}
                    brandPreview={item.brandPreview}
                    domain={item.domain}
                    className="group-hover:shadow-card-hover transition-shadow duration-300"
                  />
                  <span className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800 group-hover:text-primary-dark transition-colors">
                    {item.name}
                    <ExternalLink className="w-3 h-3 opacity-60" aria-hidden />
                  </span>
                </a>
              ))}
            </div>

            <Link
              href="/digital-creations"
              className="mt-6 inline-flex items-center link-action hover:underline"
            >
              {t('digitalCta')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
