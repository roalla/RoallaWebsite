'use client'

import { FormEvent, useEffect, useId, useRef, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Globe2 } from 'lucide-react'
import { Link, useRouter } from '@/i18n/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import {
  growthVisibilityCopy,
  type GrowthVisibilitySituationId,
} from '@/lib/growth-visibility-panel'

type Props = {
  locale: 'en' | 'fr'
  highlighted?: boolean
}

function normalizeWebsite(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export default function GrowthVisibilityPanel({ locale, highlighted = false }: Props) {
  const copy = growthVisibilityCopy[locale]
  const router = useRouter()
  const domainId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const [situation, setSituation] = useState<GrowthVisibilitySituationId | null>(null)
  const [domain, setDomain] = useState('')
  const [ladderOpen, setLadderOpen] = useState(0)
  const [channel, setChannel] = useState<string | null>(null)
  const [priority, setPriority] = useState<string | null>(null)
  const [pulse, setPulse] = useState(highlighted)

  useEffect(() => {
    if (!highlighted) return
    setPulse(true)
    const timer = window.setTimeout(() => setPulse(false), 1800)
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    return () => window.clearTimeout(timer)
  }, [highlighted])

  function snapshotQuery(url?: string) {
    return {
      ...(url ? { url } : {}),
      campaign: 'solutions-growth-visibility',
      offer: 'free-automated-visibility-snapshot',
      conversion_source: 'solutions_group_interactive',
      entry_page: '/solutions#growth-visibility',
      selected_problem: 'website-and-ai-visibility',
      ...(situation ? { signal: situation } : {}),
    }
  }

  function runSnapshot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const url = normalizeWebsite(domain)
    if (!url) return
    trackAnalyticsEvent('solutions_tool_click', {
      location: 'growth_visibility_inline',
      tool: 'digital-presence-snapshot',
      signal: situation ?? 'none',
    })
    router.push({
      pathname: '/tools/digital-presence-snapshot',
      query: snapshotQuery(url),
    })
  }

  const contactHref = {
    pathname: '/contact' as const,
    query: {
      intent: 'visibility',
      outcome: 'visibility',
      from_page: '/solutions#growth-visibility',
      ...(situation ? { signal: situation } : {}),
      ...(channel ? { channel } : {}),
      ...(priority ? { priority } : {}),
    },
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

      {/* 4 — Result first */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{copy.resultEyebrow}</p>
        <h3 className="mt-2 font-serif text-2xl font-bold text-slate-950 sm:text-3xl">{copy.resultTitle}</h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{copy.resultBody}</p>
      </div>

      {/* 2 — Situation picker */}
      <div>
        <p className="text-sm font-semibold text-slate-900">{copy.situationPrompt}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3" role="group" aria-label={copy.situationPrompt}>
          {copy.situations.map((item) => {
            const selected = situation === item.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setSituation(item.id)
                  trackAnalyticsEvent('outcome_selection', {
                    location: 'growth_visibility_situation',
                    outcome: 'visibility',
                    signal: item.id,
                  })
                }}
                className={
                  selected
                    ? 'rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-left text-white'
                    : 'rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-slate-300'
                }
              >
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className={`mt-1 block text-xs leading-5 ${selected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {item.hint}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 1 + 8 — Inline domain + dual CTAs */}
      <div className="border border-slate-200 bg-slate-950 px-4 py-5 text-white sm:px-5">
        <form onSubmit={runSnapshot} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <label htmlFor={domainId} className="block text-sm font-semibold">
            {copy.domainLabel}
            <span className="relative mt-2 block">
              <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
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
            {copy.domainCta}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </button>
        </form>
        <p className="mt-3 text-xs leading-5 text-slate-400">{copy.domainNote}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link
            href={contactHref}
            onClick={() =>
              trackAnalyticsEvent('outcome_cta_click', {
                location: 'growth_visibility_contact',
                outcome: 'visibility',
                signal: situation ?? 'none',
              })
            }
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {copy.contactCta}
          </Link>
          <Link
            href={{ pathname: '/solutions/[slug]', params: { slug: 'visibility' } }}
            onClick={() =>
              trackAnalyticsEvent('solutions_pathway_click', {
                location: 'growth_visibility_tertiary',
                pathway: 'visibility',
              })
            }
            className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-slate-300 underline-offset-4 hover:text-white hover:underline"
          >
            {copy.pathwayLinkLabel}
          </Link>
        </div>
      </div>

      {/* 3 — Value ladder */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{copy.ladderEyebrow}</p>
        <p className="mt-2 font-serif text-xl font-bold text-slate-950">{copy.ladderTitle}</p>
        <ol className="mt-4 space-y-2">
          {copy.ladderSteps.map((step, index) => {
            const open = ladderOpen === index
            return (
              <li key={step.title} className="border border-slate-200">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => {
                    setLadderOpen(index)
                    trackAnalyticsEvent('solutions_tool_click', {
                      location: 'growth_visibility_ladder',
                      step: index + 1,
                      label: step.title,
                    })
                  }}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-semibold text-slate-950">{step.title}</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition ${open ? 'rotate-180' : ''}`} aria-hidden />
                </button>
                {open ? <p className="border-t border-slate-100 px-4 py-3 text-sm leading-6 text-slate-600">{step.body}</p> : null}
              </li>
            )
          })}
        </ol>
      </div>

      {/* 7 — Illustrative vignette */}
      <div className="border border-slate-200 bg-slate-50 px-4 py-5 sm:px-5">
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

      {/* 5 — Qualifier micro-form */}
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
                    onClick={() => setChannel(item.id)}
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
                    onClick={() => setPriority(item.id)}
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

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link
            href={contactHref}
            onClick={() =>
              trackAnalyticsEvent('outcome_cta_click', {
                location: 'growth_visibility_qualifier',
                outcome: 'visibility',
                channel: channel ?? 'none',
                priority: priority ?? 'none',
              })
            }
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-dark px-5 text-sm font-semibold text-white transition hover:bg-primary-darker"
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
