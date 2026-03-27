'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Invalid or missing reset link. Request a new one from the forgot password page.</span>
          </div>
          <Link
            href="/login/forgot-password"
            className="mt-6 inline-flex items-center text-primary hover:text-primary-dark font-medium"
          >
            Forgot password
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link
          href="/login"
          className="inline-flex items-center text-primary hover:text-primary-dark mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to sign in
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
            <p className="text-gray-600 mt-1">Enter your new password below.</p>
          </div>

          {message && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-100 flex items-start gap-3 text-green-800" role="status" aria-live="polite">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p>{message}</p>
                <Link href="/login" className="mt-3 inline-block text-green-700 font-medium hover:underline">
                  Sign in →
                </Link>
              </div>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-center gap-3 text-red-800" role="alert" aria-live="polite">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!message && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                    aria-pressed={showNewPassword}
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-sm"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {showNewPasswordError && (
                  <p id="new-password-error" className="mt-2 text-sm text-red-600">
                    Password must be at least 8 characters.
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
                    placeholder="Repeat new password"
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    aria-pressed={showConfirmPassword}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-sm"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {showConfirmPasswordError && (
                  <p id="confirm-password-error" className="mt-2 text-sm text-red-600">
                    Passwords must match.
                  </p>
                )}
                {capsLockOn && !showNewPasswordError && !showConfirmPasswordError && (
                  <p id="caps-lock-hint" className="mt-2 text-sm text-amber-700">
                    Caps Lock appears to be on.
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || !isPasswordLengthValid || !doPasswordsMatch}
                className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link href="/login" className="text-primary hover:text-primary-dark font-medium">
              Back to sign in
            </Link>
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
