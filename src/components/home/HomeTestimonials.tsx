'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'

const outcomeKeys = ['t1', 't2', 't3'] as const

export default function HomeTestimonials() {
  const t = useTranslations('home.testimonials')

  return (
    <section className="py-14 lg:py-20 bg-white relative">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{t('eyebrow')}</p>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-slate-600">{t('description')}</p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {outcomeKeys.map((key) => (
            <blockquote
              key={key}
              className="home-tile flex flex-col rounded-2xl bg-gradient-to-br from-slate-50 to-white p-6 lg:p-8"
            >
              <p className="flex-1 text-sm leading-relaxed text-slate-700">
                <span className="text-primary text-lg font-serif leading-none mr-1" aria-hidden>
                  “
                </span>
                {t(`${key}Quote`)}
              </p>
              <footer className="mt-6 pt-5 border-t border-slate-200">
                <p className="text-sm font-semibold text-slate-900">{t(`${key}Name`)}</p>
                <p className="mt-0.5 text-xs text-slate-600">{t(`${key}Role`)}</p>
                <p className="mt-1 text-xs text-primary-dark font-medium">{t(`${key}Project`)}</p>
              </footer>
            </blockquote>
          ))}
        </div>

        <Reveal className="text-center mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
          <Link href="/services/portfolio" className="inline-flex items-center link-action hover:underline text-sm font-semibold">
            {t('viewPortfolio')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
          <Link href="/contact" className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-primary-dark hover:underline">
            {t('scheduleLink')}
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
