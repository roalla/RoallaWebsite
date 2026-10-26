'use client'

import { useState } from 'react'
import { Mail, Printer } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { trackAnalyticsEvent } from '@/lib/analytics'

type Props = {
  pagePath: string
  pageTitle: string
}

export default function PartnersPageActions({ pagePath, pageTitle }: Props) {
  const t = useTranslations('partnersPlatforms')
  const [copied, setCopied] = useState(false)

  const shareUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : pagePath

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button
        type="button"
        onClick={() => {
          trackAnalyticsEvent('partners_hero_cta', { path: pagePath, slot: 'print' })
          window.print()
        }}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300"
      >
        <Printer className="h-4 w-4" aria-hidden />
        {t('actionPrint')}
      </button>
      <a
        href={`mailto:?subject=${encodeURIComponent(pageTitle)}&body=${encodeURIComponent(`${pageTitle}\n${shareUrl}`)}`}
        onClick={() => trackAnalyticsEvent('partners_hero_cta', { path: pagePath, slot: 'email' })}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300"
      >
        <Mail className="h-4 w-4" aria-hidden />
        {t('actionEmail')}
      </a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            trackAnalyticsEvent('partners_hero_cta', { path: pagePath, slot: 'copy_link' })
            window.setTimeout(() => setCopied(false), 2000)
          } catch {
            /* ignore */
          }
        }}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300"
      >
        {copied ? t('actionCopied') : t('actionCopy')}
      </button>
    </div>
  )
}
