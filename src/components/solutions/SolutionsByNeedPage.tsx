'use client'

import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, Check, ChevronDown } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { outcomeGroups, type OutcomeGroupId } from '@/lib/solution-outcome-pages'
import type { SolutionsByNeedContent } from '@/lib/solutions-by-need'
import OutcomeGroupPanel from '@/components/solutions/OutcomeGroupPanel'

export default function SolutionsByNeedPage({
  content,
  locale,
}: {
  content: SolutionsByNeedContent
  locale: 'en' | 'fr'
}) {
  const groups = outcomeGroups[locale]
  const stepOne = locale === 'fr' ? 'Étape 1 · Choisissez le type de changement' : 'Step 1 · Choose the kind of change'
  const stepTwo =
    locale === 'fr'
      ? 'Étape 2 · Cadrez le résultat, puis commencez par des preuves'
      : 'Step 2 · Frame the outcome, then start with evidence'
  const openLabel = (count: number) =>
    locale === 'fr'
      ? `Voir ${count} ${count === 1 ? 'parcours' : 'parcours'}`
      : `See ${count} ${count === 1 ? 'path' : 'paths'}`

  const [openId, setOpenId] = useState<string>(groups[0]?.id ?? 'growth-visibility')
  const [hashHighlight, setHashHighlight] = useState<OutcomeGroupId | null>(null)

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (!hash) return
      const matched = groups.find((group) => group.id === hash)
      if (matched) {
        setOpenId(matched.id)
        setHashHighlight(matched.id)
        const el = document.getElementById(hash)
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [groups])

  return (
    <div className="page-shell bg-white">
      <section data-header-tone="dark" className="relative overflow-hidden bg-slate-950 px-4 pb-20 pt-32 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-light">{content.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">{content.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl">{content.intro}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#outcome-finder" className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand-gold px-6 py-3 font-semibold text-slate-950 transition hover:bg-brand-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              {content.heroSecondary}
              <ArrowDown className="ml-2 h-4 w-4" aria-hidden />
            </a>
            <Link
              href="/assessment"
              onClick={() => trackAnalyticsEvent('solutions_assessment_click', { location: 'solutions_hero' })}
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {content.heroPrimary}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section id="outcome-finder" aria-labelledby="finder-title" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{stepOne}</p>
          <h2 id="finder-title" className="mt-3 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">
            {content.pathwaysTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{content.pathwaysDescription}</p>

          <div className="mt-10 space-y-4">
            {groups.map((group) => {
              const pathways = group.pathwayIds
                .map((id) => content.pathways.find((pathway) => pathway.id === id))
                .filter((pathway): pathway is NonNullable<typeof pathway> => Boolean(pathway))
              const isOpen = openId === group.id

              return (
                <details
                  id={group.id}
                  key={group.id}
                  open={isOpen}
                  onToggle={(event) => {
                    const nextOpen = event.currentTarget.open
                    if (nextOpen) setOpenId(group.id)
                    else if (openId === group.id) setOpenId('')
                  }}
                  className="group scroll-mt-28 rounded-2xl border border-slate-200 bg-slate-50 shadow-sm open:border-primary/30 open:bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 rounded-2xl p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-7">
                    <span>
                      <span className="block font-serif text-2xl font-bold text-slate-950">{group.title}</span>
                      <span className="mt-2 block max-w-3xl leading-7 text-slate-600">{group.description}</span>
                      <span className="mt-3 block text-sm font-semibold text-primary-dark">{openLabel(pathways.length)}</span>
                    </span>
                    <ChevronDown className="h-6 w-6 shrink-0 text-primary-dark transition group-open:rotate-180" aria-hidden />
                  </summary>
                  <div className="border-t border-slate-200 px-6 pb-7 pt-6 sm:px-7">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{stepTwo}</p>
                    <OutcomeGroupPanel
                      groupId={group.id}
                      locale={locale}
                      highlighted={hashHighlight === group.id}
                    />
                  </div>
                </details>
              )
            })}
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-primary/25 bg-primary/[0.05] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Check className="mt-1 h-5 w-5 shrink-0 text-primary-dark" aria-hidden />
              <p className="max-w-3xl font-medium leading-7 text-slate-800">{content.assessmentPrompt}</p>
            </div>
            <Link
              href="/assessment"
              onClick={() => trackAnalyticsEvent('solutions_assessment_click', { location: 'guided_discovery' })}
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-lg bg-primary-dark px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {content.heroPrimary}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-light">{content.closingEyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-white">{content.closingTitle}</h2>
            <p className="mt-4 leading-7 text-slate-200">{content.closingDescription}</p>
          </div>
          <Link
            href="/assessment"
            onClick={() => trackAnalyticsEvent('solutions_assessment_click', { location: 'solutions_closing' })}
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            {content.heroPrimary}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  )
}
