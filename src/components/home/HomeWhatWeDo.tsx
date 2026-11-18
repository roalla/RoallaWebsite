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
    <section id="why-roalla" className="relative scroll-mt-24 bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">{t('eyebrow')}</p>
          <h2 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">{t('title')}</h2>
          <p className="mt-3 text-lg text-slate-600">{t('description')}</p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
          {reasons.map(({ key, icon: Icon }, index) => (
            <Reveal key={key} delayMs={index * 40} className="border-t border-slate-200 pt-6">
              <div className="flex h-10 w-10 items-center justify-center border border-primary/20 bg-primary/10">
                <Icon className="h-5 w-5 text-primary-dark" aria-hidden />
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-slate-900">{t(`${key}Title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(`${key}Description`)}</p>
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
