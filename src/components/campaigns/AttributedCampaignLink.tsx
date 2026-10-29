'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

export default function AttributedCampaignLink({ href, campaign, offer, action, className, children }: {
  href: string
  campaign: string
  offer: string
  action: string
  className?: string
  children: ReactNode
}) {
  const [target, setTarget] = useState(href)

  useEffect(() => {
    const next = new URL(href, window.location.origin)
    const current = new URLSearchParams(window.location.search)
    next.searchParams.set('entry_page', window.location.pathname)
    UTM_KEYS.forEach((key) => {
      const value = current.get(key)
      if (value) next.searchParams.set(key, value)
    })
    setTarget(`${next.pathname}${next.search}${next.hash}`)
  }, [href])

  return <a href={target} className={className} onClick={() => trackAnalyticsEvent('landing_page_cta_click', { campaign, offer, action })}>{children}</a>
}
