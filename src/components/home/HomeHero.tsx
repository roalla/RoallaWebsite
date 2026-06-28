'use client'

import React from 'react'
import { ArrowRight, Briefcase, Globe } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScheduleButton from '../ScheduleButton'
import Reveal from '../motion/Reveal'
import HomeHeroSlideshow from './HomeHeroSlideshow'

/** Frosted panels — slight transparency with blur for readable contrast on dark hero */
const heroGlassPanel =
  'bg-white/85 backdrop-blur-lg border border-white/70 shadow-[0_8px_40px_rgba(15,23,42,0.1)]'
const pathCardClass =
  'group flex flex-col rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-sm p-4 motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card'

export default function HomeHero() {
  const t = useTranslations('home.hero')

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-24 lg:pt-28 bg-slate-950">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <HomeHeroSlideshow />
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-r from-slate-950/70 from-0% via-slate-950/45 via-50% to-slate-950/30 to-100%"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/55"
        aria-hidden
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-20">
        <div className="max-w-2xl">
          <div className={`rounded-2xl ${heroGlassPanel} p-6 sm:p-8 lg:p-10`}>
            <Reveal when="mount" as="h1" className="text-4xl sm:text-5xl lg:text-[3.25rem] font-serif font-extrabold text-slate-900 leading-tight tracking-tight">
              {t('title')}{' '}
              <span className="text-primary-dark">{t('titleHighlight')}</span>
            </Reveal>
            <Reveal when="mount" as="p" delayMs={100} className="mt-6 text-lg sm:text-xl text-slate-700 max-w-xl leading-relaxed">
              {t('subtitle')}
            </Reveal>

            <Reveal when="mount" delayMs={140} className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                {t('pathChooserLabel')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href={{ pathname: '/schedule', query: { intent: 'consulting' } }}
                  className={pathCardClass}
                  data-analytics="hero-path-consulting"
                >
                  <Briefcase className="w-5 h-5 text-primary-dark mb-2" aria-hidden />
                  <span className="text-sm font-semibold text-slate-900">{t('pathConsultingTitle')}</span>
                  <span className="mt-1 text-xs text-slate-600 leading-snug">{t('pathConsultingDesc')}</span>
                  <ArrowRight className="mt-3 w-4 h-4 text-primary-dark motion-safe:transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
                <Link
                  href={{ pathname: '/schedule', query: { intent: 'website' } }}
                  className={pathCardClass}
                  data-analytics="hero-path-digital"
                >
                  <Globe className="w-5 h-5 text-primary-dark mb-2" aria-hidden />
                  <span className="text-sm font-semibold text-slate-900">{t('pathDigitalTitle')}</span>
                  <span className="mt-1 text-xs text-slate-600 leading-snug">{t('pathDigitalDesc')}</span>
                  <ArrowRight className="mt-3 w-4 h-4 text-primary-dark motion-safe:transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
            </Reveal>

            <Reveal when="mount" delayMs={200} className="mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-start gap-3">
              <ScheduleButton
                variant="primary"
                size="lg"
                icon
                block
                className="w-full sm:w-auto sm:min-w-[16rem]"
                sublabel={t('responseTime')}
                sublabelClassName="text-slate-600"
              >
                {t('cta')}
              </ScheduleButton>
            </Reveal>
            <Reveal when="mount" delayMs={240} className="mt-4 text-xs font-medium text-slate-500">
              {t('proofLine')}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
