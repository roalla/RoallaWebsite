'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { attributedServiceTileHref } from '@/lib/service-action-tiles'

export default function VisibilityCtas({
  primaryLabel,
  assessmentLabel,
  source,
}: {
  primaryLabel: string
  assessmentLabel: string
  source: 'hero' | 'final'
}) {
  const reviewHref = attributedServiceTileHref(
    '/website-ai-visibility-review',
    'search-ai-visibility',
    `cta-${source}`,
  )

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
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
