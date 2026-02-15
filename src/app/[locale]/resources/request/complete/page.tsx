'use client'

import React, { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, AlertCircle, ArrowLeft, Shield, User, Building2 } from 'lucide-react'
import { Link as IntlLink } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

export default function RequestCompletePage() {
  const { data: session, status } = useSession()
  const locale = useLocale()
  const [formData, setFormData] = useState({ name: '', company: '', reason: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusSubmit, setStatusSubmit] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      const callbackUrl = `/${locale}/resources/request/complete`
      signIn(undefined, { callbackUrl })
      return
    }
    if (session?.user?.name && !formData.name) {
      setFormData((prev) => ({ ...prev, name: session.user.name || '' }))
    }
  }, [status, session, locale, formData.name])

  const handleSubmit = async (e: React.FormEvent) => {
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
          reason: formData.reason.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatusSubmit('success')
        setMessage('Your access request has been submitted successfully. We will review your request and send you an email with access instructions within 24 hours.')
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

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-20">
        <div className="text-center text-gray-600">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <IntlLink
            href="/resources/request"
            className="inline-flex items-center text-primary hover:text-primary-dark mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Request Access
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
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-gray-900 mb-4">
              Complete Your Request
            </h1>
            <p className="text-xl text-gray-700">
              Add your full name and company so we can process your Resource Centre access request.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12"
          >
            {statusSubmit === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted!</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <IntlLink
                  href="/"
                  className="inline-flex items-center bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Return to Homepage
                </IntlLink>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      readOnly
                      value={session?.user?.email ?? ''}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">This is the account you signed in with.</p>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-900 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-semibold text-gray-900 mb-2">
                    How will you use these resources?
                  </label>
                  <textarea
                    id="reason"
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Tell us about your business needs and how these resources will help you..."
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
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
