'use client'

import { ArrowRight } from 'lucide-react'
import { trackAnalyticsEvent } from '@/lib/analytics'

type Props = {
  campaign: string
  locale: string
  primaryHref: string
  primaryLabel: string
  inquiryHref: string
  inquiryLabel: string
}

export default function CampaignReviewCtas({ campaign, locale, primaryHref, primaryLabel, inquiryHref, inquiryLabel }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={primaryHref}
        onClick={() => trackAnalyticsEvent('campaign_review_cta', { campaign, locale, action: 'self_guided' })}
        className="inline-flex min-h-[50px] items-center justify-center rounded-xl bg-brand-gold px-6 py-3 font-bold text-slate-950 transition hover:bg-brand-gold-light"
      >
        {primaryLabel}<ArrowRight className="ml-2 h-5 w-5" aria-hidden />
      </a>
      <a
        href={inquiryHref}
        onClick={() => trackAnalyticsEvent('campaign_review_cta', { campaign, locale, action: 'inquiry' })}
        className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
      >
        {inquiryLabel}
      </a>
    </div>
  )
}
