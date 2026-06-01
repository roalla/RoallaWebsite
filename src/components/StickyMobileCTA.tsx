'use client'

import React, { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import type { ConsultationIntent } from '@/lib/consultation-request'

type StickyMobileCTAProps = {
  label: string
  href?: '/schedule' | '/services' | '/services/workshops' | '/services/digital' | '/digital-creations' | '/assessment'
  intent?: ConsultationIntent
  sublabel?: string
}

export default function StickyMobileCTA({ label, href = '/schedule', intent, sublabel }: StickyMobileCTAProps) {
  const linkHref = intent
    ? ({ pathname: '/schedule', query: { intent } } as const)
    : href
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-30 lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(15,23,42,0.12)]"
      role="region"
      aria-label={label}
    >
      <Link
        href={linkHref}
        className="flex w-full flex-col items-center justify-center rounded-lg bg-primary-dark hover:bg-primary-darker text-white font-semibold py-3 px-6 text-sm shadow-md transition-colors"
      >
        <span>{label}</span>
        {sublabel && <span className="mt-0.5 text-[11px] font-normal text-white/85">{sublabel}</span>}
      </Link>
    </div>
  )
}
