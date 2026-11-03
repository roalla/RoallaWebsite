'use client'

import { Compass, Handshake, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Reveal from '../motion/Reveal'

const reasons = [
  { key: 'needsLed', icon: Compass },
  { key: 'founderLed', icon: UserRoundCheck },
  { key: 'accountable', icon: Handshake },
  { key: 'transparent', icon: ShieldCheck },
] as const

export default function HomeWhatWeDo() {
  const t = useTranslations('home.whatWeDo')

  return (
    <section id="why-roalla" className="relative scroll-mt-24 bg-slate-50 py-14 lg:py-20">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-9 max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">{t('eyebrow')}</p>
          <h2 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">{t('title')}</h2>
          <p className="mt-3 text-lg text-slate-600">{t('description')}</p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ key, icon: Icon }, index) => (
            <Reveal
              key={key}
              delayMs={index * 40}
              className="home-tile rounded-2xl bg-white p-5 transition-transform duration-300 motion-safe:hover:-translate-y-0.5 lg:p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/10">
                <Icon className="h-5 w-5 text-primary-dark" aria-hidden />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-slate-900">{t(`${key}Title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(`${key}Description`)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
