'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

type Props = {
  returnPath: string
}

export default function AuthCallbackClient({ returnPath }: Props) {
  const [scriptReady, setScriptReady] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!scriptReady || !window.AppAuth) return

    void (async () => {
      try {
        await window.AppAuth!.init()
        await fetch('/api/auth/sync', { method: 'POST', credentials: 'include' })
        if (window.AppAuth!.isSignedIn()) {
          window.location.href = returnPath.startsWith('/') ? returnPath : `/${returnPath}`
          return
        }
        setError('Sign-in could not be completed. Try again.')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Sign-in failed.')
      }
    })()
  }, [scriptReady, returnPath])

  return (
    <>
      <Script src="/app-auth.js" strategy="afterInteractive" onReady={() => setScriptReady(true)} />
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="rounded-xl border bg-white p-8 shadow-sm max-w-md w-full text-center">
          <h1 className="text-xl font-semibold mb-2">Completing sign-in</h1>
          <p className="text-slate-600 text-sm">{error || 'Finishing authentication…'}</p>
        </div>
      </div>
    </>
  )
}
