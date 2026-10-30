'use client'

import { FormEvent, useEffect, useId, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Circle, Globe2 } from 'lucide-react'
import { Link, useRouter } from '@/i18n/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import type { OutcomeGroupId } from '@/lib/solution-outcome-pages'
import {
  getOutcomeGroupPanelCopy,
  type OutcomeGroupSituation,
} from '@/lib/outcome-group-panels'

type Props = {
  groupId: OutcomeGroupId
  locale: 'en' | 'fr'
  highlighted?: boolean
}

function normalizeWebsite(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export default function OutcomeGroupPanel({ groupId, locale, highlighted = false }: Props) {
  const copy = getOutcomeGroupPanelCopy(groupId, locale)
  const router = useRouter()
  const domainId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const evidenceRef = useRef<HTMLDivElement>(null)
  const [situationId, setSituationId] = useState(copy.situations[0].id)
  const [domain, setDomain] = useState('')
  const [ladderStep, setLadderStep] = useState(0)
  const [channel, setChannel] = useState<string | null>(null)
  const [priority, setPriority] = useState<string | null>(null)
  const [pulse, setPulse] = useState(highlighted)

  const situation: OutcomeGroupSituation = useMemo(
    () => copy.situations.find((item) => item.id === situationId) ?? copy.situations[0],
    [copy.situations, situationId],
  )

  const qualifierReady = Boolean(channel && priority)
  const showWebsiteChecker = groupId === 'growth-visibility' && situation.id === 'findability'
  const ladderCount = copy.ladderSteps.length
  const activeLadder = copy.ladderSteps[ladderStep] ?? copy.ladderSteps[0]
  const ladderBackLabel = locale === 'fr' ? 'Étape précédente' : 'Previous step'
  const ladderNextLabel = locale === 'fr' ? 'Étape suivante' : 'Next step'
  const ladderProgressLabel =
    locale === 'fr'
      ? `Étape ${ladderStep + 1} sur ${ladderCount}`
      : `Step ${ladderStep + 1} of ${ladderCount}`
  const situationSelectHint =
    locale === 'fr' ? 'Choisissez une option pour continuer' : 'Select one to continue'
  const situationSelectedLabel = locale === 'fr' ? 'Sélectionné' : 'Selected'
  const qualifierOptionalHint =
    locale === 'fr'
      ? 'Facultatif—choisissez le canal et la priorité, puis continuez.'
      : 'Optional—pick channel and priority, then continue.'
  const qualifierReadyHint =
    locale === 'fr' ? 'Prêt avec vos réponses' : 'Ready with your answers'
  const howItWorksLabel =
    locale === 'fr' ? 'Comment l’engagement progresse habituellement' : 'How commitment usually grows'
  const typicalCausesLabel = locale === 'fr' ? 'Causes fréquentes' : 'Typical causes'
  const roallaHelpLabel = locale === 'fr' ? 'Comment ROALLA peut aider' : 'How ROALLA can help'
  const selectedChallengeLabel = locale === 'fr' ? 'Défi sélectionné' : 'Selected challenge'
  const nextStepLabel = locale === 'fr' ? 'Prochaine étape recommandée' : 'Recommended next step'
  const seeCtaLabel = locale === 'fr' ? 'Aller aux preuves' : 'Go to evidence'
  const interpretCtaLabel = copy.contactCta
  const improveCtaLabel =
    locale === 'fr' ? 'Voir les détails du parcours' : 'See pathway details'
  const primaryPathway =
    copy.pathwayLinks.find((link) => link.slug === situation.pathwaySlug) ?? copy.pathwayLinks[0]
  const needPage = `/solutions/need/${groupId}`

  function selectLadderStep(index: number) {
    if (index < 0 || index >= ladderCount) return
    setLadderStep(index)
    trackAnalyticsEvent('solutions_tool_click', {
      location: `${groupId}_ladder`,
      step: index + 1,
      label: copy.ladderSteps[index]?.title,
      group: groupId,
    })
  }

  useEffect(() => {
    if (!highlighted) return
    setPulse(true)
    const timer = window.setTimeout(() => setPulse(false), 1800)
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    return () => window.clearTimeout(timer)
  }, [highlighted])

  function campaignQuery(extra?: Record<string, string>) {
    return {
      campaign: `solutions-${groupId}`,
      conversion_source: 'solutions_group_interactive',
      entry_page: needPage,
      signal: situation.id,
      ...extra,
    }
  }

  function selectedProblem(active: OutcomeGroupSituation) {
    return active.id === 'email-deliverability'
      ? 'email-deliverability'
      : 'website-and-ai-visibility'
  }

  function runDomainEvidence(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const url = normalizeWebsite(domain)
    if (!url) return
    trackAnalyticsEvent('solutions_tool_click', {
      location: `${groupId}_inline`,
      tool: 'digital-presence-snapshot',
      group: groupId,
      signal: situation.id,
    })
    router.push({
      pathname: '/tools/digital-presence-snapshot',
      query: {
        ...campaignQuery({
          offer: 'free-automated-visibility-snapshot',
          selected_problem: selectedProblem(situation),
          url,
        }),
      },
    })
  }

  function evidenceHref(active: OutcomeGroupSituation) {
    const path = active.evidencePath
    if (path === '/tools/digital-presence-snapshot') {
      return {
        pathname: path,
        query: campaignQuery({
          offer: 'free-automated-visibility-snapshot',
          selected_problem: selectedProblem(active),
        }),
      } as const
    }
    return {
      pathname: path,
      query: campaignQuery(),
    } as const
  }

  const contactHref = {
    pathname: '/contact' as const,
    query: {
      intent: situation.contactIntent,
      ...(situation.contactFocus ? { focus: situation.contactFocus } : {}),
      outcome: situation.pathwaySlug,
      from_page: needPage,
      signal: situation.id,
      ...(channel ? { channel } : {}),
      ...(priority ? { priority } : {}),
    },
  }

  function scrollToEvidence() {
    evidenceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    trackAnalyticsEvent('solutions_tool_click', {
      location: `${groupId}_ladder_see_cta`,
      group: groupId,
      signal: situation.id,
    })
  }

  return (
    <div
      ref={panelRef}
      className={[
        'mt-6 space-y-6 border border-slate-200 bg-white p-5 sm:p-6',
        pulse ? 'partners-vendor-highlight ring-2 ring-primary/40' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {highlighted ? (
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">{copy.highlightLabel}</p>
      ) : null}

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{copy.resultEyebrow}</p>
        <h3 className="mt-2 font-serif text-2xl font-bold text-slate-950 sm:text-3xl">{copy.resultTitle}</h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{copy.resultBody}</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">{copy.situationPrompt}</p>
        <p className="mt-1 text-xs font-medium text-slate-500">{situationSelectHint}</p>
        <div
          className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4"
          role="group"
          aria-label={copy.situationPrompt}
        >
          {copy.situations.map((item) => {
            const selected = situationId === item.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setSituationId(item.id)
                  setLadderStep(0)
                  trackAnalyticsEvent('outcome_selection', {
                    location: `${groupId}_situation`,
                    outcome: item.pathwaySlug,
                    group: groupId,
                    signal: item.id,
                  })
                }}
                className={
                  selected
                    ? 'cursor-pointer rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-left text-white'
                    : 'cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-slate-950 transition hover:border-primary/50 hover:bg-primary/[0.04]'
                }
              >
                <span className="flex items-start gap-2.5">
                  {selected ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" aria-hidden />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                  )}
                  <span className="min-w-0 flex-1">
                    {selected ? (
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                        {situationSelectedLabel}
                      </span>
                    ) : null}
                    <span
                      className={`block text-sm font-semibold ${selected ? 'text-white' : 'text-slate-950'}`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`mt-1 block text-xs leading-5 ${selected ? 'text-slate-300' : 'text-slate-600'}`}
                    >
                      {item.hint}
                    </span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {situation.typicalCauses?.length && situation.roallaHelp ? (
        <section
          key={situation.id}
          aria-live="polite"
          className="outcome-situation-guidance border border-primary/20 bg-primary/[0.035] px-4 py-5 sm:px-5"
        >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">
            {selectedChallengeLabel}
          </p>
          <h4 className="mt-2 font-serif text-xl font-bold text-slate-950">{situation.label}</h4>
          <p className="mt-1 text-sm leading-6 text-slate-600">{situation.hint}</p>
          <div className="mt-5 grid gap-5 md:grid-cols-2 md:gap-8">
            <div>
              <p className="text-sm font-bold text-slate-950">{typicalCausesLabel}</p>
              <ul className="mt-2 space-y-2">
                {situation.typicalCauses.map((cause) => (
                  <li key={cause} className="flex gap-2 text-sm leading-6 text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" aria-hidden />
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-primary/15 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <p className="text-sm font-bold text-slate-950">{roallaHelpLabel}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{situation.roallaHelp}</p>
            </div>
          </div>
        </section>
      ) : null}

      <div ref={evidenceRef} className="border border-slate-200 bg-slate-950 px-4 py-5 text-white sm:px-5">
        {showWebsiteChecker ? (
          <>
            <form onSubmit={runDomainEvidence} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <label htmlFor={domainId} className="block text-sm font-semibold text-white">
                {copy.domainLabel ?? ''}
                <span className="relative mt-2 block">
                  <Globe2
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden
                  />
                  <input
                    id={domainId}
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    required
                    value={domain}
                    onChange={(event) => setDomain(event.target.value)}
                    placeholder={copy.domainPlaceholder}
                    className="min-h-12 w-full rounded-lg border border-white/20 bg-white py-2.5 pl-10 pr-3 text-sm font-normal text-slate-950 outline-none ring-brand-gold focus:ring-2"
                  />
                </span>
              </label>
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-gold px-5 text-sm font-semibold text-slate-950 transition hover:bg-brand-gold-light"
              >
                {situation.evidenceLabel}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </button>
            </form>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              {situation.evidenceNote ?? copy.evidenceNote}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href={contactHref}
                onClick={() =>
                  trackAnalyticsEvent('outcome_cta_click', {
                    location: `${groupId}_contact`,
                    outcome: situation.pathwaySlug,
                    group: groupId,
                    signal: situation.id,
                  })
                }
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {copy.contactCta}
              </Link>
              {copy.pathwayLinks.map((link) => (
                <Link
                  key={link.slug}
                  href={{ pathname: '/solutions/[slug]', params: { slug: link.slug } }}
                  onClick={() =>
                    trackAnalyticsEvent('solutions_pathway_click', {
                      location: `${groupId}_tertiary`,
                      pathway: link.slug,
                      group: groupId,
                    })
                  }
                  className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-slate-300 underline-offset-4 hover:text-white hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </>
        ) : copy.evidenceMode === 'domain' ? (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-gold">
                  {nextStepLabel}
                </p>
                <p className="mt-1 font-serif text-lg font-bold text-white">{situation.evidenceLabel}</p>
              </div>
              <Link
                href={contactHref}
                onClick={() =>
                  trackAnalyticsEvent('outcome_cta_click', {
                    location: `${groupId}_evidence_contact`,
                    outcome: situation.pathwaySlug,
                    group: groupId,
                    signal: situation.id,
                  })
                }
                className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-brand-gold px-5 text-sm font-semibold text-slate-950 transition hover:bg-brand-gold-light"
              >
                {copy.contactCta}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              {situation.evidenceNote ?? copy.evidenceNote}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {copy.pathwayLinks.map((link) => (
                <Link
                  key={link.slug}
                  href={{ pathname: '/solutions/[slug]', params: { slug: link.slug } }}
                  onClick={() =>
                    trackAnalyticsEvent('solutions_pathway_click', {
                      location: `${groupId}_tertiary`,
                      pathway: link.slug,
                      group: groupId,
                    })
                  }
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-300 underline-offset-4 hover:text-white hover:underline"
                >
                  {link.label}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-gold">
                  {locale === 'fr' ? 'Prochaine étape' : 'Next step'}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{situation.evidenceLabel}</p>
              </div>
              <Link
                href={evidenceHref(situation)}
                onClick={() =>
                  trackAnalyticsEvent('solutions_tool_click', {
                    location: `${groupId}_evidence`,
                    tool: situation.evidencePath,
                    group: groupId,
                    signal: situation.id,
                  })
                }
                className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-brand-gold px-5 text-sm font-semibold text-slate-950 transition hover:bg-brand-gold-light"
              >
                {situation.evidenceLabel}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              {situation.evidenceNote ?? copy.evidenceNote}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href={contactHref}
                onClick={() =>
                  trackAnalyticsEvent('outcome_cta_click', {
                    location: `${groupId}_contact`,
                    outcome: situation.pathwaySlug,
                    group: groupId,
                    signal: situation.id,
                  })
                }
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {copy.contactCta}
              </Link>
              {copy.pathwayLinks.map((link) => (
                <Link
                  key={link.slug}
                  href={{ pathname: '/solutions/[slug]', params: { slug: link.slug } }}
                  onClick={() =>
                    trackAnalyticsEvent('solutions_pathway_click', {
                      location: `${groupId}_tertiary`,
                      pathway: link.slug,
                      group: groupId,
                    })
                  }
                  className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-slate-300 underline-offset-4 hover:text-white hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <details className="group border border-slate-200 open:bg-slate-50/60">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 marker:content-none sm:px-5">
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{copy.ladderEyebrow}</span>
            <span className="mt-1 block font-serif text-lg font-bold text-slate-950">{howItWorksLabel}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-90" aria-hidden />
        </summary>
        <div className="border-t border-slate-200 px-4 py-5 sm:px-5">
          <p className="font-serif text-xl font-bold text-slate-950">{copy.ladderTitle}</p>

          <div className="mt-5" role="group" aria-label={copy.ladderTitle}>
            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-0">
              {copy.ladderSteps.map((step, index) => {
                const active = ladderStep === index
                const complete = index < ladderStep
                return (
                  <li key={step.title} className="relative flex sm:flex-col sm:items-center sm:px-2">
                    {index < ladderCount - 1 ? (
                      <span
                        aria-hidden
                        className={[
                          'pointer-events-none absolute left-[1.15rem] top-10 h-[calc(100%-0.5rem)] w-px sm:left-[calc(50%+1.25rem)] sm:right-[-50%] sm:top-[1.15rem] sm:h-px sm:w-auto',
                          complete || active ? 'bg-primary-dark/50' : 'bg-slate-200',
                        ].join(' ')}
                      />
                    ) : null}
                    <button
                      type="button"
                      aria-current={active ? 'step' : undefined}
                      onClick={() => selectLadderStep(index)}
                      className={[
                        'relative z-[1] flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition sm:flex-col sm:items-center sm:px-3 sm:py-4 sm:text-center',
                        active
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                          : complete
                            ? 'border-primary/30 bg-primary/[0.06] text-slate-950 hover:border-primary/50'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition',
                          active
                            ? 'bg-brand-gold text-slate-950'
                            : complete
                              ? 'bg-primary-dark text-white'
                              : 'bg-slate-100 text-slate-600',
                        ].join(' ')}
                      >
                        {complete && !active ? <Check className="h-4 w-4" aria-hidden /> : index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-sm font-semibold ${active ? 'text-white' : 'text-slate-950'}`}>
                          {step.title}
                        </span>
                        <span
                          className={`mt-0.5 block text-xs font-medium ${active ? 'text-brand-gold' : complete ? 'text-primary-dark' : 'text-slate-500'}`}
                        >
                          {active
                            ? locale === 'fr'
                              ? 'En cours'
                              : 'Current'
                            : complete
                              ? locale === 'fr'
                                ? 'Terminé'
                                : 'Done'
                              : locale === 'fr'
                                ? 'À venir'
                                : 'Up next'}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>

            <div key={ladderStep} className="outcome-ladder-step mt-4 border border-slate-200 bg-white px-4 py-5 sm:px-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">{ladderProgressLabel}</p>
                <p className="font-serif text-lg font-bold text-slate-950">{activeLadder.title}</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{activeLadder.body}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={ladderStep === 0}
                  onClick={() => selectLadderStep(ladderStep - 1)}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-800 transition enabled:hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
                  {ladderBackLabel}
                </button>
                <button
                  type="button"
                  disabled={ladderStep >= ladderCount - 1}
                  onClick={() => selectLadderStep(ladderStep + 1)}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-800 transition enabled:hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {ladderNextLabel}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </button>
                {ladderStep === 0 ? (
                  <button
                    type="button"
                    onClick={scrollToEvidence}
                    className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary-dark px-3.5 text-sm font-semibold text-white transition hover:bg-primary-darker"
                  >
                    {seeCtaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </button>
                ) : null}
                {ladderStep === 1 ? (
                  <Link
                    href={contactHref}
                    onClick={() =>
                      trackAnalyticsEvent('outcome_cta_click', {
                        location: `${groupId}_ladder_interpret`,
                        outcome: situation.pathwaySlug,
                        group: groupId,
                        signal: situation.id,
                      })
                    }
                    className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary-dark px-3.5 text-sm font-semibold text-white transition hover:bg-primary-darker"
                  >
                    {interpretCtaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                ) : null}
                {ladderStep === 2 && primaryPathway ? (
                  <Link
                    href={{ pathname: '/solutions/[slug]', params: { slug: primaryPathway.slug } }}
                    onClick={() =>
                      trackAnalyticsEvent('solutions_pathway_click', {
                        location: `${groupId}_ladder_improve`,
                        pathway: primaryPathway.slug,
                        group: groupId,
                      })
                    }
                    className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary-dark px-3.5 text-sm font-semibold text-white transition hover:bg-primary-darker"
                  >
                    {improveCtaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-6 border border-slate-200 bg-white px-4 py-5 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{copy.vignetteEyebrow}</p>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{copy.vignetteLabel}</p>
            </div>
            <p className="mt-3 font-serif text-lg font-bold text-slate-950 sm:text-xl">{copy.vignetteHeadline}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{copy.vignetteBody}</p>
            <ul className="mt-4 space-y-2">
              {copy.vignetteSteps.map((step) => (
                <li key={step} className="flex gap-2 text-sm leading-6 text-slate-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </details>

      <div className="border border-slate-200 px-4 py-5 sm:px-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{copy.qualifierEyebrow}</p>
        <p className="mt-2 font-serif text-xl font-bold text-slate-950">{copy.qualifierTitle}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{copy.qualifierBody}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">{copy.channelLabel}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {copy.channels.map((item) => {
                const selected = channel === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setChannel(item.id)
                      trackAnalyticsEvent('outcome_selection', {
                        location: `${groupId}_channel`,
                        group: groupId,
                        channel: item.id,
                      })
                    }}
                    className={
                      selected
                        ? 'rounded-full bg-slate-900 px-3.5 py-1.5 text-sm font-semibold text-white'
                        : 'rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700'
                    }
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{copy.priorityLabel}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {copy.priorities.map((item) => {
                const selected = priority === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setPriority(item.id)
                      trackAnalyticsEvent('outcome_selection', {
                        location: `${groupId}_priority`,
                        group: groupId,
                        priority: item.id,
                      })
                    }}
                    className={
                      selected
                        ? 'rounded-full bg-slate-900 px-3.5 py-1.5 text-sm font-semibold text-white'
                        : 'rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700'
                    }
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs font-medium text-slate-500">
          {qualifierReady ? qualifierReadyHint : qualifierOptionalHint}
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link
            href={contactHref}
            onClick={() =>
              trackAnalyticsEvent('outcome_cta_click', {
                location: `${groupId}_qualifier`,
                outcome: situation.pathwaySlug,
                group: groupId,
                channel: channel ?? 'none',
                priority: priority ?? 'none',
              })
            }
            className={[
              'inline-flex min-h-12 w-full items-center justify-center rounded-lg px-5 text-sm font-semibold text-white transition sm:w-auto',
              qualifierReady
                ? 'bg-primary-dark hover:bg-primary-darker'
                : 'bg-slate-800 hover:bg-slate-900',
            ].join(' ')}
          >
            {copy.qualifierCta}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
          <p className="text-xs text-slate-500">{copy.qualifierNote}</p>
        </div>
      </div>
    </div>
  )
}
