'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import {
  parseHubEmailAuthPayload,
  type HubEmailAuthResponse,
} from '@/lib/roalla-auth/hub-email-auth-parse'
import {
  pkceChallengeFromVerifier,
  randomPkceVerifier,
  storePkceVerifier,
} from '@/lib/roalla-auth/pkce-client'

type Props = {
  callbackUrl: string
  returnPath: string
  authHubUrl?: string
  authClientId?: string
  verified?: boolean
  hubAdminEmail?: string
}

async function readJson(res: Response): Promise<Record<string, unknown>> {
  return (await res.json().catch(() => ({}))) as Record<string, unknown>
}

export default function HubLoginForm({
  callbackUrl,
  returnPath,
  authHubUrl = '',
  authClientId = '',
  verified = false,
  hubAdminEmail = '',
}: Props) {
  const [scriptReady, setScriptReady] = useState(false)
  const [hubReady, setHubReady] = useState(false)
  const [clientId, setClientId] = useState(authClientId)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [mfaOpen, setMfaOpen] = useState(false)
  const [mfaToken, setMfaToken] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [verifyMessage, setVerifyMessage] = useState('')

  useEffect(() => {
    if (authClientId) setClientId(authClientId)
    else {
      fetch('/api/config')
        .then((r) => (r.ok ? r.json() : null))
        .then((cfg: { authClientId?: string } | null) => {
          if (cfg?.authClientId) setClientId(cfg.authClientId)
        })
        .catch(() => {})
    }
  }, [authClientId])

  useEffect(() => {
    if (!scriptReady || !window.AppAuth) return
    void (async () => {
      await window.AppAuth!.init()
      setHubReady(window.AppAuth?.isAuthConfigured() ?? false)
      const sessionRes = await fetch('/api/auth/session', { credentials: 'include' })
      const session = (await sessionRes.json()) as { signedIn?: boolean }
      if (session.signedIn) {
        window.location.href = returnPath.startsWith('/') ? returnPath : `/${returnPath}`
      }
    })()
  }, [scriptReady, returnPath])

  async function preparePkce() {
    const id = clientId.trim()
    if (!id) {
      setError('Sign-in is not configured.')
      return null
    }
    const verifier = randomPkceVerifier()
    const challenge = await pkceChallengeFromVerifier(verifier)
    storePkceVerifier(id, verifier)
    return { challenge, clientId: id }
  }

  function handleAuthResult(result: HubEmailAuthResponse) {
    if (result.kind === 'redirect') {
      window.location.assign(result.redirect)
      return
    }
    if (result.kind === 'mfa') {
      setMfaToken(result.mfaToken)
      setMfaOpen(true)
      return
    }
    if (result.kind === 'verify') {
      setVerifyMessage(result.message)
      setVerifyOpen(true)
      return
    }
    setError(result.message)
  }

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setPending(true)
    try {
      const pkce = await preparePkce()
      if (!pkce) return
      const res = await fetch('/api/auth/email-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          return_path: returnPath,
          code_challenge: pkce.challenge,
        }),
      })
      handleAuthResult(parseHubEmailAuthPayload(res.status, await readJson(res)))
    } finally {
      setPending(false)
    }
  }

  async function onMfaSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    try {
      const res = await fetch('/api/auth/email-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mfa_token: mfaToken, code: mfaCode }),
      })
      handleAuthResult(parseHubEmailAuthPayload(res.status, await readJson(res)))
    } finally {
      setPending(false)
    }
  }

  async function onSsoRedirect() {
    await window.AppAuth?.startAuthorize(callbackUrl)
  }

  const forgotHref =
    authHubUrl && clientId
      ? `${authHubUrl}/forgot-password.html?client_id=${encodeURIComponent(clientId)}`
      : null

  return (
    <>
      <Script src="/app-auth.js" strategy="afterInteractive" onReady={() => setScriptReady(true)} />

      <div className="mx-auto max-w-md w-full">
        {verified && (
          <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
            Email verified. You can sign in now.
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Employee sign in</h1>
          <p className="text-slate-600 text-sm mb-6">Roalla Internal Hub — for employees and invited partners only.</p>

          {hubReady && (
            <button
              type="button"
              onClick={() => onSsoRedirect()}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 mb-6"
            >
              Continue with Roalla SSO
            </button>
          )}

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-500">or email</span>
            </div>
          </div>

          <form onSubmit={onEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={pending || !hubReady}
              className="w-full rounded-lg bg-slate-900 text-white py-2.5 text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
            >
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {forgotHref && (
            <p className="mt-4 text-center text-sm">
              <a href={forgotHref} className="text-amber-700 hover:underline">
                Forgot password?
              </a>
            </p>
          )}
          {hubAdminEmail && (
            <p className="mt-4 text-center text-xs text-slate-500">
              Need access? Contact{' '}
              <a href={`mailto:${hubAdminEmail}`} className="text-amber-700 hover:underline">
                {hubAdminEmail}
              </a>
            </p>
          )}
        </div>
      </div>

      {mfaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={onMfaSubmit}
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl space-y-4"
          >
            <h2 className="font-semibold text-lg">Two-factor authentication</h2>
            <input
              type="text"
              inputMode="numeric"
              placeholder="6-digit code"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => setMfaOpen(false)} className="flex-1 py-2 border rounded-lg">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2 bg-slate-900 text-white rounded-lg">
                Verify
              </button>
            </div>
          </form>
        </div>
      )}

      {verifyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h2 className="font-semibold text-lg mb-2">Verify your email</h2>
            <p className="text-sm text-slate-600 mb-4">{verifyMessage}</p>
            <button type="button" onClick={() => setVerifyOpen(false)} className="w-full py-2 border rounded-lg">
              OK
            </button>
          </div>
        </div>
      )}
    </>
  )
}
