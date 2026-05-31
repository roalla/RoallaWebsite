'use client'

import React from 'react'
import { Quote } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScheduleButton from '../ScheduleButton'
import Reveal from '../motion/Reveal'

const testimonialKeys = ['t1', 't2'] as const

export default function HomeTestimonials() {
  const t = useTranslations('home.testimonials')
  const tCommon = useTranslations('common')

  return (
    <section className="py-14 lg:py-20 bg-white relative">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{t('eyebrow')}</p>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-slate-600">{t('description')}</p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonialKeys.map((key) => (
            <div
              key={key}
              className="flex flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 lg:p-8 shadow-card"
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4 shrink-0" aria-hidden />
              <blockquote className="flex-1 text-slate-700 leading-relaxed">
                &ldquo;{t(`${key}Quote`)}&rdquo;
              </blockquote>
              <footer className="mt-6 pt-5 border-t border-slate-200">
                <p className="text-sm font-semibold text-slate-900">{t(`${key}Role`)}</p>
                <p className="mt-0.5 text-xs text-primary-dark font-medium">{t(`${key}Project`)}</p>
              </footer>
            </div>
          ))}
        </div>

        <Reveal className="text-center mt-10 flex flex-col items-center gap-4">
          <ScheduleButton
            variant="primary"
            size="md"
            icon
            sublabel={tCommon('ctaSubtext')}
            sublabelClassName="text-slate-500"
          >
            {t('discussProject')}
          </ScheduleButton>
          <Link href="/digital-creations" className="inline-flex items-center link-action hover:underline text-sm font-semibold">
            {t('viewPortfolio')}
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
