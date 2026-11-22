'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowRight, MonitorSmartphone, SearchCheck, Sparkles, Target } from 'lucide-react'
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
    key: 'execute',
    icon: Target,
    anchor: 'execution',
    image: '/images/services/business-advisory-hero.opt.webp',
    imagePosition: 'object-[center_30%]',
  },
] as const

const serviceLinks = [
  { key: 'serviceWebsite', href: '/website-design' },
  { key: 'serviceVisibility', href: '/services/search-ai-visibility' },
  { key: 'serviceAi', href: '/services/ai-agents' },
  { key: 'serviceAutomation', href: '/services/automation' },
  { key: 'serviceSecurity', href: '/services/security-risk-compliance' },
  { key: 'serviceIndustries', href: '/industries' },
  { key: 'serviceWorkshops', href: '/programs/workshops' },
] as const

export default function HomeBusinessOutcomes() {
  const t = useTranslations('home.businessOutcomes')

  return (
    <section id="choose-your-situation" className="relative scroll-mt-24 bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">
            {t('eyebrow')}
          </p>
          <h2 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">{t('title')}</h2>
          <p className="mt-3 text-lg text-slate-600">{t('description')}</p>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {situations.map(({ key, icon: Icon, anchor, image, imagePosition }, index) => (
            <Reveal key={key} delayMs={index * 40} className="h-full">
              <Link
                href={{ pathname: '/solutions', hash: anchor }}
                className="group flex h-full flex-col border-t border-slate-200 pt-5 transition hover:border-primary"
              >
                <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-lg bg-slate-200">
                  <Image
                    src={image}
                    alt=""
                    fill
                    unoptimized
                    decoding="async"
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                    className={`object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03] ${imagePosition}`}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"
                    aria-hidden
                  />
                  <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-md border border-white/25 bg-slate-950/65 text-white backdrop-blur-sm">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-primary-dark">
                  {t(`${key}Title`)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {t(`${key}Description`)}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark">
                  {t(`${key}Cta`)}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <Link href="/solutions" className="inline-flex items-center text-sm font-semibold text-primary-dark hover:underline">
            {t('allSituationsCta')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
        <nav className="mt-8 border-t border-slate-200 pt-8" aria-label={t('servicesLabel')}>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('servicesLabel')}</p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
            {serviceLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm font-semibold text-slate-800 underline-offset-4 hover:text-primary-dark hover:underline">
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
