'use client'

import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { pathwayEvidenceCtas } from '@/lib/pathway-evidence-cta'
import type { OutcomeGroupId } from '@/lib/solution-outcome-pages'
import type { SolutionPathId } from '@/lib/solutions-by-need'
import OutcomeGroupPanel from '@/components/solutions/OutcomeGroupPanel'
import AutomationAiNeedExtras from '@/components/solutions/AutomationAiNeedExtras'
import NeedSituationSummary from '@/components/solutions/NeedSituationSummary'

type Props = {
  groupId: OutcomeGroupId
  locale: 'en' | 'fr'
  title: string
  description: string
  browseLabel: string
  assessmentLabel: string
  assessmentDescription: string
  assessmentCta: string
}

const GROUP_PRIMARY_PATHWAY: Record<OutcomeGroupId, SolutionPathId> = {
  'growth-visibility': 'visibility',
  'experience-products': 'digital-experience',
  'automation-ai': 'automation-ai',
  'security-compliance': 'security',
  execution: 'strategy',
}

export default function OutcomeGroupNeedPage({
  groupId,
  locale,
  title,
  description,
  browseLabel,
  assessmentLabel,
  assessmentDescription,
  assessmentCta,
}: Props) {
  const eyebrow = locale === 'fr' ? 'Parcours par résultat' : 'Outcome pathway'
  const backLabel = locale === 'fr' ? 'Tous les parcours de résultats' : 'All outcome pathways'
  const talkLabel = locale === 'fr' ? 'Discuter de ce résultat' : 'Talk through this outcome'
  const needPage = `/solutions/need/${groupId}`
  const primaryPathway = GROUP_PRIMARY_PATHWAY[groupId]
  const evidenceCta = pathwayEvidenceCtas[primaryPathway]
  const evidenceHref = evidenceCta
    ? {
        pathname: evidenceCta.pathname,
        query: {
          campaign: `solutions-${groupId}`,
          conversion_source: 'solutions_need_hero',
          entry_page: needPage,
          signal: groupId,
          ...(evidenceCta.offer ? { offer: evidenceCta.offer } : {}),
          ...(evidenceCta.selectedProblem ? { selected_problem: evidenceCta.selectedProblem } : {}),
        },
      }
    : null
  const contactHref = {
    pathname: '/contact' as const,
    query: {
      campaign: `solutions-${groupId}`,
      conversion_source: 'solutions_need_hero',
      entry_page: needPage,
      signal: groupId,
      outcome: primaryPathway,
    },
  }

  return (
    <div className="page-shell bg-white">
      <section
        data-header-tone="dark"
        className="relative isolate overflow-hidden bg-slate-950 px-4 pb-16 pt-32 text-white sm:px-6 lg:px-8 lg:pb-20 lg:pt-36"
      >
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl">
          <Link
            href="/solutions"
            className="inline-flex min-h-[44px] items-center text-sm font-semibold text-slate-300 underline-offset-4 hover:text-white hover:underline"
          >
            {backLabel}
          </Link>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-primary-light">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl">{description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {evidenceHref && evidenceCta ? (
              <Link
                href={evidenceHref}
                onClick={() =>
                  trackAnalyticsEvent('solutions_tool_click', {
                    location: `solutions_need_${groupId}_hero`,
                    tool: evidenceCta.pathname,
                    group: groupId,
                  })
                }
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-gold px-5 text-sm font-semibold text-slate-950 transition hover:bg-brand-gold-light"
              >
                {evidenceCta.label[locale]}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            ) : null}
            <Link
              href={contactHref}
              onClick={() =>
                trackAnalyticsEvent('outcome_cta_click', {
                  location: `solutions_need_${groupId}_hero`,
                  outcome: primaryPathway,
                  group: groupId,
                })
              }
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {talkLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <OutcomeGroupPanel groupId={groupId} locale={locale} highlighted expandCommitment />
          {groupId === 'automation-ai' ? <AutomationAiNeedExtras locale={locale} /> : null}
        </div>
      </section>

      <NeedSituationSummary groupId={groupId} locale={locale} />

      <section className="border-t border-slate-200 bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{browseLabel}</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{assessmentDescription}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href="/solutions"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
            >
              {backLabel}
            </Link>
            <Link
              href={{
                pathname: '/assessment',
                query: {
                  campaign: `solutions-${groupId}`,
                  conversion_source: 'solutions_need_footer',
                  entry_page: needPage,
                  signal: groupId,
                },
              }}
              onClick={() =>
                trackAnalyticsEvent('solutions_assessment_click', {
                  location: `solutions_need_${groupId}`,
                })
              }
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-dark px-5 text-sm font-semibold text-white transition hover:bg-primary-darker"
            >
              {assessmentCta}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-5xl text-xs text-slate-500">{assessmentLabel}</p>
      </section>
    </div>
  )
}
