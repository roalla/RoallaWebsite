'use client'

import { useEffect, useState } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'
import type { SolutionPathId } from '@/lib/solutions-by-need'

type Props = {
  pathwayId: SolutionPathId
  signals: readonly string[]
  matchEyebrow: string
  matchTitle: string
  matchHint: string
}

export default function OutcomeSignalMatch({
  pathwayId,
  signals,
  matchEyebrow,
  matchTitle,
  matchHint,
}: Props) {
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const fromUrl = new URLSearchParams(window.location.search).get('signal')
    if (fromUrl && signals.includes(fromUrl)) setSelectedSignal(fromUrl)
  }, [signals])

  function selectSignal(signal: string) {
    setSelectedSignal(signal)
    trackAnalyticsEvent('outcome_selection', {
      location: 'outcome_signal_match',
      outcome: pathwayId,
      signal,
    })
    trackAnalyticsEvent('outcome_cta_click', {
      location: 'outcome_signal_match',
      outcome: pathwayId,
      signal,
    })

    const url = new URL(window.location.href)
    url.searchParams.set('signal', signal)
    url.hash = 'outcome-contact'
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    window.dispatchEvent(new CustomEvent('outcome-signal-change', { detail: { signal } }))

    window.requestAnimationFrame(() => {
      document.getElementById('outcome-contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <section
      className="border-b border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8"
      aria-labelledby="outcome-match-title"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{matchEyebrow}</p>
        <h2 id="outcome-match-title" className="mt-2 font-serif text-2xl font-bold text-slate-950 sm:text-3xl">
          {matchTitle}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{matchHint}</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap" role="group" aria-label={matchTitle}>
          {signals.map((signal) => {
            const selected = selectedSignal === signal
            return (
              <button
                key={signal}
                type="button"
                aria-pressed={selected}
                onClick={() => selectSignal(signal)}
                className={
                  selected
                    ? 'rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-left text-sm font-semibold text-white'
                    : 'rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-950 transition hover:border-primary/50 hover:bg-primary/[0.04]'
                }
              >
                {signal}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
