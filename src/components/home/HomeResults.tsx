'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'
import { getPortfolioItem, portfolioImageAlts } from '@/lib/digitalPortfolio'

const metrics = [
  { key: 'metric1', badgeKey: 'advisoryBadge' },
  { key: 'metric2', badgeKey: 'advisoryBadge' },
  { key: 'metric3', badgeKey: 'automationBadge' },
] as const

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
          <div className="grid gap-6 sm:grid-cols-3 lg:col-span-7">
            {metrics.map(({ key, badgeKey }, index) => (
              <Reveal key={key} delayMs={index * 40} className="flex h-full flex-col border-t border-slate-300 pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-dark">
                  {t(badgeKey)}
                </p>
                <p className="mt-3 font-serif text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  {t(`${key}Value`)}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{t(`${key}Label`)}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{t(`${key}For`)}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{t(`${key}Body`)}</p>
              </Reveal>
            ))}
          </div>

          {pitch?.imageUrl ? (
            <Reveal delayMs={80} className="lg:col-span-5">
              <a
                href={pitch.tryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden border border-slate-200 bg-white"
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
                  <p className="absolute left-4 top-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
                    {t('productBadge')}
                  </p>
                  <p className="absolute bottom-4 left-4 right-4 font-serif text-lg font-bold text-white">
                    {t('liveExampleTitle')}
                  </p>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm font-medium text-slate-500">{t('liveExampleFor')}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{t('liveExampleBody')}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark">
                    {t('liveExampleCta')}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </a>
            </Reveal>
          ) : null}
        </div>

        <Reveal className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
          >
            {t('primaryCta')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600">{t('ctaHint')}</p>
        </Reveal>
      </div>
    </section>
  )
}
