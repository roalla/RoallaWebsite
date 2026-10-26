'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'

type MeResponse = {
  userId?: string
  email?: string
  name?: string
}

export default function PartnersHubContinue() {
  const t = useTranslations('partnersPlatforms')
  const [user, setUser] = useState<MeResponse | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/me', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) return null
        return (await res.json()) as MeResponse
      })
      .then((data) => {
        if (!cancelled && data?.userId) setUser(data)
      })
      .catch(() => {
        /* public page — ignore */
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!user?.userId) return null

  return (
    <aside className="border border-primary/30 bg-primary/[0.06] px-5 py-5 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{t('hubContinueEyebrow')}</p>
      <p className="mt-2 text-sm leading-6 text-slate-800">
        {t('hubContinueBody', { name: user.name || user.email || 'ROALLA' })}
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href={{ pathname: '/contact', query: { intent: 'consulting', focus: 'technology', reference: 'hub-ecosystem' } }}
          onClick={() => trackAnalyticsEvent('partners_hero_cta', { slot: 'hub_continue_contact' })}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-slate-950 hover:bg-primary-light"
        >
          {t('hubContinueContact')}
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
        </Link>
        <Link
          href="/tools/technology-decision-brief"
          onClick={() => trackAnalyticsEvent('partners_hero_cta', { slot: 'hub_continue_brief' })}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:border-slate-400"
        >
          {t('hubContinueBrief')}
        </Link>
        <Link
          href="/hub"
          onClick={() => trackAnalyticsEvent('partners_hero_cta', { slot: 'hub_continue_hub' })}
          className="inline-flex min-h-11 items-center justify-center px-2 text-sm font-semibold text-primary-dark underline-offset-4 hover:underline"
        >
          {t('hubContinueHub')}
        </Link>
      </div>
    </aside>
  )
}
