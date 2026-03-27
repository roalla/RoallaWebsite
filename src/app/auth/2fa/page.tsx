'use client'

import React, { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Shield, AlertCircle, Loader2 } from 'lucide-react'

function TwoFAForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [codeTouched, setCodeTouched] = useState(false)
  const isCodeValid = /^\d{6}$/.test(code)
  const showCodeError = codeTouched && !isCodeValid

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCodeTouched(true)
    if (!isCodeValid) return
    if (!token) {
      setError('Missing token. Please sign in again.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, code: code.replace(/\s/g, '') }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Verification failed')
        setLoading(false)
        return
      }
      const signInRes = await signIn('credentials', {
        signInToken: data.signInToken,
        callbackUrl,
        redirect: false,
      })
      if (signInRes?.url) {
        window.location.href = signInRes.url
        return
      }
      setError('Sign-in failed. Please try again.')
    } catch {
      setError('Something went wrong.')
    }
    setLoading(false)
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
          <p className="text-gray-600 mb-4">Invalid or expired link. Please sign in again.</p>
          <Link href="/login" className="text-primary font-medium hover:underline">Back to sign in</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold text-gray-900">Two-factor authentication</h1>
        </div>
        <p className="text-sm text-gray-600 mb-4">Enter the 6-digit code from your authenticator app.</p>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-800 text-sm flex items-center gap-2" role="alert" aria-live="polite">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Verification code
          </label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            autoFocus
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            onBlur={() => setCodeTouched(true)}
            aria-invalid={showCodeError}
            aria-describedby={showCodeError ? 'code-error' : undefined}
            className="w-full px-4 py-3 text-center text-lg tracking-widest border border-gray-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
          />
          {showCodeError && (
            <p id="code-error" className="text-sm text-red-600">
              Enter the 6-digit code from your authenticator app.
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !isCodeValid}
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          <Link href="/login" className="text-primary hover:underline">Back to sign in</Link>
        </p>
        <p className="text-center text-xs text-gray-500 mt-2">
          Secure admin access. Authorized users only.
        </p>
        <p className="text-center text-xs text-gray-500 mt-1">
          Need access? Contact{' '}
          <a href="mailto:sales@roalla.com" className="text-primary hover:text-primary-dark font-medium">
            sales@roalla.com
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default function TwoFAPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <TwoFAForm />
    </Suspense>
  )
}
