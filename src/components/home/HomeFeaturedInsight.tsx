'use client'

import Image from 'next/image'
import { ArrowRight, BookOpen } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'
import { INSIGHT_SLUGS, insightCoverImage, type InsightSlug } from '@/lib/insights'
import { formatInsightReadTime } from '@/lib/insight-read-time'

const CURATED_INSIGHTS = [
  'build-buy-or-integrate-technology',
  'website-redesign-or-conversion-refresh',
  'what-to-automate-first',
] as const satisfies readonly InsightSlug[]

export default function HomeFeaturedInsight() {
  const t = useTranslations('home.featuredInsight')
  const tInsights = useTranslations('insights')

  return (
    <section className="relative bg-slate-50 py-14 lg:py-20">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">{t('badge')}</p>
          <h2 className="font-serif text-2xl font-bold text-slate-900 md:text-3xl">{t('title')}</h2>
          <p className="mt-3 text-slate-600">{t('description')}</p>
        </Reveal>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {CURATED_INSIGHTS.map((slug, index) => (
            <Reveal key={slug} delayMs={index * 50} className="h-full">
              <Link
                href={{ pathname: '/insights/[slug]', params: { slug } }}
                className="home-tile group flex h-full flex-col overflow-hidden rounded-2xl bg-white p-0"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <Image
                    src={insightCoverImage(slug)}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                    sizes="(max-width: 767px) 100vw, 380px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" aria-hidden />
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 shrink-0 text-primary/70" aria-hidden />
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">
                      {formatInsightReadTime(tInsights, slug)}
                    </p>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-primary-dark">
                    {tInsights(`${slug}.title`)}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {tInsights(`${slug}.summary`)}
                  </p>
                  <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary-dark">
                    {t('readMore')}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 text-center">
          <Link href="/insights" className="link-action inline-flex items-center text-sm font-semibold">
            {t('allInsights', { count: INSIGHT_SLUGS.length })}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
