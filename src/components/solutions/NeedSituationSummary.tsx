'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import Reveal from '@/components/motion/Reveal'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { getOutcomeGroupPanelCopy, type OutcomeGroupSituation } from '@/lib/outcome-group-panels'
import type { OutcomeGroupId } from '@/lib/solution-outcome-pages'

type Props = {
  groupId: OutcomeGroupId
  locale: 'en' | 'fr'
}

const chrome = {
  title: { en: 'Practical starting points', fr: 'Points de départ pratiques' },
  description: {
    en: 'Pick the first evidence step that matches your pressure—no need to restate the problem.',
    fr: 'Choisissez la première étape de preuve qui correspond à votre pression—sans reformuler le problème.',
  },
} as const

function selectedProblem(active: OutcomeGroupSituation) {
  if (active.id === 'email-deliverability') return 'email-deliverability'
  if (active.id === 'findability' || active.id === 'ai-answers') return 'website-and-ai-visibility'
  return active.id
}

function evidenceHref(groupId: OutcomeGroupId, situation: OutcomeGroupSituation) {
  const needPage = `/solutions/need/${groupId}`
  const baseQuery: Record<string, string> = {
    campaign: `solutions-${groupId}`,
    conversion_source: 'solutions_need_starting_points',
    entry_page: needPage,
    signal: situation.id,
    selected_problem: selectedProblem(situation),
  }

  if (situation.evidencePath === '/tools/digital-presence-snapshot') {
    return {
      pathname: situation.evidencePath,
      query: {
        ...baseQuery,
        offer: 'free-automated-visibility-snapshot',
      },
    } as const
  }

  if (situation.evidencePath === '/tools/communications-value-brief') {
    const briefExtra: Record<string, string> = {}
    if (situation.id === 'phone-ip-uc') briefExtra.situation = 'pots-legacy'
    if (situation.id === 'communications') briefExtra.scope = 'cc'
    return {
      pathname: situation.evidencePath,
      query: { ...baseQuery, ...briefExtra },
    } as const
  }

  return {
    pathname: situation.evidencePath,
    query: baseQuery,
  } as const
}

/** Action-tile index of situation next steps—does not restate hero/panel problem copy. */
export default function NeedSituationSummary({ groupId, locale }: Props) {
  const copy = getOutcomeGroupPanelCopy(groupId, locale)

  return (
    <section
      className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-14"
      aria-labelledby="need-situations-summary"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal className="max-w-3xl">
          <h2 id="need-situations-summary" className="font-serif text-2xl font-bold text-slate-950 sm:text-3xl">
            {chrome.title[locale]}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{chrome.description[locale]}</p>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {copy.situations.map((situation, index) => (
            <Reveal
              key={situation.id}
              delayMs={index * 40}
              className="h-full"
            >
              <article className="home-tile group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
                {situation.image ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={situation.image.src}
                      alt={situation.image.alt}
                      fill
                      unoptimized
                      decoding="async"
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 320px"
                      className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent"
                      aria-hidden
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-lg font-bold text-slate-950">{situation.label}</h3>
                  {situation.evidenceNote ? (
                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{situation.evidenceNote}</p>
                  ) : (
                    <div className="flex-1" />
                  )}
                  <Link
                    href={evidenceHref(groupId, situation)}
                    onClick={() =>
                      trackAnalyticsEvent('solutions_tool_click', {
                        location: `solutions_need_${groupId}_starting_points`,
                        tool: situation.evidencePath,
                        group: groupId,
                        signal: situation.id,
                      })
                    }
                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-gold px-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-brand-gold-light"
                  >
                    {situation.evidenceLabel}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
