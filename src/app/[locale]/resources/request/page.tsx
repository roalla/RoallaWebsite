'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, CheckCircle, AlertCircle, ArrowLeft, Shield } from 'lucide-react'
import { Link as IntlLink } from '@/i18n/navigation'

export default function RequestAccessPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
    reason: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')
    setMessage('')

    try {
      const response = await fetch('/api/resources/request-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Your access request has been submitted successfully. We will review your request and send you an email with access instructions within 24 hours.')
        setFormData({ email: '', name: '', company: '', reason: '' })
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-20 lg:py-28">
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
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-gray-900 mb-4">
              Request Access to Resource Centre
            </h1>
            <p className="text-xl text-gray-700">
              Get access to exclusive business resources, guides, templates, and insights.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12"
          >
            {status === 'success' ? (
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
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    We'll send access instructions to this email address.
                  </p>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-900 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your Company"
                  />
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

                {status === 'error' && (
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
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Request Access
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-600 text-center">
                  By requesting access, you agree to our terms of service and privacy policy.
                </p>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
          >
            <h3 className="font-semibold text-gray-900 mb-2">What's included in the Resource Centre?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Exclusive business guides and frameworks</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Downloadable templates and tools</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Links to external content (e.g. LinkedIn) and internal tools</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>ROI calculators and assessment tools</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
