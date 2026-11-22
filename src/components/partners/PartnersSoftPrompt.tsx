'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const STORAGE_KEY = 'roalla-partners-soft-prompt'

type Props = {
  title: string
  body: string
  ctaLabel: string
  dismissLabel: string
}

export default function PartnersSoftPrompt({ title, body, ctaLabel, dismissLabel }: Props) {
  const [open, setOpen] = useState(false)
  const [entered, setEntered] = useState(false)
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return
    } catch {
      /* ignore */
    }

    let shown = false
    const show = (reason: string) => {
      if (shown) return
      shown = true
      setOpen(true)
      trackAnalyticsEvent('partners_soft_prompt', { action: 'show', reason })
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {
        /* ignore */
      }
    }

    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      if (max <= 0) return
      if (window.scrollY / max >= 0.42) show('mid_scroll')
    }

    const onMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 0) show('exit_intent')
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    if (reduceMotion) {
      setEntered(true)
      return
    }
    const id = window.requestAnimationFrame(() => setEntered(true))
    return () => window.cancelAnimationFrame(id)
  }, [open, reduceMotion])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-label={title}
      className={`fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-md border border-slate-200 bg-white p-4 shadow-lg sm:bottom-6 sm:left-auto sm:right-6 motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out ${
        entered
          ? 'translate-y-0 opacity-100'
          : 'translate-y-3 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'
      }`}
    >
      <div
        className={`mb-3 h-px origin-left bg-gradient-to-r from-brand-gold via-brand-gold/70 to-transparent motion-safe:transition-transform motion-safe:duration-700 ${
          entered ? 'scale-x-100' : 'scale-x-40 motion-reduce:scale-x-100'
        }`}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-lg font-bold text-slate-950">{title}</p>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">{body}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            trackAnalyticsEvent('partners_soft_prompt', { action: 'dismiss' })
          }}
          className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          aria-label={dismissLabel}
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <Link
        href={{ pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } }}
        onClick={() => trackAnalyticsEvent('partners_soft_prompt', { action: 'cta' })}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-slate-950 transition hover:bg-primary-light"
      >
        {ctaLabel}
      </Link>
    </div>
  )
}
