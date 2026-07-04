'use client'

import React from 'react'
import { ArrowRight, BookOpen } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'
import { INSIGHT_SLUGS, type InsightSlug } from '@/lib/insights'

const insightKeys = ['article1', 'article2', 'article3'] as const

const insightSlugs: Record<(typeof insightKeys)[number], InsightSlug> = {
  article1: 'fractional-coo',
  article2: 'strategic-planning',
  article3: 'process-optimization',
}

export default function HomeFeaturedInsight() {
  const t = useTranslations('home.featuredInsight')

  return (
    <section className="py-14 lg:py-20 bg-slate-50 relative">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{t('badge')}</p>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">{t('title')}</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {insightKeys.map((key, index) => (
            <Reveal key={key} delayMs={index * 80}>
              <Link
                href={{ pathname: '/insights/[slug]', params: { slug: insightSlugs[key] } }}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card hover:border-primary/30 hover:shadow-card-hover transition-all duration-300"
              >
                <BookOpen className="w-8 h-8 text-primary/70 mb-4" aria-hidden />
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-dark transition-colors">
                  {t(`${key}Title`)}
                </h3>
                <p className="mt-3 flex-1 text-sm text-slate-600 leading-relaxed">{t(`${key}Description`)}</p>
                <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary-dark">
                  {t('readMore')}
                  <ArrowRight className="ml-2 w-4 h-4 motion-safe:group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={300} className="mt-8 text-center">
          <Link href="/insights" className="link-action inline-flex items-center text-sm font-semibold">
            {INSIGHT_SLUGS.length}+ insights
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
