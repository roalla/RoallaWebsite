'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [capsLockOn, setCapsLockOn] = useState(false)
  const [newPasswordTouched, setNewPasswordTouched] = useState(false)
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false)

  const isPasswordLengthValid = newPassword.length >= 8
  const doPasswordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword
  const showNewPasswordError = newPasswordTouched && !isPasswordLengthValid
  const showConfirmPasswordError = confirmPasswordTouched && !doPasswordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setNewPasswordTouched(true)
    setConfirmPasswordTouched(true)
    if (!isPasswordLengthValid) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (!doPasswordsMatch) {
      setError('Passwords do not match.')
      return
    }
    if (!token) {
      setError('Invalid reset link. Request a new one from the forgot password page.')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        setIsLoading(false)
        return
      }
      setMessage(data.message || 'Password updated. You can sign in with your new password.')
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setIsLoading(false)
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-5 bg-white/[0.03] border border-white/10 rounded-2xl p-8 sm:p-10">
            <Link href="/" className="inline-flex">
              <Image src="/logo.svg" alt="ROALLA" width={132} height={44} className="h-11 w-auto" priority />
            </Link>
            <h1 className="mt-8 text-3xl sm:text-4xl font-bold tracking-tight text-white">Password Recovery</h1>
            <p className="mt-3 text-base text-gray-300 leading-relaxed">
              Reset your password securely to regain access to your admin workspace.
            </p>
          </section>
          <section className="lg:col-span-7 w-full bg-surface-card rounded-2xl shadow-2xl border border-white/15 p-8">
          <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Invalid or missing reset link. Request a new one from the forgot password page.</span>
          </div>
          <Link
            href="/login/forgot-password"
            className="mt-6 inline-flex items-center text-primary hover:text-primary-dark font-medium"
          >
            Forgot password
          </Link>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-5 bg-white/[0.03] border border-white/10 rounded-2xl p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-flex">
                <Image src="/logo.svg" alt="ROALLA" width={132} height={44} className="h-11 w-auto" priority />
              </Link>
              <h1 className="mt-8 text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Set New Password
              </h1>
              <p className="mt-3 text-base text-gray-300 leading-relaxed">
                Create a strong new password to secure your account and continue to the admin dashboard.
              </p>
            </div>
            <p className="mt-8 rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-300">
              Secure admin access. Authorized users only.
            </p>
          </section>

          <section className="lg:col-span-7 bg-surface-card rounded-2xl shadow-2xl border border-white/15 p-8 sm:p-10">
            <Link
              href="/login"
              className="inline-flex items-center text-primary hover:text-primary-dark mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to sign in
            </Link>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white">Set new password</h2>
              <p className="text-gray-400 mt-1">Enter your new password below.</p>
            </div>

            {message && (
              <div className="mb-6 p-4 rounded-lg bg-green-500/15 border border-green-400/30 flex items-start gap-3 text-green-100" role="status" aria-live="polite">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{message}</p>
                  <Link href="/login" className="mt-3 inline-block text-green-200 font-medium hover:underline">
                    Sign in →
                  </Link>
                </div>
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-3 text-red-200" role="alert" aria-live="polite">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!message && (
              <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  New password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    autoFocus
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onBlur={() => setNewPasswordTouched(true)}
                    onKeyUp={(e) => setCapsLockOn(e.getModifierState('CapsLock'))}
                    onKeyDown={(e) => setCapsLockOn(e.getModifierState('CapsLock'))}
                    aria-invalid={showNewPasswordError}
                    aria-describedby={showNewPasswordError ? 'new-password-error' : capsLockOn ? 'caps-lock-hint' : undefined}
                    className="w-full pl-10 pr-12 py-3 border border-white/20 rounded-lg bg-black/50 text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                    aria-pressed={showNewPassword}
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-sm"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {showNewPasswordError && (
                  <p id="new-password-error" className="mt-2 text-sm text-red-300">
                    Password must be at least 8 characters.
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => setConfirmPasswordTouched(true)}
                    onKeyUp={(e) => setCapsLockOn(e.getModifierState('CapsLock'))}
                    onKeyDown={(e) => setCapsLockOn(e.getModifierState('CapsLock'))}
                    aria-invalid={showConfirmPasswordError}
                    aria-describedby={showConfirmPasswordError ? 'confirm-password-error' : undefined}
                    className="w-full pl-10 pr-12 py-3 border border-white/20 rounded-lg bg-black/50 text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
                    placeholder="Repeat new password"
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    aria-pressed={showConfirmPassword}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-sm"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {showConfirmPasswordError && (
                  <p id="confirm-password-error" className="mt-2 text-sm text-red-300">
                    Passwords must match.
                  </p>
                )}
                {capsLockOn && !showNewPasswordError && !showConfirmPasswordError && (
                  <p id="caps-lock-hint" className="mt-2 text-sm text-amber-300">
                    Caps Lock appears to be on.
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || !isPasswordLengthValid || !doPasswordsMatch}
                className="w-full min-h-[48px] py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isLoading ? 'Updating...' : 'Update password'}
              </button>
              </form>
            )}

            <p className="text-center text-sm text-gray-400 mt-6">
              <Link href="/login" className="text-primary hover:text-primary-dark font-medium">
                Back to sign in
              </Link>
            </p>
            <p className="text-center text-xs text-gray-400 mt-2">
              Secure admin access. Authorized users only.
            </p>
            <p className="text-center text-xs text-gray-400 mt-1">
              Need access? Contact{' '}
              <a href="mailto:sales@roalla.com" className="text-primary hover:text-primary-dark font-medium">
                sales@roalla.com
              </a>
              .
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
