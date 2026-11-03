'use client'

import Image from 'next/image'
import { ArrowRight, Bot, LineChart, Workflow } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'
import { getPortfolioItem, portfolioImageAlts } from '@/lib/digitalPortfolio'

const tiles = [
  { key: 'product', icon: Bot, kind: 'visual' as const },
  { key: 'advisory', icon: LineChart, kind: 'quote' as const },
  { key: 'automation', icon: Workflow, kind: 'quote' as const },
] as const

export default function HomeResults() {
  const t = useTranslations('home.results')
  const pitch = getPortfolioItem('pitch-hotshots')

  return (
    <section id="our-work" className="relative scroll-mt-24 bg-white py-14 lg:py-20">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">{t('eyebrow')}</p>
          <h2 className="font-serif text-2xl font-bold text-slate-900 md:text-3xl">{t('title')}</h2>
          <p className="mt-3 text-slate-600">{t('description')}</p>
        </Reveal>

        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3 lg:gap-6">
          {tiles.map(({ key, icon: Icon, kind }, index) => (
            <Reveal
              key={key}
              delayMs={index * 60}
              className="home-tile group flex h-full flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-white"
            >
              {kind === 'visual' && pitch?.imageUrl ? (
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src={pitch.imageUrl}
                    alt={portfolioImageAlts['pitch-hotshots']}
                    fill
                    unoptimized
                    decoding="async"
                    sizes="(max-width: 767px) 100vw, 360px"
                    className="object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" aria-hidden />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-slate-950/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                    <Icon className="h-3 w-3 text-cyan-300" aria-hidden />
                    {t(`${key}Badge`)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 pt-5 sm:px-6 sm:pt-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10">
                    <Icon className="h-5 w-5 text-primary-dark" aria-hidden />
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary-dark">{t(`${key}Badge`)}</p>
                </div>
              )}

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                {kind === 'quote' ? (
                  <blockquote className="flex-1">
                    <p className="text-sm leading-relaxed text-slate-700">
                      <span className="mr-1 font-serif text-lg leading-none text-primary" aria-hidden>
                        “
                      </span>
                      {t(`${key}Quote`)}
                    </p>
                  </blockquote>
                ) : (
                  <p className="flex-1 text-sm leading-relaxed text-slate-700">{t(`${key}Body`)}</p>
                )}
                <footer className="mt-5 border-t border-slate-200 pt-4">
                  <p className="text-sm font-semibold text-slate-900">{t(`${key}Name`)}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{t(`${key}Meta`)}</p>
                </footer>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
          >
            {t('primaryCta')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
          <Link href="/services/portfolio" className="link-action inline-flex items-center text-sm font-semibold hover:underline">
            {t('secondaryCta')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
