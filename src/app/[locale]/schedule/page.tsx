'use client'

import React, { Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { CheckCircle2 } from 'lucide-react'
import ConsultationRequestForm, {
  resolveInitialAiGoal,
  resolveInitialAutomationGoal,
  resolveInitialEventGoal,
  resolveInitialFocus,
  resolveInitialIntent,
  resolveInitialPlatformType,
  resolveInitialWebsiteGoal,
  resolveInitialWorkshopTopic,
} from '@/components/ConsultationRequestForm'
import { isDigitalIntent } from '@/lib/consultation-request'
import { getPortfolioItem, getPortfolioIndustryCategory, isValidPortfolioReference } from '@/lib/digitalPortfolio'
import type { PortfolioIndustryCategoryId, PortfolioItemId } from '@/lib/digitalPortfolio'

const PORTFOLIO_NAME_KEYS = {
  t1: 't1Name',
  t4: 't4Name',
  t5: 't5Name',
  t6: 't6Name',
  t7: 't7Name',
  t8: 't8Name',
  t9: 't9Name',
  t10: 't10Name',
  t11: 't11Name',
  t12: 't12Name',
  t13: 't13Name',
  t14: 't14Name',
  t15: 't15Name',
  t16: 't16Name',
} as const

function resolvePortfolioReference(
  reference: string | null,
  tConsult: ReturnType<typeof useTranslations<'consultationRequest'>>,
  tPortfolio: ReturnType<typeof useTranslations<'digitalCreations'>>,
): {
  goal: string | null
  referenceId: string | null
  referenceLabel: string | null
  referenceImage: string | null
} {
  if (!reference || !isValidPortfolioReference(reference)) {
    return { goal: null, referenceId: null, referenceLabel: null, referenceImage: null }
  }

  if (reference === 'fleet' || reference === 'fleet-logistics') {
    const project = tPortfolio('industryFleetTitle')
    return {
      goal: tConsult('portfolioReferenceGoal', { project }),
      referenceId: reference,
      referenceLabel: project,
      referenceImage: null,
    }
  }

  const industry = getPortfolioIndustryCategory(reference as PortfolioIndustryCategoryId)
  if (industry) {
    const titleKey = `${industry.i18nPrefix}Title` as 'industryFleetTitle'
    const project = tPortfolio(titleKey)
    return {
      goal: tConsult('portfolioReferenceGoal', { project }),
      referenceId: reference,
      referenceLabel: project,
      referenceImage: null,
    }
  }

  const item = getPortfolioItem(reference as PortfolioItemId)
  if (!item) return { goal: null, referenceId: null, referenceLabel: null, referenceImage: null }

  const nameKey = PORTFOLIO_NAME_KEYS[item.i18nPrefix]
  const project = tPortfolio(nameKey)
  return {
    goal: tConsult('portfolioReferenceGoal', { project }),
    referenceId: reference,
    referenceLabel: project,
    referenceImage: item.imageUrl,
  }
}

function ScheduleContent() {
  const t = useTranslations('consultationRequest')
  const tPortfolio = useTranslations('digitalCreations')
  const searchParams = useSearchParams()
  const needParam = searchParams.get('need')
  const referenceParam = searchParams.get('reference')
  const offerParam = searchParams.get('offer')
  const fromFoundingOffer = offerParam === 'founding'
  const tFounding = useTranslations('foundingClient')
  const initialIntent =
    resolveInitialIntent(
      searchParams.get('intent'),
      searchParams.get('service'),
      needParam,
    ) ?? (fromFoundingOffer ? 'website' : null)
  const initialFocus = resolveInitialFocus(searchParams.get('focus'))
  const initialWebsiteGoal =
    resolveInitialWebsiteGoal(needParam) ?? (fromFoundingOffer ? 'new' : null)
  const initialPlatformType = resolveInitialPlatformType(needParam)
  const initialAutomationGoal = resolveInitialAutomationGoal(needParam)
  const initialAiGoal = resolveInitialAiGoal(needParam)
  const initialEventGoal = resolveInitialEventGoal(needParam)
  const initialWorkshopTopic = resolveInitialWorkshopTopic(needParam, searchParams.get('topic'))
  const fromAssessment = searchParams.get('from') === 'assessment'
  const initialSourcePage = searchParams.get('from_page')

  const { goal: referenceGoal, referenceId, referenceLabel, referenceImage } = useMemo(
    () => resolvePortfolioReference(referenceParam, t, tPortfolio),
    [referenceParam, t, tPortfolio],
  )

  const initialGoal = referenceGoal ?? (fromFoundingOffer ? tFounding('schedulePrefillGoal') : searchParams.get('goal'))

  const isDigital = isDigitalIntent(initialIntent)
  const whatYouGetItems = isDigital
    ? [t('whatYouGetDigital1'), t('whatYouGetDigital2'), t('whatYouGetDigital3'), t('whatYouGetDigital4')]
    : [t('whatYouGet1'), t('whatYouGet2'), t('whatYouGet3'), t('whatYouGet4')]

  const subtitle = isDigital ? t('subtitleDigital') : t('subtitle')

  return (
    <div className="page-shell">
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 lg:mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-slate-900">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-slate-600">{subtitle}</p>
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
              initialReferenceLabel={referenceLabel}
              initialReferenceImage={referenceImage}
              initialWebsiteGoal={initialWebsiteGoal}
              initialPlatformType={initialPlatformType}
              initialAutomationGoal={initialAutomationGoal}
              initialAiGoal={initialAiGoal}
              initialEventGoal={initialEventGoal}
              initialWorkshopTopic={initialWorkshopTopic}
              initialSourcePage={initialSourcePage}
              fromAssessment={fromAssessment}
              fromFoundingOffer={fromFoundingOffer}
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
