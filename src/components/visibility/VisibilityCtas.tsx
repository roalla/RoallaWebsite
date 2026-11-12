'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { attributedServiceTileHref } from '@/lib/service-action-tiles'

export default function VisibilityCtas({
  primaryLabel,
  assessmentLabel,
  estimateLabel,
  source,
}: {
  primaryLabel: string
  assessmentLabel: string
  estimateLabel: string
  source: 'hero' | 'final'
}) {
  const reviewHref = attributedServiceTileHref(
    '/website-ai-visibility-review',
    'search-ai-visibility',
    `cta-${source}`,
  )
  const estimateHref = {
    pathname: '/visibility-improvement-estimate' as const,
    query: {
      campaign: 'services-search-ai-visibility',
      conversion_source: `visibility_service_${source}`,
      entry_page: '/services/search-ai-visibility',
      signal: 'visibility-estimate',
    },
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Link
        href={reviewHref}
        onClick={() =>
          trackAnalyticsEvent('visibility_assessment_click', {
            placement: source,
            assessment: 'website-ai-visibility-review',
          })
        }
        className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand-gold px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-brand-gold-light"
      >
        {assessmentLabel}
        <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
      </Link>
      <Link
        href={estimateHref}
        onClick={() =>
          trackAnalyticsEvent('visibility_estimate_click', {
            placement: source,
            tool: 'visibility-improvement-estimate',
          })
        }
        className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-brand-gold/70 bg-brand-gold/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-gold/20"
      >
        {estimateLabel}
        <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
      </Link>
      <Link
        href={{
          pathname: '/contact',
          query: { intent: 'visibility', source: `visibility-${source}` },
        }}
        onClick={() =>
          trackAnalyticsEvent('visibility_service_inquiry', {
            placement: source,
          })
        }
        className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
      >
        {primaryLabel}
      </Link>
    </div>
  )
}
