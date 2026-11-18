'use client'

import { ArrowRight, Compass, Handshake, ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Reveal from '../motion/Reveal'

const reasons = [
  { key: 'needsLed', icon: Compass },
  { key: 'accountable', icon: Handshake },
  { key: 'transparent', icon: ShieldCheck },
] as const

export default function HomeWhatWeDo() {
  const t = useTranslations('home.whatWeDo')

  return (
    <section
      id="why-roalla"
      className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-primary/[0.04] py-16 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,_rgba(8,145,178,0.12),_transparent_65%)]"
        aria-hidden
      />
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">{t('eyebrow')}</p>
          <h2 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">{t('title')}</h2>
          <p className="mt-3 text-lg text-slate-600">{t('description')}</p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {reasons.map(({ key, icon: Icon }, index) => (
            <Reveal key={key} delayMs={index * 50} className="h-full">
              <div className="home-tile group relative flex h-full flex-col overflow-hidden rounded-xl bg-white/90 p-6 backdrop-blur-sm">
                <div
                  className="absolute inset-x-6 top-0 h-0.5 origin-left scale-x-40 bg-gradient-to-r from-primary to-primary/30 transition-transform duration-500 motion-safe:group-hover:scale-x-100"
                  aria-hidden
                />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary-dark shadow-[0_0_0_0_rgba(8,145,178,0)] transition-all duration-300 motion-safe:group-hover:scale-110 motion-safe:group-hover:shadow-[0_0_24px_rgba(8,145,178,0.35)]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="font-serif text-3xl font-bold tabular-nums text-slate-200 transition-colors duration-300 group-hover:text-primary/40">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-xl font-bold text-slate-900 group-hover:text-primary-dark">
                  {t(`${key}Title`)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{t(`${key}Description`)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <a
            href="#home-cta"
            className="inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
          >
            {t('ctaLink')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
