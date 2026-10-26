'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { trackAnalyticsEvent, type AnalyticsEventName } from '@/lib/analytics'
import type { ConsultationIntent, ConsultingFocus } from '@/lib/consultation-request'

type StickyMobileCTAProps = {
  label: string
  href?:
    | '/contact'
    | '/services/business-advisory'
    | '/services/technology-advisory'
    | '/programs/workshops'
    | '/services/digital'
    | '/services/portfolio'
    | '/assessment'
    | '/tools/technology-decision-brief'
  anchorHref?: string
  intent?: ConsultationIntent
  focus?: ConsultingFocus
  service?: 'websites-brand' | 'custom-platforms'
  need?: string
  reference?: string
  offer?: string
  sublabel?: string
  brandMark?: boolean
  analyticsEvent?: AnalyticsEventName
  analyticsParams?: Record<string, string | number | boolean | undefined>
}

export default function StickyMobileCTA({
  label,
  href = '/contact',
  anchorHref,
  intent,
  focus,
  service,
  need,
  reference,
  offer,
  sublabel,
  brandMark = false,
  analyticsEvent,
  analyticsParams,
}: StickyMobileCTAProps) {
  const linkHref = (() => {
    const query: Record<string, string> = {}
    if (intent) query.intent = intent
    if (focus) query.focus = focus
    if (service) query.service = service
    if (need) query.need = need
    if (reference) query.reference = reference
    if (offer) query.offer = offer
    if (Object.keys(query).length > 0) {
      return { pathname: '/contact', query } as const
    }
    return href
  })()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame: number | null = null
    let current = false

    const readScroll = () => {
      frame = null
      const next = window.scrollY > 480
      if (next === current) return
      current = next
      setVisible(next)
    }

    const onScroll = () => {
      if (frame !== null) return
      frame = window.requestAnimationFrame(readScroll)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [])

  if (!visible) return null

  const buttonClass =
    'flex w-full flex-col items-center justify-center rounded-lg bg-primary-dark hover:bg-primary-darker text-white font-semibold py-3 px-6 text-sm shadow-md transition-colors'

  const onTrack = () => {
    if (analyticsEvent) trackAnalyticsEvent(analyticsEvent, analyticsParams)
  }

  const labelBlock = (
    <>
      <span className="inline-flex items-center gap-2">
        {brandMark ? <Image src="/logo.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" /> : null}
        {label}
      </span>
      {sublabel ? <span className="mt-0.5 text-[11px] font-normal text-white">{sublabel}</span> : null}
    </>
  )

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-30 xl:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(15,23,42,0.12)]"
      role="region"
      aria-label={label}
    >
      {anchorHref ? (
        <a href={anchorHref} className={buttonClass} onClick={onTrack}>
          {labelBlock}
        </a>
      ) : (
        <Link href={linkHref} className={buttonClass} onClick={onTrack}>
          {labelBlock}
        </Link>
      )}
    </div>
  )
}
