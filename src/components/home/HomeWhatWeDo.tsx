'use client'

import { ArrowRight, Compass, Handshake, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
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
    <section id="why-roalla" className="relative bg-slate-50 py-14 scroll-mt-24 lg:py-20">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-9 max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">{t('eyebrow')}</p>
          <h2 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">{t('title')}</h2>
          <p className="mt-3 text-lg text-slate-600">{t('description')}</p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ key, icon: Icon }, index) => (
            <Reveal key={key} delayMs={index * 40} className="home-tile rounded-2xl bg-white p-5 lg:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/10">
                <Icon className="h-5 w-5 text-primary-dark" aria-hidden />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-slate-900">{t(`${key}Title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(`${key}Description`)}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 grid gap-4 md:grid-cols-3">
          <Link href="/programs/business-enablement" className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-primary/50 hover:shadow-sm lg:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-dark">{t('businessEyebrow')}</p>
            <h3 className="mt-2 font-serif text-xl font-bold text-slate-900">{t('businessTitle')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t('businessDescription')}</p>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark">
              {t('businessCta')}<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
          <Link href="/services/agentic" className="group rounded-2xl border border-primary/25 bg-slate-950 p-5 text-white transition-all hover:border-primary/60 hover:shadow-sm lg:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">{t('agenticEyebrow')}</p>
            <h3 className="mt-2 font-serif text-xl font-bold text-white">{t('agenticTitle')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{t('agenticDescription')}</p>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-cyan-300">
              {t('agenticCta')}<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
          <Link href="/services/digital-visibility-optimization" className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-primary/50 hover:shadow-sm lg:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-dark">{t('visibilityEyebrow')}</p>
            <h3 className="mt-2 font-serif text-xl font-bold text-slate-900">{t('visibilityTitle')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t('visibilityDescription')}</p>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark">
              {t('visibilityCta')}<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
