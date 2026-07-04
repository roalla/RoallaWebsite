'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { INSIGHT_SLUGS, type InsightSlug } from '@/lib/insights'
import { formatInsightReadTime } from '@/lib/insight-read-time'

const VISIBLE_COUNT = 3
const ROTATE_MS = 6000

function visibleSlugs(startIndex: number): InsightSlug[] {
  return Array.from({ length: VISIBLE_COUNT }, (_, i) => INSIGHT_SLUGS[(startIndex + i) % INSIGHT_SLUGS.length])
}

export default function HomeFeaturedInsight() {
  const t = useTranslations('home.featuredInsight')
  const tInsights = useTranslations('insights')
  const reduceMotion = usePrefersReducedMotion()
  const canRotate = INSIGHT_SLUGS.length > VISIBLE_COUNT && !reduceMotion

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const advance = useCallback(() => {
    setActiveIndex((i) => (i + 1) % INSIGHT_SLUGS.length)
  }, [])

  const retreat = useCallback(() => {
    setActiveIndex((i) => (i - 1 + INSIGHT_SLUGS.length) % INSIGHT_SLUGS.length)
  }, [])

  useEffect(() => {
    if (!canRotate || isPaused) return
    const id = window.setInterval(advance, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [canRotate, isPaused, advance])

  const slugs = visibleSlugs(activeIndex)

  return (
    <section className="py-14 lg:py-20 bg-slate-50 relative">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{t('badge')}</p>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">{t('title')}</h2>
        </Reveal>

        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsPaused(false)
          }}
        >
          {canRotate && (
            <div className="hidden md:flex absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-10">
              <button
                type="button"
                onClick={retreat}
                className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 shadow-card hover:border-primary/30 hover:text-primary-dark transition-colors"
                aria-label={t('carouselPrevious')}
              >
                <ChevronLeft className="w-5 h-5" aria-hidden />
              </button>
            </div>
          )}

          <div
            className="grid md:grid-cols-3 gap-6"
            aria-live={canRotate ? 'polite' : undefined}
            aria-atomic="true"
          >
            {slugs.map((slug) => (
              <div key={slug} className="insight-card-enter h-full">
                <Link
                  href={{ pathname: '/insights/[slug]', params: { slug } }}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card hover:border-primary/30 hover:shadow-card-hover transition-all duration-300"
                >
                  <BookOpen className="w-8 h-8 text-primary/70 mb-4" aria-hidden />
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">
                    {formatInsightReadTime(tInsights, slug)}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-primary-dark transition-colors">
                    {tInsights(`${slug}.title`)}
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-slate-600 leading-relaxed">{tInsights(`${slug}.summary`)}</p>
                  <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary-dark">
                    {t('readMore')}
                    <ArrowRight className="ml-2 w-4 h-4 motion-safe:group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </div>
            ))}
          </div>

          {canRotate && (
            <div className="hidden md:flex absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-10">
              <button
                type="button"
                onClick={advance}
                className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 shadow-card hover:border-primary/30 hover:text-primary-dark transition-colors"
                aria-label={t('carouselNext')}
              >
                <ChevronRight className="w-5 h-5" aria-hidden />
              </button>
            </div>
          )}
        </div>

        {canRotate && (
          <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label={t('carouselDots')}>
            {INSIGHT_SLUGS.map((slug, index) => (
              <button
                key={slug}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={t('carouselDot', { n: index + 1 })}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'w-6 bg-primary-dark' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}

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
