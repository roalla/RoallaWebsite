'use client'

import Image from 'next/image'
import { ArrowRight, BookOpen } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'
import { INSIGHT_SLUGS, insightCoverImage } from '@/lib/insights'
import { formatInsightReadTime } from '@/lib/insight-read-time'

const FEATURED_SLUG = 'build-buy-or-integrate-technology' as const

export default function HomeFeaturedInsight() {
  const t = useTranslations('home.featuredInsight')
  const tInsights = useTranslations('insights')

  return (
    <section className="relative bg-white py-14 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-4xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">{t('badge')}</p>
          <h2 className="font-serif text-2xl font-bold text-slate-900 md:text-3xl">{t('title')}</h2>
          <p className="mt-3 max-w-2xl text-slate-600">{t('description')}</p>

          <Link
            href={{ pathname: '/insights/[slug]', params: { slug: FEATURED_SLUG } }}
            className="group mt-8 grid overflow-hidden border border-slate-200 bg-slate-50 md:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 md:aspect-auto md:min-h-[16rem]">
              <Image
                src={insightCoverImage(FEATURED_SLUG)}
                alt=""
                fill
                className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                sizes="(max-width: 767px) 100vw, 480px"
                unoptimized
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 shrink-0 text-primary/70" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">
                  {formatInsightReadTime(tInsights, FEATURED_SLUG)}
                </p>
              </div>
              <h3 className="mt-3 font-serif text-xl font-bold text-slate-900 transition-colors group-hover:text-primary-dark sm:text-2xl">
                {tInsights(`${FEATURED_SLUG}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {tInsights(`${FEATURED_SLUG}.summary`)}
              </p>
              <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary-dark">
                {t('readMore')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden />
              </span>
            </div>
          </Link>

          <div className="mt-6">
            <Link href="/insights" className="inline-flex items-center text-sm font-semibold text-primary-dark hover:underline">
              {t('allInsights', { count: INSIGHT_SLUGS.length })}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
