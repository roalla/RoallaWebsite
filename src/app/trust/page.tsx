'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Shield,
  FileText,
  Lock,
  Download,
  ExternalLink,
  ChevronDown,
  Check,
  X,
} from 'lucide-react'

type DocResource = {
  id: string
  title: string
  description: string
  type: string
  downloadUrl: string | null
  linkUrl: string | null
  color: string
  sortOrder: number
  gated: boolean
  hasAccess: boolean
}

type DocArticle = {
  id: string
  title: string
  description: string
  readTime: string | null
  category: string | null
  url: string | null
  sortOrder: number
  gated: boolean
  hasAccess: boolean
}

type Agreement = {
  id: string
  title: string
  body: string
  version: string
  effectiveAt: string
} | null

const DOC_TABS = ['all', 'public', 'private'] as const

function TrustCenterContent() {
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('trust_center_token')
  })
  const [docTab, setDocTab] = useState<(typeof DOC_TABS)[number]>('all')
  const [resources, setResources] = useState<DocResource[]>([])
  const [articles, setArticles] = useState<DocArticle[]>([])
  const [agreement, setAgreement] = useState<Agreement>(null)
  const [loading, setLoading] = useState(true)
  const [getAccessOpen, setGetAccessOpen] = useState(false)
  const [accessForm, setAccessForm] = useState({
    email: '',
    name: '',
    company: '',
    acceptedNda: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [accessMessage, setAccessMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const fromUrl = searchParams.get('token')
    if (fromUrl) {
      setToken(fromUrl)
      if (typeof window !== 'undefined') {
        localStorage.setItem('trust_center_token', fromUrl)
        window.history.replaceState({}, '', '/trust')
      }
    } else if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('trust_center_token')
      if (stored) setToken(stored)
    }
  }, [searchParams])

  useEffect(() => {
    const t = token ?? undefined
    Promise.all([
      fetch('/api/trust/documents' + (t ? `?token=${encodeURIComponent(t)}` : '')).then((r) => r.json()),
      fetch('/api/trust/agreement').then((r) => r.json()),
    ])
      .then(([docData, agreementData]) => {
        setResources(docData.resources ?? [])
        setArticles(docData.articles ?? [])
        setAgreement(agreementData.agreement ?? null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  const filteredResources = docTab === 'public' ? resources.filter((r) => !r.gated) : docTab === 'private' ? resources.filter((r) => r.gated) : resources
  const filteredArticles = docTab === 'public' ? articles.filter((a) => !a.gated) : docTab === 'private' ? articles.filter((a) => a.gated) : articles
  const gatedResourceIds = resources.filter((r) => r.gated).map((r) => ({ type: 'resource' as const, id: r.id }))
  const gatedArticleIds = articles.filter((a) => a.gated).map((a) => ({ type: 'article' as const, id: a.id }))
  const allGatedItems = [...gatedResourceIds, ...gatedArticleIds]

  const handleGetAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreement) return
    setAccessMessage(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/trust/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: accessForm.email.trim(),
          name: accessForm.name.trim(),
          company: accessForm.company.trim() || undefined,
          agreementId: agreement.id,
          acceptedNda: accessForm.acceptedNda,
          items: allGatedItems,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit')
      setAccessMessage({ type: 'success', text: data.message || 'Request submitted. We will notify you once reviewed.' })
      setAccessForm({ email: '', name: '', company: '', acceptedNda: false })
      setTimeout(() => setGetAccessOpen(false), 2000)
    } catch (err) {
      setAccessMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to submit' })
    } finally {
      setSubmitting(false)
    }
  }

  const downloadUrl = (type: 'resource' | 'article', id: string) => {
    const t = token ?? ''
    return `/api/trust/download?type=${type}&id=${encodeURIComponent(id)}${t ? `&token=${encodeURIComponent(t)}` : ''}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <Link href="/" className="text-sm text-primary hover:text-primary-dark font-medium">← Back to Roalla</Link>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Trust Center</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start your security review. Request access to compliance and policy documents; some require NDA sign-off and approval.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Documents
          </h2>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {DOC_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setDocTab(tab)}
                className={`text-sm font-medium capitalize ${docTab === tab ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              {allGatedItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setGetAccessOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
                >
                  <Lock className="w-4 h-4" /> Get access
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <p className="text-gray-500 py-8">Loading...</p>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">Featured documents</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredResources.slice(0, 6).map((r) => (
                  <div
                    key={r.id}
                    className="p-4 bg-white rounded-xl border border-gray-200 flex items-start gap-3"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center flex-shrink-0`}>
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-gray-900">{r.title}</p>
                        {r.gated && !r.hasAccess && <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">{r.description.replace(/<[^>]*>/g, '')}</p>
                      {r.hasAccess && (r.downloadUrl || r.linkUrl) && (
                        <div className="mt-2 flex gap-2">
                          {r.downloadUrl && (
                            <a
                              href={downloadUrl('resource', r.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                            >
                              <Download className="w-3.5 h-3.5" /> Download
                            </a>
                          )}
                          {r.linkUrl && (
                            <a
                              href={r.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Open
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredArticles.slice(0, 4).map((a) => (
                  <div
                    key={a.id}
                    className="p-4 bg-white rounded-xl border border-gray-200 flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-gray-900">{a.title}</p>
                        {a.gated && !a.hasAccess && <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">{a.description.replace(/<[^>]*>/g, '')}</p>
                      {a.hasAccess && a.url && (
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Read
                        </a>
                      )}
                      {a.hasAccess && !a.url && a.gated && (
                        <a
                          href={downloadUrl('article', a.id)}
                          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {(filteredResources.length === 0 && filteredArticles.length === 0) && (
                <p className="text-gray-500 py-6">No documents in this category.</p>
              )}
            </>
          )}
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {[
            { title: 'App Security', icon: Shield, items: ['Code analysis', 'SDLC', 'Vulnerability & patch management'] },
            { title: 'Legal', icon: FileText, items: ['Privacy policy', 'Terms of service'] },
            { title: 'Data Privacy', icon: Lock, items: ['Data privacy officer', 'Employee privacy training'] },
          ].map((card) => (
            <div key={card.title} className="p-4 bg-white rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <card.icon className="w-4 h-4 text-primary" />
                {card.title}
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                {card.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>

      {getAccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" aria-modal="true" role="dialog">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Request access</h2>
              <button
                type="button"
                onClick={() => { setGetAccessOpen(false); setAccessMessage(null) }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Complete the form and accept the NDA below. We will review your request and send you an access link once approved.
            </p>
            {accessMessage && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${accessMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {accessMessage.text}
              </div>
            )}
            {agreement && (
              <form onSubmit={handleGetAccess} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={accessForm.email}
                    onChange={(e) => setAccessForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={accessForm.name}
                    onChange={(e) => setAccessForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={accessForm.company}
                    onChange={(e) => setAccessForm((f) => ({ ...f, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                  <p className="text-xs font-medium text-gray-500 mb-2">{agreement.title} (v{agreement.version})</p>
                  <div className="text-sm text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: agreement.body }} />
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={accessForm.acceptedNda}
                    onChange={(e) => setAccessForm((f) => ({ ...f, acceptedNda: e.target.checked }))}
                    className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">I have read and accept the terms above.</span>
                </label>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setGetAccessOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit request'}
                  </button>
                </div>
              </form>
            )}
            {!agreement && !loading && (
              <p className="text-gray-500">No NDA agreement is configured. Please contact the administrator.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function TrustCenterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <TrustCenterContent />
    </Suspense>
  )
}
