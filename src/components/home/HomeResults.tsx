'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'
import { getPortfolioItem, portfolioImageAlts } from '@/lib/digitalPortfolio'

const metrics = ['metric1', 'metric2', 'metric3'] as const

export default function HomeResults() {
  const t = useTranslations('home.results')
  const pitch = getPortfolioItem('pitch-hotshots')

  return (
    <section id="our-work" className="relative scroll-mt-24 bg-slate-50 py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">{t('eyebrow')}</p>
          <h2 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">{t('title')}</h2>
          <p className="mt-3 text-lg text-slate-600">{t('description')}</p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
            {metrics.map((key, index) => (
              <Reveal key={key} delayMs={index * 40} className="border-t border-slate-300 pt-5">
                <p className="font-serif text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  {t(`${key}Value`)}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{t(`${key}Label`)}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(`${key}Body`)}</p>
              </Reveal>
            ))}
          </div>

          {pitch?.imageUrl ? (
            <Reveal delayMs={80} className="lg:col-span-5">
              <a
                href={pitch.tryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden border border-slate-200 bg-white"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src={pitch.imageUrl}
                    alt={portfolioImageAlts['pitch-hotshots']}
                    fill
                    unoptimized
                    decoding="async"
                    sizes="(max-width: 1023px) 100vw, 40vw"
                    className="object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"
                    aria-hidden
                  />
                  <p className="absolute bottom-4 left-4 right-4 font-serif text-lg font-bold text-white">
                    {t('liveExampleTitle')}
                  </p>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-relaxed text-slate-600">{t('liveExampleBody')}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark">
                    {t('liveExampleCta')}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </a>
            </Reveal>
          ) : null}
        </div>

        <Reveal className="mt-12">
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
          >
            {t('primaryCta')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
