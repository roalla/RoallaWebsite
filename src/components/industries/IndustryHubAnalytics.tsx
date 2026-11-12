'use client'

import { useEffect } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'

export default function IndustryHubAnalytics({ industry }: { industry: string }) {
  useEffect(() => {
    trackAnalyticsEvent('industry_hub_view', { industry })
  }, [industry])

  return null
}
