'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScheduleButton from '../ScheduleButton'

/** Solid panel — no backdrop-blur so content stays stable during slide transitions */
const heroGlassPanel =
  'bg-white/95 border border-white/70 shadow-[0_8px_40px_rgba(15,23,42,0.1)]'

export default function HomeHeroContent() {
  const t = useTranslations('home.hero')
  const tCommon = useTranslations('common')

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-20">
      <div className="max-w-3xl">
        <div className={`rounded-2xl ${heroGlassPanel} p-6 sm:p-8 lg:p-10`}>
          <div className="flex items-start gap-4">
            <Image
              src="/logo.svg"
              alt={`${tCommon('companyName')} logo`}
              width={48}
              height={48}
              className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 mt-1 hidden sm:block"
              priority
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark mb-3">
                {tCommon('companyName')}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-serif font-extrabold text-slate-900 leading-tight tracking-tight">
                {t('title')}{' '}
                <span className="text-primary-dark">{t('titleHighlight')}</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-700 max-w-xl leading-relaxed">
                {t('subtitle')}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <ScheduleButton
              variant="primary"
              size="lg"
              icon
              className="w-full sm:w-auto sm:min-w-[16rem]"
              sublabel={t('responseTime')}
              sublabelClassName="text-slate-600"
            >
              {t('cta')}
            </ScheduleButton>
            <Link
              href="/services/portfolio"
              className="inline-flex items-center justify-center text-sm font-semibold text-primary-dark hover:underline min-h-[44px]"
            >
              {t('exploreDigitalLink')}
              <ArrowRight className="ml-1.5 w-4 h-4" aria-hidden />
            </Link>
          </div>
          <p className="mt-4 text-xs font-medium text-slate-500">{t('proofLine')}</p>
        </div>
      </div>
    </div>
  )
}
