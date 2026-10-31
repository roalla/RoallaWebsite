'use client'

import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'
import {
  mergeCampaignAttribution,
  readAttributionFromSearch,
  type AttributionBag,
} from '@/lib/conversion-attribution'

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

function applyAttribution(href: string, bag: AttributionBag) {
  const target = new URL(href, 'https://www.roalla.com')
  for (const [key, value] of Object.entries(bag)) {
    if (value) target.searchParams.set(key, value.slice(0, 240))
  }
  return `${target.pathname}${target.search}${target.hash}`
}

export default function CampaignReviewCtas({
  campaign,
  offer,
  audience,
  locale,
  primaryHref,
  primaryLabel,
  inquiryHref,
  inquiryLabel,
}: Props) {
  const [primaryTarget, setPrimaryTarget] = useState(primaryHref)
  const [inquiryTarget, setInquiryTarget] = useState(inquiryHref)

  useEffect(() => {
    const inbound = readAttributionFromSearch(window.location.search)
    const defaults: AttributionBag = {
      campaign,
      offer,
      icp: audience,
      conversion_source: 'campaign_page',
      entry_page: window.location.pathname,
      selected_problem: campaign,
    }
    const bag = mergeCampaignAttribution(inbound, defaults)
    setPrimaryTarget(applyAttribution(primaryHref, bag))
    setInquiryTarget(applyAttribution(inquiryHref, bag))
  }, [audience, campaign, inquiryHref, offer, primaryHref])

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={primaryTarget}
        onClick={() => {
          trackAnalyticsEvent('landing_page_cta_click', { campaign, offer, locale, action: 'self_guided' })
          trackAnalyticsEvent('campaign_review_cta', {
            campaign,
            offer,
            audience,
            locale,
            action: 'self_guided',
            conversion_source: 'campaign_page',
          })
        }}
        className="inline-flex min-h-[50px] items-center justify-center rounded-xl bg-brand-gold px-6 py-3 font-bold text-slate-950 transition hover:bg-brand-gold-light"
      >
        {primaryLabel}
        <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
      </a>
      <a
        href={inquiryTarget}
        onClick={() => {
          trackAnalyticsEvent('landing_page_cta_click', { campaign, offer, locale, action: 'inquiry' })
          trackAnalyticsEvent('campaign_review_cta', {
            campaign,
            offer,
            audience,
            locale,
            action: 'inquiry',
            conversion_source: 'campaign_page',
          })
        }}
        className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
      >
        {inquiryLabel}
      </a>
    </div>
  )
}
