'use client'

import React, { Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { CheckCircle2 } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import ConsultationRequestForm, { resolveInitialIntent, resolveInitialFocus } from '@/components/ConsultationRequestForm'
import { getPortfolioItem, isValidPortfolioReference } from '@/lib/digitalPortfolio'
import type { PortfolioItemId } from '@/lib/digitalPortfolio'

const PORTFOLIO_NAME_KEYS = {
  t1: 't1Name',
  t3: 't3Name',
  t4: 't4Name',
  t5: 't5Name',
  t6: 't6Name',
  t7: 't7Name',
  t8: 't8Name',
  t9: 't9Name',
  t10: 't10Name',
  t11: 't11Name',
} as const

function resolvePortfolioReferenceGoal(
  reference: string | null,
  tConsult: ReturnType<typeof useTranslations<'consultationRequest'>>,
  tPortfolio: ReturnType<typeof useTranslations<'digitalCreations'>>,
): { goal: string | null; referenceId: string | null } {
  if (!reference || !isValidPortfolioReference(reference)) {
    return { goal: null, referenceId: null }
  }

  if (reference === 'fleet') {
    return {
      goal: tConsult('portfolioReferenceGoal', { project: tPortfolio('verticalFleetTitle') }),
      referenceId: reference,
    }
  }

  const item = getPortfolioItem(reference as PortfolioItemId)
  if (!item) return { goal: null, referenceId: null }

  const nameKey = PORTFOLIO_NAME_KEYS[item.i18nPrefix]
  return {
    goal: tConsult('portfolioReferenceGoal', { project: tPortfolio(nameKey) }),
    referenceId: reference,
  }
}

function ScheduleContent() {
  const t = useTranslations('consultationRequest')
  const tPortfolio = useTranslations('digitalCreations')
  const tBc = useTranslations('breadcrumb')
  const searchParams = useSearchParams()
  const referenceParam = searchParams.get('reference')
  const initialIntent = resolveInitialIntent(
    searchParams.get('intent'),
    searchParams.get('service'),
  )
  const initialFocus = resolveInitialFocus(searchParams.get('focus'))
  const fromAssessment = searchParams.get('from') === 'assessment'

  const { goal: referenceGoal, referenceId } = useMemo(
    () => resolvePortfolioReferenceGoal(referenceParam, t, tPortfolio),
    [referenceParam, t, tPortfolio],
  )

  const initialGoal = referenceGoal ?? searchParams.get('goal')

  const whatYouGetItems = [t('whatYouGet1'), t('whatYouGet2'), t('whatYouGet3'), t('whatYouGet4')]

  return (
    <div className="page-shell">
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
        <Breadcrumb items={[{ label: tBc('home'), href: '/' }, { label: tBc('schedule') }]} />
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 lg:mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-slate-900">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-slate-600">{t('subtitle')}</p>
            <p className="mt-3 text-sm text-slate-500">{t('whatToExpect')}</p>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 mb-8 lg:hidden">
            <p className="text-sm font-semibold text-slate-900 mb-3">{t('whatYouGetTitle')}</p>
            <ul className="space-y-2">
              {whatYouGetItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid lg:grid-cols-[1fr_280px] gap-8 lg:gap-10 items-start">
            <ConsultationRequestForm
              initialIntent={initialIntent}
              initialFocus={initialFocus}
              initialGoal={initialGoal}
              initialReference={referenceId}
              fromAssessment={fromAssessment}
            />
            <aside className="hidden lg:block rounded-2xl border border-slate-200 bg-slate-50 p-6 sticky top-28">
              <p className="text-sm font-semibold text-slate-900 mb-4">{t('whatYouGetTitle')}</p>
              <ul className="space-y-3">
                {whatYouGetItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700 leading-snug">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <p className="mt-8 text-center">
            <Link href="/assessment" className="text-primary hover:underline text-sm font-medium">
              {t('assessmentLink')}
            </Link>
          </p>
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
