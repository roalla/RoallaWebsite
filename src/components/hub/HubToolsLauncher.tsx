'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { useTranslations } from 'next-intl'
import { companyApps } from '@/lib/companyApps'
import { ExternalLink } from 'lucide-react'

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
