'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { portfolioItems, portfolioImageAlts } from '@/lib/digitalPortfolio'

const featuredIds = ['ken-effect', 'business-cocoon', 'roalla-site'] as const

export default function HomeOurWork() {
  const t = useTranslations('home.ourWork')
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
    }))

  return (
    <section className="py-14 lg:py-20 bg-white relative">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 lg:p-10">
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{t('eyebrow')}</p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">{t('title')}</h2>
              <p className="mt-3 text-slate-600">{t('description')}</p>
              <Link
                href="/digital-creations"
                className="mt-5 inline-flex items-center link-action hover:underline"
              >
                {t('cta')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-4">
              {featured.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all"
                >
                  <div className="relative h-32 bg-slate-100">
                    {item.brandPreview ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-primary/5">
                        <span className="font-serif font-bold text-slate-800">ROALLA</span>
                      </div>
                    ) : item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={portfolioImageAlts[item.id as keyof typeof portfolioImageAlts]}
                        fill
                        className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                        unoptimized
                        sizes="240px"
                      />
                    ) : null}
                  </div>
                  <div className="p-3 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-primary-dark transition-colors">
                      {item.name}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-dark shrink-0" aria-hidden />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
