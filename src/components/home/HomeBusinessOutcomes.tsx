'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowRight, MonitorSmartphone, SearchCheck, ShieldCheck, Sparkles, Target } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'

const situations = [
  {
    key: 'growth',
    icon: SearchCheck,
    anchor: 'growth-visibility',
    image: '/images/services/search-ai-visibility-hero.opt.webp',
    imagePosition: 'object-[center_35%]',
  },
  {
    key: 'experience',
    icon: MonitorSmartphone,
    anchor: 'experience-products',
    image: '/images/services/digital-outcome-launch.opt.webp',
    imagePosition: 'object-center',
  },
  {
    key: 'automate',
    icon: Sparkles,
    anchor: 'automation-ai',
    image: '/images/services/automation-hero.opt.webp',
    imagePosition: 'object-[center_40%]',
  },
  {
    key: 'protect',
    icon: ShieldCheck,
    anchor: 'security-compliance',
    image: '/images/insights/library/consolidate-systems-before-soc-2-readiness.opt.webp',
    imagePosition: 'object-center',
  },
  {
    key: 'execute',
    icon: Target,
    anchor: 'execution',
    image: '/images/services/business-advisory-hero.opt.webp',
    imagePosition: 'object-[center_30%]',
  },
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
          {situations.map(({ key, icon: Icon, anchor, image, imagePosition }, index) => (
            <Reveal
              key={key}
              delayMs={index * 40}
              className="h-full"
            >
              <Link
                href={{ pathname: '/solutions', hash: anchor }}
                className="home-tile group flex h-full flex-col overflow-hidden rounded-2xl bg-slate-50 p-0"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                  <Image
                    src={image}
                    alt=""
                    fill
                    unoptimized
                    decoding="async"
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 20vw"
                    className={`object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04] ${imagePosition}`}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/15 to-transparent"
                    aria-hidden
                  />
                  <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/25 bg-slate-950/65 text-white backdrop-blur-sm">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 lg:p-5">
                  <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-primary-dark">
                    {t(`${key}Title`)}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">
                    {t(`${key}Description`)}
                  </p>
                  <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary-dark">
                    {t(`${key}Cta`)}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
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
