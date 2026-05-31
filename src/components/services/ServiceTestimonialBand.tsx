'use client'

import React from 'react'
import { Quote } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Reveal from '../motion/Reveal'

const testimonialKeys = ['t1', 't2'] as const

export default function ServiceTestimonialBand() {
  const t = useTranslations('home.testimonials')

  return (
    <Reveal className="mt-16 pt-12 border-t-2 border-slate-200">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">{t('eyebrow')}</p>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">{t('title')}</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {testimonialKeys.map((key) => (
          <div
            key={key}
            className="flex flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 lg:p-8 shadow-card"
          >
            <Quote className="w-8 h-8 text-primary/30 mb-4 shrink-0" aria-hidden />
            <blockquote className="flex-1 text-slate-700 leading-relaxed text-sm">
              &ldquo;{t(`${key}Quote`)}&rdquo;
            </blockquote>
            <footer className="mt-6 pt-5 border-t border-slate-200">
              <p className="text-sm font-semibold text-slate-900">{t(`${key}Role`)}</p>
              <p className="mt-0.5 text-xs text-primary-dark font-medium">{t(`${key}Project`)}</p>
            </footer>
          </div>
        ))}
      </div>
    </Reveal>
  )
}
