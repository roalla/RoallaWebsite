'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'
import type { ConsultationIntent, ConsultingFocus } from '@/lib/consultation-request'

const ConsultationRequestForm = dynamic(() => import('@/components/ConsultationRequestForm'), {
  ssr: false,
  loading: () => (
    <div
      className="min-h-[28rem] animate-pulse rounded-2xl border border-white/10 bg-white/[0.04] p-6 motion-reduce:animate-none"
      aria-hidden
    >
      <div className="h-5 w-40 rounded bg-white/10" />
      <div className="mt-7 h-28 rounded-xl bg-white/10" />
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="h-14 rounded-xl bg-white/10" />
        <div className="h-14 rounded-xl bg-white/10" />
      </div>
    </div>
  ),
})

type Props = {
  initialIntent: ConsultationIntent
  initialFocus: ConsultingFocus | null
  initialGoal: string
  initialSourcePage: string
  initialOutcome: string
  initialQuickMode: boolean
  loadLabel?: string
}

function readContactHash() {
  if (typeof window === 'undefined') return false
  return window.location.hash.replace(/^#/, '') === 'outcome-contact'
}

function readSignalParam() {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('signal')
}

export default function DeferredOutcomeContactForm({
  loadLabel = 'Start your consultation',
  initialGoal,
  ...props
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [signal, setSignal] = useState<string | null>(null)
  const autoLoadTracked = useRef(false)

  const goal =
    signal && signal.trim()
      ? `${initialGoal} Closest pressure: ${signal.trim()}.`
      : initialGoal

  function markReady(source: 'hash' | 'intersect' | 'click' | 'signal') {
    setReady((wasReady) => {
      if (!wasReady && source !== 'click' && !autoLoadTracked.current) {
        autoLoadTracked.current = true
        trackAnalyticsEvent('outcome_cta_click', {
          location: 'embedded_form_autoload',
          outcome: props.initialOutcome,
          source,
          ...(signal ? { signal } : {}),
        })
      }
      return true
    })
  }

  useEffect(() => {
    const syncSignal = (next: string | null) => {
      if (!next) return
      setSignal(next)
      markReady('signal')
    }

    syncSignal(readSignalParam())

    const onSignalChange = (event: Event) => {
      const detail = (event as CustomEvent<{ signal?: string }>).detail
      if (detail?.signal) syncSignal(detail.signal)
      else syncSignal(readSignalParam())
    }

    window.addEventListener('outcome-signal-change', onSignalChange)
    return () => window.removeEventListener('outcome-signal-change', onSignalChange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (ready) return

    const maybeHashReady = () => {
      if (readContactHash()) {
        const fromUrl = readSignalParam()
        if (fromUrl) setSignal(fromUrl)
        markReady('hash')
      }
    }
    maybeHashReady()
    window.addEventListener('hashchange', maybeHashReady)

    if (!('IntersectionObserver' in window)) {
      markReady('intersect')
      return () => window.removeEventListener('hashchange', maybeHashReady)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        markReady('intersect')
        observer.disconnect()
      },
      { rootMargin: '600px 0px' },
    )
    if (containerRef.current) observer.observe(containerRef.current)

    return () => {
      window.removeEventListener('hashchange', maybeHashReady)
      observer.disconnect()
    }
  }, [ready])

  return (
    <div ref={containerRef} className="min-h-[28rem]">
      {ready ? (
        <ConsultationRequestForm key={goal} {...props} initialGoal={goal} />
      ) : (
        <div className="flex min-h-[28rem] items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] p-6 text-center">
          <button
            type="button"
            onClick={() => markReady('click')}
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary-dark px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-darker focus-visible:ring-2 focus-visible:ring-white"
          >
            {loadLabel}
          </button>
        </div>
      )}
    </div>
  )
}
