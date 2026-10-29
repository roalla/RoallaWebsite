'use client'

import React from 'react'
import { ArrowRight, MonitorSmartphone, SearchCheck, ShieldCheck, Sparkles, Target } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'

const situations = [
  { key: 'growth', icon: SearchCheck, anchor: 'growth-visibility' },
  { key: 'experience', icon: MonitorSmartphone, anchor: 'experience-products' },
  { key: 'automate', icon: Sparkles, anchor: 'automation-ai' },
  { key: 'protect', icon: ShieldCheck, anchor: 'security-compliance' },
  { key: 'execute', icon: Target, anchor: 'execution' },
] as const

export default function HomeBusinessOutcomes() {
  const t = useTranslations('home.businessOutcomes')

  return (
    <section id="choose-your-situation" className="relative bg-white py-14 lg:py-20 scroll-mt-24">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mb-9">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">
            {t('eyebrow')}
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-lg text-slate-600">{t('description')}</p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 lg:gap-5">
          {situations.map(({ key, icon: Icon, anchor }, index) => (
            <Reveal
              key={key}
              delayMs={index * 40}
              className="h-full"
            >
              <Link href={{ pathname: '/solutions', hash: anchor }} className="home-tile group flex h-full flex-col rounded-2xl bg-slate-50 p-5 lg:p-6">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary-dark" aria-hidden />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-primary-dark">{t(`${key}Title`)}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">{t(`${key}Description`)}</p>
                <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary-dark">
                  {t(`${key}Cta`)}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-7 text-center">
          <Link href="/solutions" className="inline-flex items-center text-sm font-semibold text-primary-dark hover:underline">
            {t('allSituationsCta')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
