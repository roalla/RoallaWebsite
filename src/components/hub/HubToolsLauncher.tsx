'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { useTranslations } from 'next-intl'
import { companyApps } from '@/lib/companyApps'
import { hubCampaignPages, localizedCampaignPath } from '@/lib/hub/campaign-pages'
import { ExternalLink, Languages, Megaphone } from 'lucide-react'

const HUB_TOOL_KEYS: Record<
  (typeof companyApps)[number]['id'],
  { nameKey: string; descKey: string }
> = {
  '4theblueprint': {
    nameKey: 'toolBlueprint',
    descKey: 'toolBlueprintDesc',
  },
  boothlio: {
    nameKey: 'toolBoothlio',
    descKey: 'toolBoothlioDesc',
  },
  'pitch-hotshots': {
    nameKey: 'toolPitchHotshots',
    descKey: 'toolPitchHotshotsDesc',
  },
}

export default function HubToolsLauncher() {
  const t = useTranslations('hub')
  const switcherRef = useRef<HTMLDivElement>(null)
  const [scriptReady, setScriptReady] = useState(false)

  useEffect(() => {
    if (!scriptReady || !switcherRef.current || !window.AppAuth) return
    void window.AppAuth.init().then(() => {
      if (switcherRef.current) {
        void window.AppAuth!.mountAppsSwitcher(switcherRef.current, { label: t('toolsSignedInApps') })
      }
    })
  }, [scriptReady, t])

  return (
    <>
      <Script src="/app-auth.js" strategy="afterInteractive" onReady={() => setScriptReady(true)} />
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">{t('toolsTitle')}</h1>
          <p className="text-slate-600 text-sm mt-1">{t('toolsSubtitle')}</p>
        </header>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">{t('toolsSignedInApps')}</h2>
          <p className="text-sm text-slate-500 mb-3">{t('toolsSignedInAppsHint')}</p>
          <div ref={switcherRef} className="mb-6" />
        </section>

        <section aria-labelledby="campaign-pages-title">
          <div className="mb-4 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Megaphone className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
                {t('campaignPagesEyebrow')}
              </p>
              <h2 id="campaign-pages-title" className="mt-1 text-lg font-semibold text-slate-900">
                {t('campaignPagesTitle')}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{t('campaignPagesHint')}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {hubCampaignPages.map((page) => (
              <article key={page.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <Languages className="mt-0.5 h-5 w-5 shrink-0 text-primary-dark" aria-hidden />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900">{t(page.titleKey)}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{t(page.descKey)}</p>
                    <code className="mt-2 block break-all text-xs text-slate-400">{page.path}</code>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={localizedCampaignPath('en', page.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    {t('campaignOpenEnglish')}
                    <ExternalLink className="ml-2 h-3.5 w-3.5" aria-hidden />
                  </a>
                  <a
                    href={localizedCampaignPath('fr', page.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary-dark"
                  >
                    {t('campaignOpenFrench')}
                    <ExternalLink className="ml-2 h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">{t('toolsAllApps')}</h2>
          <p className="text-sm text-slate-500 mb-4">{t('toolsAllAppsHint')}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {companyApps.map((app) => {
              const keys = HUB_TOOL_KEYS[app.id]
              return (
                <a
                  key={app.id}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 hover:border-amber-300 hover:shadow-sm transition"
                >
                  <div className="flex items-start gap-3">
                    <ExternalLink className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">{t(keys.nameKey)}</p>
                      <p className="text-sm text-slate-600 mt-1">{t(keys.descKey)}</p>
                    </div>
                  </div>
                  <span className="mt-4 text-sm font-medium text-amber-700 group-hover:underline">
                    {t('toolsOpenApp')} →
                  </span>
                </a>
              )
            })}
          </div>
        </section>
      </div>
    </>
  )
}
