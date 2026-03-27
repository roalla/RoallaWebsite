'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)

  const emailTrimmed = email.trim()
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)
  const showEmailError = emailTouched && !isEmailValid

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailTouched(true)
    if (!isEmailValid) return
    setIsLoading(true)
    setMessage('')
    setError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailTrimmed }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        setIsLoading(false)
        return
      }
      setMessage(data.message || 'If that email is registered, we sent a password reset link. Check your inbox and spam folder.')
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[460px]"
      >
        <Link
          href="/login"
          className="inline-flex items-center text-primary hover:text-primary-dark mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to sign in
        </Link>

        <div className="bg-surface-card rounded-2xl shadow-2xl border border-white/15 p-8 sm:p-10">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-white">Forgot password?</h1>
            <p className="text-gray-400 mt-1">Enter your email and we’ll send you a reset link.</p>
          </div>

          {message && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/15 border border-green-400/30 flex items-start gap-3 text-green-100" role="status" aria-live="polite">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{message}</span>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    aria-invalid={showEmailError}
                    aria-describedby={showEmailError ? 'email-error' : undefined}
                    className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg bg-black/50 text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
                    placeholder="name@company.com"
                  />
                </div>
                {showEmailError && (
                  <p id="email-error" className="mt-2 text-sm text-red-300">
                    Enter a valid email address.
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || !isEmailValid}
                className="w-full min-h-[48px] py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
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
        </div>
      </motion.div>
    </div>
  )
}
