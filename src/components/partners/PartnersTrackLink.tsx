'use client'

import { Link } from '@/i18n/navigation'
import { trackAnalyticsEvent, type AnalyticsEventName } from '@/lib/analytics'
import type { ComponentProps } from 'react'

type Props = ComponentProps<typeof Link> & {
  event: AnalyticsEventName
  eventParams?: Record<string, string | number | boolean | undefined>
}

export default function PartnersTrackLink({ event, eventParams, onClick, ...props }: Props) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackAnalyticsEvent(event, eventParams)
        onClick?.(e)
      }}
    />
  )
}
