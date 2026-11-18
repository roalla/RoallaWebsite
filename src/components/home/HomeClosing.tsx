'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import StickyMobileCTA from '../StickyMobileCTA'

export default function HomeClosing() {
  const t = useTranslations('home.closing')
  const tCommon = useTranslations('common')
  return (
    <>
      <section className="border-t border-slate-200 bg-white py-8 lg:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mx-auto max-w-2xl text-center text-sm text-slate-600">
            {t('questions')}{' '}
            <Link href="/faq" className="font-medium text-primary-dark hover:underline">
              {t('faq')}
            </Link>{' '}
            {t('or')}{' '}
            <Link href="/contact" className="font-medium text-primary-dark hover:underline">
              {t('contact')}
            </Link>
          </p>
        </div>
      </section>
      <StickyMobileCTA
        href="/contact"
        label={tCommon('scheduleConsultationDigital')}
        sublabel={tCommon('ctaSubtext')}
      />
    </>
  )
}
