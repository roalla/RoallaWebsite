'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Breadcrumb from '@/components/Breadcrumb'
import ConsultationRequestForm, { resolveInitialIntent, resolveInitialFocus } from '@/components/ConsultationRequestForm'

function ScheduleContent() {
  const t = useTranslations('consultationRequest')
  const tBc = useTranslations('breadcrumb')
  const searchParams = useSearchParams()
  const initialIntent = resolveInitialIntent(
    searchParams.get('intent'),
    searchParams.get('service'),
  )
  const initialFocus = resolveInitialFocus(searchParams.get('focus'))

  return (
    <div className="page-shell">
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
        <Breadcrumb items={[{ label: tBc('home'), href: '/' }, { label: tBc('schedule') }]} />
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-slate-900">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-slate-600">{t('subtitle')}</p>
            <p className="mt-3 text-sm text-slate-500">{t('whatToExpect')}</p>
            <p className="mt-3">
              <Link href="/assessment" className="text-primary hover:underline text-sm font-medium">
                {t('assessmentLink')}
              </Link>
            </p>
          </div>
          <ConsultationRequestForm initialIntent={initialIntent} initialFocus={initialFocus} />
        </div>
      </div>
    </div>
  )
}

export default function SchedulePage() {
  return (
    <Suspense fallback={<div className="page-shell min-h-[60vh]" />}>
      <ScheduleContent />
    </Suspense>
  )
}
