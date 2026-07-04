'use client'

import React, { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { useTranslations } from 'next-intl'
import { companyApps } from '@/lib/companyApps'
import { ExternalLink } from 'lucide-react'

export default function HubToolsLauncher() {
  const t = useTranslations('hub')
  const th = useTranslations('home')
  const switcherRef = useRef<HTMLDivElement>(null)
  const [scriptReady, setScriptReady] = useState(false)

  useEffect(() => {
    if (!scriptReady || !switcherRef.current || !window.AppAuth) return
    void window.AppAuth.init().then(() => {
      if (switcherRef.current) {
        void window.AppAuth!.mountAppsSwitcher(switcherRef.current, { label: t('roallaApps') })
      }
    })
  }, [scriptReady, t])

  return (
    <>
      <Script src="/app-auth.js" strategy="afterInteractive" onReady={() => setScriptReady(true)} />
      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('roallaApps')}</h2>
          <div ref={switcherRef} className="mb-4" />
          <div className="grid gap-4 sm:grid-cols-2">
            {companyApps.map((app) => (
              <a
                key={app.id}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-amber-300 hover:shadow-sm transition"
              >
                <ExternalLink className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">{th(app.nameKey)}</p>
                  <p className="text-sm text-slate-500">{app.domain}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
