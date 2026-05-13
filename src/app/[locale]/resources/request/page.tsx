'use client'

import React, { useState, useEffect, useRef } from 'react'
import Script from 'next/script'
import { signIn, getProviders, useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Mail, Lock, CheckCircle, AlertCircle, ArrowLeft, Shield, LogIn, User, Building2, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { Link as IntlLink } from '@/i18n/navigation'
import { REQUEST_REASON_OPTIONS } from '@/lib/request-reasons'

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

const oauthProviderIds = ['google', 'azure-ad', 'apple', 'sso'] as const
const oauthLabels: Record<string, string> = {
  google: 'Google',
  'azure-ad': 'Microsoft',
  apple: 'Apple',
  sso: 'Single Sign-On',
}
const requestTypeLabels: Record<string, string> = {
  'advisory-board-match': 'Advisory Board Match',
  'digital-creations': 'Digital Creations',
  general: 'General Resource Centre Access',
}
const reasonLabelMap = Object.fromEntries(
  REQUEST_REASON_OPTIONS.map((option) => [option.value, option.label])
) as Record<string, string>

export default function RequestAccessPage() {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [oauthProviders, setOauthProviders] = useState<Record<string, { id: string; name: string }>>({})
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [formLoadedAt, setFormLoadedAt] = useState<number | null>(null)
  const guestFormRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    getProviders().then((p) => {
      if (!p) return
      const next: Record<string, { id: string; name: string }> = {}
      oauthProviderIds.forEach((id) => {
        if (p[id]) next[id] = { id, name: (p[id] as { name?: string }).name || oauthLabels[id] || id }
      })
      setOauthProviders(next)
    })
  }, [])

  useEffect(() => {
    if (showEmailForm && formLoadedAt === null) {
      setFormLoadedAt(Date.now())
    }
    if (!showEmailForm) {
      setFormLoadedAt(null)
    }
  }, [showEmailForm, formLoadedAt])

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
    requestReason: '',
    accessCode: '',
    reason: '',
    _honeypot: '', // Bot trap - must stay empty
  })
  const selectedRequestReason = REQUEST_REASON_OPTIONS.find((option) => option.value === formData.requestReason)
  const reasonNeedsCode = !!selectedRequestReason?.requiresCode

  useEffect(() => {
    if (session?.user?.name && status === 'authenticated') {
      setFormData((prev) => ({ ...prev, name: session.user?.name || prev.name }))
    }
  }, [session?.user?.name, status])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusSubmit, setStatusSubmit] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const isAuthenticated = status === 'authenticated' && session
  const requestTypeParam = (searchParams.get('type') || '').trim().toLowerCase()
  const selectedRequestType = requestTypeLabels[requestTypeParam] ? requestTypeParam : 'general'
  const selectedRequestTypeLabel = requestTypeLabels[selectedRequestType]
  const callbackUrl = `/${locale}/resources/request?type=${encodeURIComponent(selectedRequestType)}`

  const handleSubmitAuthenticated = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatusSubmit('idle')
    setMessage('')
    try {
      const res = await fetch('/api/resources/request-access/authenticated', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          company: formData.company.trim() || undefined,
          requestReason: formData.requestReason,
          accessCode: formData.accessCode.trim() || undefined,
          reason: formData.reason.trim() || undefined,
          requestType: selectedRequestType,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatusSubmit('success')
        setMessage('Your request has been received. Our team will review it and send access instructions by email within one business day.')
        setFormData((prev) => ({ ...prev, accessCode: '' }))
      } else {
        setStatusSubmit('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatusSubmit('error')
      setMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitUnauthenticated = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatusSubmit('idle')
    setMessage('')
    try {
      const turnstileEl = guestFormRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>('[name="cf-turnstile-response"]')
      const turnstileToken = turnstileEl?.value?.trim() || undefined
      const { _honeypot, ...rest } = formData
      const payload = {
        ...rest,
        requestReason: formData.requestReason,
        accessCode: formData.accessCode.trim() || undefined,
        requestType: selectedRequestType,
        _honeypot,
        _formLoadedAt: formLoadedAt ?? undefined,
        _turnstileToken: turnstileToken,
      }
      const response = await fetch('/api/resources/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (response.ok) {
        setStatusSubmit('success')
        setMessage('Your request has been received. Our team will review it and send access instructions by email within one business day.')
        setFormData({ email: '', name: '', company: '', requestReason: '', accessCode: '', reason: '', _honeypot: '' })
      } else {
        setStatusSubmit('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatusSubmit('error')
      setMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-20">
        <div className="text-center text-gray-300">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading access request form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <IntlLink
            href="/resources"
            className="inline-flex items-center text-primary hover:text-primary-dark mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Resource Centre
          </IntlLink>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-white mb-4">
              Request Resource Centre Access
            </h1>
            <p className="text-xl text-gray-300">
              Request secure access to curated guides, templates, tools, and advisory resources.
            </p>
            <p className="mt-4 inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              Request type: {selectedRequestTypeLabel}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-surface-card rounded-2xl shadow-xl border border-white/10 p-8 md:p-12"
          >
            {statusSubmit === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Request Received</h2>
                <p className="text-gray-300 mb-6">{message}</p>
                <IntlLink
                  href="/"
                  className="inline-flex items-center bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Return to Home
                </IntlLink>
              </div>
            ) : isAuthenticated ? (
              <form onSubmit={handleSubmitAuthenticated} className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-300">
                    Complete your details to finalize your access request.
                  </p>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      readOnly
                      value={session?.user?.email ?? ''}
                      className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg bg-black/50 text-gray-300"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">This is the account you signed in with.</p>
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">Full Name <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-white mb-2">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your Company"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="requestReason" className="block text-sm font-semibold text-white mb-2">Reason for request <span className="text-red-400">*</span></label>
                  <select
                    id="requestReason"
                    required
                    value={formData.requestReason}
                    onChange={(e) => setFormData({ ...formData, requestReason: e.target.value, accessCode: '' })}
                    className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a reason</option>
                    {REQUEST_REASON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {reasonNeedsCode && (
                  <div>
                    <label htmlFor="accessCode" className="block text-sm font-semibold text-white mb-2">Access code <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      id="accessCode"
                      required
                      value={formData.accessCode}
                      onChange={(e) => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter the code you were given"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="reason" className="block text-sm font-semibold text-white mb-2">Additional details (optional)</label>
                  <textarea
                    id="reason"
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder={`Selected reason: ${reasonLabelMap[formData.requestReason] || 'None selected'}. Tell us anything else that will help us review your request.`}
                  />
                </div>
                {statusSubmit === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{message}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
                <p className="text-sm text-gray-300 text-center">
                  By submitting this request, you confirm you have authority to request access for your organization.
                </p>
              </form>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    <LogIn className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">Sign in to request access</h2>
                  <p className="text-sm text-gray-300">
                    Use Google, Microsoft, or Apple for faster approval and account continuity.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(oauthProviders).map(([id, provider]) => (
                    <button
                      key={id}
                      type="button"
                      disabled={!!oauthLoading}
                      onClick={() => {
                        setOauthLoading(id)
                        signIn(id, { callbackUrl })
                      }}
                      className="w-full py-3 px-4 border border-white/20 rounded-lg font-medium text-gray-300 bg-white/5 hover:bg-white/10 focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {oauthLoading === id ? (
                        <span className="text-sm">Redirecting...</span>
                      ) : (
                        <>
                          {id === 'google' && (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                          )}
                          {id === 'azure-ad' && (
                            <svg className="w-5 h-5" viewBox="0 0 23 23" aria-hidden>
                              <path fill="#f35325" d="M1 1h10v10H1z" />
                              <path fill="#81bc06" d="M12 1h10v10H12z" />
                              <path fill="#05a6f0" d="M1 12h10v10H1z" />
                              <path fill="#ffba08" d="M12 12h10v10H12z" />
                            </svg>
                          )}
                          {id === 'apple' && (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                          )}
                          {provider.name}
                        </>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-500 mt-4">
                  <Link
                    href={`/${locale}/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                    className="text-primary font-medium hover:text-primary-dark"
                  >
                    Already have an account? Sign in with email
                  </Link>
                </p>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(!showEmailForm)}
                    className="flex items-center justify-center gap-2 w-full text-sm text-gray-400 hover:text-white"
                  >
                    {showEmailForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {showEmailForm ? 'Hide Form' : 'Prefer not to sign in?'} Submit Request by Email
                  </button>
                  {showEmailForm && (
                    <>
                      <Script
                        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                        strategy="lazyOnload"
                      />
                      <form ref={guestFormRef} onSubmit={handleSubmitUnauthenticated} className="mt-6 space-y-4">
                        {/* Honeypot: hidden from users, bots will fill it */}
                        <div className="absolute -left-[9999px] opacity-0 pointer-events-none h-0 overflow-hidden" aria-hidden>
                          <label htmlFor="website_url">Website (leave blank)</label>
                          <input
                            type="text"
                            id="website_url"
                            name="website_url"
                            tabIndex={-1}
                            autoComplete="off"
                            value={formData._honeypot}
                            onChange={(e) => setFormData({ ...formData, _honeypot: e.target.value })}
                          />
                        </div>
                        <div>
                        <label htmlFor="guest-email" className="block text-sm font-semibold text-white mb-2">Email Address <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input
                            type="email"
                            id="guest-email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="guest-name" className="block text-sm font-semibold text-white mb-2">Full Name <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          id="guest-name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="guest-company" className="block text-sm font-semibold text-white mb-2">Company Name</label>
                        <input
                          type="text"
                          id="guest-company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Your Company"
                        />
                      </div>
                      <div>
                        <label htmlFor="guest-request-reason" className="block text-sm font-semibold text-white mb-2">Reason for request <span className="text-red-400">*</span></label>
                        <select
                          id="guest-request-reason"
                          required
                          value={formData.requestReason}
                          onChange={(e) => setFormData({ ...formData, requestReason: e.target.value, accessCode: '' })}
                          className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select a reason</option>
                          {REQUEST_REASON_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      {reasonNeedsCode && (
                        <div>
                          <label htmlFor="guest-access-code" className="block text-sm font-semibold text-white mb-2">Access code <span className="text-red-400">*</span></label>
                          <input
                            type="text"
                            id="guest-access-code"
                            required
                            value={formData.accessCode}
                            onChange={(e) => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })}
                            className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter the code you were given"
                          />
                        </div>
                      )}
                      <div>
                        <label htmlFor="guest-reason" className="block text-sm font-semibold text-white mb-2">How will you use these resources?</label>
                        <textarea
                          id="guest-reason"
                          rows={3}
                          value={formData.reason}
                          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                          className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                          placeholder="Tell us about your business needs..."
                        />
                      </div>
                      {statusSubmit === 'error' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                          <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-800">{message}</p>
                        </div>
                      )}
                        {TURNSTILE_SITE_KEY && (
                          <div className="flex justify-center">
                            <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="light" />
                          </div>
                        )}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Lock className="w-5 h-5 mr-2" />
                              Submit Request by Email
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-surface-card border border-white/10 rounded-xl p-6"
          >
            <h3 className="font-semibold text-white mb-2">What&apos;s included in the Resource Centre</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Client-only business guides and operating frameworks</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Downloadable templates and tools</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Vetted links to external references and internal tools</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>ROI calculators and decision-support assessments</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
