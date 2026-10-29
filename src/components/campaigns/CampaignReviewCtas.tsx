'use client'

import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'

type Props = {
  campaign: string
  offer: string
  audience: string
  locale: string
  primaryHref: string
  primaryLabel: string
  inquiryHref: string
  inquiryLabel: string
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

function addAttribution(href: string, campaign: string, offer: string, audience: string) {
  if (typeof window === 'undefined') return href
  const target = new URL(href, window.location.origin)
  const current = new URLSearchParams(window.location.search)
  target.searchParams.set('campaign', campaign)
  target.searchParams.set('offer', offer)
  target.searchParams.set('icp', audience)
  target.searchParams.set('conversion_source', 'campaign_page')
  target.searchParams.set('entry_page', window.location.pathname)
  target.searchParams.set('selected_problem', campaign)
  UTM_KEYS.forEach((key) => {
    const value = current.get(key)
    if (value) target.searchParams.set(key, value)
  })
  return `${target.pathname}${target.search}${target.hash}`
}

export default function CampaignReviewCtas({ campaign, offer, audience, locale, primaryHref, primaryLabel, inquiryHref, inquiryLabel }: Props) {
  const [primaryTarget, setPrimaryTarget] = useState(primaryHref)
  const [inquiryTarget, setInquiryTarget] = useState(inquiryHref)

  useEffect(() => {
    setPrimaryTarget(addAttribution(primaryHref, campaign, offer, audience))
    setInquiryTarget(addAttribution(inquiryHref, campaign, offer, audience))
  }, [audience, campaign, inquiryHref, offer, primaryHref])

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={primaryTarget}
        onClick={() => {
          trackAnalyticsEvent('landing_page_cta_click', { campaign, offer, locale, action: 'self_guided' })
          trackAnalyticsEvent('campaign_review_cta', { campaign, offer, audience, locale, action: 'self_guided', conversion_source: 'campaign_page' })
        }}
        className="inline-flex min-h-[50px] items-center justify-center rounded-xl bg-brand-gold px-6 py-3 font-bold text-slate-950 transition hover:bg-brand-gold-light"
      >
        {primaryLabel}<ArrowRight className="ml-2 h-5 w-5" aria-hidden />
      </a>
      <a
        href={inquiryTarget}
        onClick={() => {
          trackAnalyticsEvent('landing_page_cta_click', { campaign, offer, locale, action: 'inquiry' })
          trackAnalyticsEvent('campaign_review_cta', { campaign, offer, audience, locale, action: 'inquiry', conversion_source: 'campaign_page' })
        }}
        className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
      >
        {inquiryLabel}
      </a>
    </div>
  )
}
