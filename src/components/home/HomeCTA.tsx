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
              className="bg-white text-primary-dark hover:bg-white/90 border-0 w-full sm:w-auto"
            >
              {t('schedule')}
            </ScheduleButton>
            <p className="text-sm text-white/80">{t('responseTime')}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <ScheduleButton
                intent="consulting"
                variant="secondary"
                size="md"
                className="bg-transparent text-white border-white/80 hover:bg-white/10 w-full sm:w-auto"
              >
                {t('discussNeeds')}
              </ScheduleButton>
              <ScheduleButton
                intent="website"
                variant="secondary"
                size="md"
                className="bg-transparent text-white border-white/80 hover:bg-white/10 w-full sm:w-auto"
              >
                {t('discussBuild')}
              </ScheduleButton>
            </div>
          </div>
          <p className="mt-5">
            <Link
              href="/assessment"
              className="text-white/90 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors"
            >
              {t('orAssessmentShort')}
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
