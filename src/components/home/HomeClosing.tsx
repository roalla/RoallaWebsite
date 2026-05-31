'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'

export default function HomeClosing() {
  const t = useTranslations('home.closing')
  return (
    <section className="py-10 lg:py-12 bg-slate-50 relative border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto">
          <p className="text-slate-600">
            {t('questions')}{' '}
            <Link href="/faq" className="link-action hover:underline">{t('faq')}</Link>
            {' '}{t('or')}{' '}
            <Link href="/contact" className="link-action hover:underline">{t('contact')}</Link>
            {' · '}
            <Link href="/schedule" className="link-action hover:underline">{t('submitInquiry')}</Link>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
