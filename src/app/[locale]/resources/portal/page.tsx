'use client'

import React, { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { FileText, Download, BookOpen, TrendingUp, BarChart3, Lightbulb, Lock, LogOut, Eye, X, Gift } from 'lucide-react'
import { Link as IntlLink } from '@/i18n/navigation'

interface Resource {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  type: string
  downloadUrl?: string
  readUrl?: string
  color: string
  viewOnly?: boolean
  isPdf?: boolean
}

interface PortalLink {
  id?: string
  title: string
  description: string
  readTime?: string
  category?: string
  url?: string
}

function ResourcesPortalContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const token = searchParams.get('token') || (typeof localStorage !== 'undefined' ? localStorage.getItem('resources_access_token') : null)
    const email = searchParams.get('email') || (typeof localStorage !== 'undefined' ? localStorage.getItem('resources_user_email') : null)

    if (token && email) {
      verifyAccess(token, email)
    } else {
      setIsLoading(false)
    }
  }, [mounted, searchParams])

  const verifyAccess = async (token: string, email: string) => {
    try {
      const response = await fetch(`/api/resources/verify-access?token=${token}&email=${encodeURIComponent(email)}`)
      if (response.ok) {
        setIsAuthenticated(true)
        setUserEmail(email)
        setAccessToken(token)
        localStorage.setItem('resources_access_token', token)
        localStorage.setItem('resources_user_email', email)
      } else {
        setIsAuthenticated(false)
        setAccessToken(null)
        localStorage.removeItem('resources_access_token')
        localStorage.removeItem('resources_user_email')
      }
    } catch {
      setIsAuthenticated(false)
      setAccessToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('resources_access_token')
    localStorage.removeItem('resources_user_email')
    setAccessToken(null)
    router.push('/resources/request')
  }

  const [portalResources, setPortalResources] = useState<Resource[]>([])
  const [portalLinks, setPortalLinks] = useState<PortalLink[]>([])
  const [contentLoaded, setContentLoaded] = useState(false)
  const [portalOrgName, setPortalOrgName] = useState<string | null>(null)
  const [pdfViewerResourceId, setPdfViewerResourceId] = useState<string | null>(null)
  const [redeemCode, setRedeemCode] = useState('')
  const [redeemStatus, setRedeemStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [redeemLoading, setRedeemLoading] = useState(false)

  const iconByType: Record<string, typeof FileText> = {
    Guide: FileText,
    Template: BarChart3,
    Tool: TrendingUp,
    Framework: Lightbulb,
  }

  const fetchContent = useCallback(() => {
    const token = accessToken || (typeof localStorage !== 'undefined' ? localStorage.getItem('resources_access_token') : null)
    const email = userEmail || (typeof localStorage !== 'undefined' ? localStorage.getItem('resources_user_email') : null)
    if (!token || !email) return
    const orgSlug = searchParams.get('org')?.trim() || ''
    const params = new URLSearchParams({ token, email })
    if (orgSlug) params.set('org', orgSlug)
    const url = `/api/resources/portal/content?${params.toString()}`
    fetch(url)
      .then((res) => (res.ok ? res.json() : { resources: [], articles: [] }))
      .then((data) => {
        const rs = (data.resources || []).map((r: { id: string; title: string; description: string; type: string; downloadUrl?: string | null; linkUrl?: string | null; color: string; viewOnly?: boolean }) => {
          const downloadUrl = r.downloadUrl || undefined
          const isPdf = typeof downloadUrl === 'string' && /\.pdf$/i.test(downloadUrl)
          return {
            id: r.id,
            icon: iconByType[r.type] || FileText,
            title: r.title,
            description: r.description,
            type: r.type,
            downloadUrl,
            readUrl: r.linkUrl || undefined,
            color: r.color || 'from-blue-500 to-blue-600',
            viewOnly: r.viewOnly ?? false,
            isPdf: !!isPdf,
          }
        })
        const links = (data.articles || []).map((a: { id: string; title: string; description: string; readTime?: string | null; category?: string | null; url?: string | null }) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          readTime: a.readTime || undefined,
          category: a.category || undefined,
          url: a.url || undefined,
        }))
        setPortalResources(rs)
        setPortalLinks(links)
        setPortalOrgName(data.orgName ?? null)
      })
      .catch(() => {
        setPortalResources([])
        setPortalLinks([])
        setPortalOrgName(null)
      })
      .finally(() => setContentLoaded(true))
  }, [accessToken, userEmail, searchParams])

  useEffect(() => {
    if (!isAuthenticated || !accessToken || !userEmail) return
    let cancelled = false
    setContentLoaded(false)
    const token = accessToken
    const email = userEmail
    const orgSlug = searchParams.get('org')?.trim() || ''
    const params = new URLSearchParams({ token, email })
    if (orgSlug) params.set('org', orgSlug)
    const url = `/api/resources/portal/content?${params.toString()}`
    fetch(url)
      .then((res) => (res.ok ? res.json() : { resources: [], articles: [] }))
      .then((data) => {
        if (cancelled) return
        const rs = (data.resources || []).map((r: { id: string; title: string; description: string; type: string; downloadUrl?: string | null; linkUrl?: string | null; color: string; viewOnly?: boolean }) => {
          const downloadUrl = r.downloadUrl || undefined
          const isPdf = typeof downloadUrl === 'string' && /\.pdf$/i.test(downloadUrl)
          return {
            id: r.id,
            icon: iconByType[r.type] || FileText,
            title: r.title,
            description: r.description,
            type: r.type,
            downloadUrl,
            readUrl: r.linkUrl || undefined,
            color: r.color || 'from-blue-500 to-blue-600',
            viewOnly: r.viewOnly ?? false,
            isPdf: !!isPdf,
          }
        })
        const links = (data.articles || []).map((a: { id: string; title: string; description: string; readTime?: string | null; category?: string | null; url?: string | null }) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          readTime: a.readTime || undefined,
          category: a.category || undefined,
          url: a.url || undefined,
        }))
        setPortalResources(rs)
        setPortalLinks(links)
        setPortalOrgName(data.orgName ?? null)
      })
      .catch(() => {
        if (!cancelled) {
          setPortalResources([])
          setPortalLinks([])
          setPortalOrgName(null)
        }
      })
      .finally(() => {
        if (!cancelled) setContentLoaded(true)
      })
    return () => { cancelled = true }
  }, [isAuthenticated, accessToken, userEmail, searchParams])

  const handleRedeemCode = async () => {
    const code = redeemCode.trim().toUpperCase()
    if (!code) {
      setRedeemStatus({ type: 'error', message: 'Please enter a code.' })
      return
    }
    const token = accessToken || (typeof localStorage !== 'undefined' ? localStorage.getItem('resources_access_token') : null)
    const email = userEmail || (typeof localStorage !== 'undefined' ? localStorage.getItem('resources_user_email') : null)
    if (!token || !email) {
      setRedeemStatus({ type: 'error', message: 'Session missing. Please refresh and try again.' })
      return
    }
    setRedeemLoading(true)
    setRedeemStatus(null)
    try {
      const res = await fetch('/api/resources/portal/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, token, email }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success) {
        setRedeemStatus({ type: 'success', message: data.message || 'Code redeemed. New resources may now be available.' })
        setRedeemCode('')
        fetchContent()
      } else {
        setRedeemStatus({ type: 'error', message: data.error || 'Invalid or expired code.' })
      }
    } catch {
      setRedeemStatus({ type: 'error', message: 'Could not redeem code. Try again.' })
    } finally {
      setRedeemLoading(false)
    }
  }

  const getFileUrl = (resourceId: string, disposition: 'inline' | 'attachment') => {
    const token = accessToken || (typeof localStorage !== 'undefined' ? localStorage.getItem('resources_access_token') : null)
    const email = userEmail || (typeof localStorage !== 'undefined' ? localStorage.getItem('resources_user_email') : null)
    if (!token || !email) return '#'
    const params = new URLSearchParams({ token, email, disposition })
    return `/api/resources/portal/file/${resourceId}?${params.toString()}`
  }

  const getOutUrl = (articleId: string) => {
    const token = accessToken || (typeof localStorage !== 'undefined' ? localStorage.getItem('resources_access_token') : null)
    const email = userEmail || (typeof localStorage !== 'undefined' ? localStorage.getItem('resources_user_email') : null)
    if (!token || !email) return '#'
    const params = new URLSearchParams({ token, email, articleId })
    return `/api/resources/portal/out?${params.toString()}`
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{mounted ? 'Verifying access...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Required</h1>
            <p className="text-gray-700 mb-8">
              You need to request access to view the resources portal. Please submit an access request to continue.
            </p>
            <IntlLink
              href="/resources/request"
              className="inline-flex items-center bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Request Access
            </IntlLink>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 lg:pt-28">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Resources Portal{portalOrgName ? ` for ${portalOrgName}` : ''}
              </h1>
              <p className="text-sm text-gray-600 truncate" title={userEmail ?? undefined}>Welcome, {userEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center min-h-[44px] min-w-[44px] justify-center text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Redeem code */}
        <div className="mb-10 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-900">Have a training or bundle code?</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">Enter it below to unlock additional resources.</p>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
              placeholder="e.g. ROALLA-TRAIN-2026"
              className="flex-1 min-w-[180px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
              aria-label="Access code"
            />
            <button
              type="button"
              onClick={handleRedeemCode}
              disabled={redeemLoading}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg text-sm disabled:opacity-50"
            >
              {redeemLoading ? 'Redeeming...' : 'Redeem'}
            </button>
          </div>
          {redeemStatus && (
            <p className={`mt-2 text-sm ${redeemStatus.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
              {redeemStatus.message}
            </p>
          )}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Downloadable Resources</h2>
          <p className="text-gray-600 mb-8">Access exclusive guides, templates, and tools.</p>

          {!contentLoaded ? (
            <p className="text-gray-500">Loading resources...</p>
          ) : portalResources.length === 0 ? (
            <p className="text-gray-500">No resources are currently available for your account. Redeem a code or contact your consultant for access to specific items.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portalResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${resource.color} rounded-lg flex items-center justify-center mb-4`}>
                    <resource.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                    {resource.type}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                  <div
                    className="portal-rich-text text-gray-600 mb-4 leading-relaxed [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline [&_a]:hover:opacity-90 [&_strong]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: resource.description || '' }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {resource.downloadUrl && resource.isPdf && (
                      <button
                        type="button"
                        onClick={() => setPdfViewerResourceId(resource.id)}
                        className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </button>
                    )}
                    {resource.downloadUrl && !resource.viewOnly && (
                      <a
                        href={getFileUrl(resource.id, 'attachment')}
                        className="inline-flex items-center bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    )}
                    {resource.readUrl && (
                      <a
                        href={resource.readUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        Open link
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center mb-8">
            <BookOpen className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Links</h2>
          </div>
          <p className="text-gray-600 mb-6">External content and links to internal tools.</p>
          {!contentLoaded ? (
            <p className="text-gray-500">Loading links...</p>
          ) : portalLinks.length === 0 ? (
            <p className="text-gray-500">No links are currently available for your account.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {portalLinks.map((link, index) => (
                <motion.div
                  key={(link.id || link.title) + String(index)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  {(link.category || link.readTime) && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      {link.category && <span className="font-semibold text-primary">{link.category}</span>}
                      {link.readTime && <span>{link.readTime}</span>}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{link.title}</h3>
                  <div
                    className="portal-rich-text text-sm text-gray-600 leading-relaxed [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline [&_a]:hover:opacity-90 [&_strong]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: link.description || '' }}
                  />
                  {link.id && link.url && link.url !== '#' && (
                    <a
                      href={getOutUrl(link.id)}
                      className="inline-flex items-center mt-3 text-sm font-medium text-primary hover:text-primary-dark"
                    >
                      {link.url.startsWith('/') ? 'Open tool' : 'Open link'}
                    </a>
                  )}
                  {link.url && !link.id && (
                    <a
                      href={link.url}
                      target={link.url.startsWith('/') ? undefined : '_blank'}
                      rel={link.url.startsWith('/') ? undefined : 'noopener noreferrer'}
                      className="inline-flex items-center mt-3 text-sm font-medium text-primary hover:text-primary-dark"
                    >
                      {link.url.startsWith('/') ? 'Open tool' : 'Open link'}
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* In-page PDF viewer modal */}
      {pdfViewerResourceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="View PDF">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <span className="font-medium text-gray-900">View document</span>
              <button
                type="button"
                onClick={() => setPdfViewerResourceId(null)}
                className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <iframe
                title="PDF viewer"
                src={getFileUrl(pdfViewerResourceId, 'inline')}
                className="w-full h-full min-h-[70vh] border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ResourcesPortalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResourcesPortalContent />
    </Suspense>
  )
}
