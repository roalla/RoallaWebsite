'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

type Props = {
  returnPath: string
}

async function sessionSignedIn(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/session', { credentials: 'include' })
    if (!res.ok) return false
    const data = (await res.json()) as { signedIn?: boolean }
    return !!data.signedIn
  } catch {
    return false
  }
}

export default function AuthCallbackClient({ returnPath }: Props) {
  const [scriptReady, setScriptReady] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!scriptReady || !window.AppAuth) return

    void (async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const hasCode = params.has('code')

        await window.AppAuth!.init()

        const signedIn = window.AppAuth!.isSignedIn() || (await sessionSignedIn())

        if (signedIn) {
          await fetch('/api/auth/sync', { method: 'POST', credentials: 'include' })
          window.location.href = returnPath.startsWith('/') ? returnPath : `/${returnPath}`
          return
        }

        if (hasCode) {
          setError(
            'Sign-in callback failed. Start again from the login page (do not bookmark this URL). If this keeps happening, confirm https://www.roalla.com/* is in allowed return URLs on sso.roalla.com.',
          )
          return
        }

        setError('Sign-in could not be completed. Try again from the login page.')
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
          {error && (
            <a
              href="/en/hub/login"
              className="inline-block mt-4 text-sm text-amber-700 hover:underline"
            >
              Back to employee sign in
            </a>
          )}
        </div>
      </div>
    </>
  )
}
