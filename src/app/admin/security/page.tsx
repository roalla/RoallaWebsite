'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, AlertCircle } from 'lucide-react'
import Image from 'next/image'

export default function AdminSecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean | null>(null)
  const [setup, setSetup] = useState<{ secret: string; otpauth: string } | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/2fa/status')
      .then((r) => r.json())
      .then((data) => setTwoFactorEnabled(data.enabled === true))
      .catch(() => setTwoFactorEnabled(false))
  }, [])

  const startSetup = async () => {
    setMessage(null)
    setSetup(null)
    setQrDataUrl(null)
    try {
      const res = await fetch('/api/auth/2fa/setup')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSetup({ secret: data.secret, otpauth: data.otpauth })
      const QRCode = (await import('qrcode')).default
      const url = await QRCode.toDataURL(data.otpauth, { width: 200, margin: 2 })
      setQrDataUrl(url)
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Failed to load setup' })
    }
  }

  const enable2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!setup) return
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: setup.secret, code: code.replace(/\s/g, '') }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessage({ type: 'success', text: 'Two-factor authentication is now enabled.' })
      setTwoFactorEnabled(true)
      setSetup(null)
      setCode('')
      setQrDataUrl(null)
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Failed to enable 2FA' })
    } finally {
      setLoading(false)
    }
  }

  if (twoFactorEnabled === null) {
    return (
      <div>
        <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block">← Dashboard</Link>
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">← Dashboard</Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Security</h1>
      <p className="text-gray-600 mb-6">Manage two-factor authentication for your admin account.</p>

      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.type === 'error' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {message.text}
        </div>
      )}

      {twoFactorEnabled ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md">
          <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
            <Shield className="w-5 h-5" />
            2FA is enabled
          </div>
          <p className="text-sm text-gray-600">Your account is protected with two-factor authentication. You will be asked for a code when signing in.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md">
          <h2 className="font-semibold text-gray-900 mb-2">Enable two-factor authentication</h2>
          <p className="text-sm text-gray-600 mb-4">Scan the QR code with an authenticator app (e.g. Google Authenticator, Authy) and enter the code to verify.</p>
          {!setup ? (
            <button
              type="button"
              onClick={startSetup}
              className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark"
            >
              Enable 2FA
            </button>
          ) : (
            <form onSubmit={enable2FA} className="space-y-4">
              {qrDataUrl && (
                <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                  <Image src={qrDataUrl} alt="QR code" width={200} height={200} unoptimized />
                </div>
              )}
              <p className="text-xs text-gray-500">Or enter this secret manually: <code className="bg-gray-100 px-1 rounded break-all">{setup.secret}</code></p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="000000"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setSetup(null); setQrDataUrl(null); setCode('') }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify and enable'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
