'use client'

import Image from 'next/image'
import { ArrowRight, BookOpen } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import Reveal from '../motion/Reveal'

export default function HomeExecutiveInsights() {
  const t = useTranslations('home.executiveInsights')
  const topics = [t('topicAi'), t('topicTechnology'), t('topicRisk'), t('topicValue')]

  return (
    <section className="relative bg-white py-14 lg:py-20" aria-labelledby="home-executive-insights-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#090b0e] text-white shadow-2xl shadow-slate-950/15">
          <div className="grid lg:grid-cols-[1.08fr_.92fr]">
            <div className="relative z-10 flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <div className="flex items-center gap-3 text-primary">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-primary/35 bg-primary/10">
                  <BookOpen className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-xs font-bold uppercase tracking-[.2em]">{t('eyebrow')}</p>
              </div>
              <h2 id="home-executive-insights-title" className="mt-7 max-w-2xl font-serif text-3xl font-normal leading-tight text-white sm:text-4xl lg:text-5xl">
                {t('title')}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                {t('description')}
              </p>
              <div className="mt-7 flex flex-wrap gap-2" aria-label={t('topicsLabel')}>
                {topics.map((topic) => (
                  <span key={topic} className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300">
                    {topic}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link
                  href="/executive-insights"
                  onClick={() => trackAnalyticsEvent('executive_insights_home_click', { location: 'homepage_feature' })}
                  className="inline-flex min-h-12 items-center gap-7 rounded-lg bg-primary px-6 text-sm font-bold text-slate-950 transition-colors hover:bg-primary-light"
                >
                  {t('cta')}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <span className="text-sm font-semibold text-slate-400">{t('guideCount')}</span>
              </div>
            </div>
            <div className="relative min-h-[300px] overflow-hidden lg:min-h-[500px]">
              <Image
                src="/images/executive-insights/hero.avif"
                alt=""
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover object-center opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#090b0e] via-[#090b0e]/35 to-transparent lg:block" aria-hidden />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e]/75 via-transparent to-transparent" aria-hidden />
              <div className="absolute bottom-7 left-7 right-7 border-l-2 border-primary bg-black/55 px-5 py-4 backdrop-blur-sm sm:bottom-10 sm:left-10">
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">{t('imageEyebrow')}</p>
                <p className="mt-1.5 max-w-md font-serif text-xl leading-snug text-white sm:text-2xl">{t('imageStatement')}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
