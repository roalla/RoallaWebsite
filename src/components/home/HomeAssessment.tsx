'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ClipboardList, ArrowRight } from 'lucide-react'
import Reveal from '../motion/Reveal'

export default function HomeAssessment() {
  const t = useTranslations('home.assessment')
  return (
    <section id="assessment" className="py-16 lg:py-24 bg-white relative">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
              <ClipboardList className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">{t('title')}</h2>
            <p className="mt-2 text-sm text-primary font-medium">{t('preview')}</p>
            <p className="mt-4 text-slate-600">{t('description')}</p>
            <Link
              href="/assessment"
              className="mt-8 inline-flex items-center bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              {t('cta')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
