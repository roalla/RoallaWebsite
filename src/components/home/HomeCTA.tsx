'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScheduleButton from '../ScheduleButton'
import Reveal from '../motion/Reveal'

export default function HomeCTA() {
  const t = useTranslations('home.cta')
  return (
    <section className="py-16 lg:py-24 bg-slate-50 relative">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mx-auto text-center rounded-2xl bg-gradient-to-br from-primary-dark via-primary-dark to-primary-darker p-10 lg:p-14 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">{t('title')}</h2>
          <p className="mt-4 text-white/90">{t('subtitle')}</p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <ScheduleButton
              variant="secondary"
              size="lg"
              icon
              block
              className="bg-white text-primary-dark hover:bg-white/90 border-0 w-full sm:w-auto sm:min-w-[18rem]"
              sublabel={t('responseTime')}
              sublabelClassName="text-white/85"
            >
              {t('schedule')}
            </ScheduleButton>
            <p className="text-sm text-white/80 max-w-md">{t('whatHappensNext')}</p>
            <Link
              href="/assessment"
              className="text-white/90 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors"
            >
              {t('orAssessmentShort')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
