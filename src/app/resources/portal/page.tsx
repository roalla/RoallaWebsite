'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FileText, Download, BookOpen, TrendingUp, BarChart3, Lightbulb, Lock, AlertCircle, LogOut } from 'lucide-react'
import Link from 'next/link'

interface Resource {
  id: string
  icon: any
  title: string
  description: string
  type: string
  downloadUrl?: string
  readUrl?: string
  color: string
}

function ResourcesPortalContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Check for access token in URL or session
    const token = searchParams.get('token') || localStorage.getItem('resources_access_token')
    const email = searchParams.get('email') || localStorage.getItem('resources_user_email')

    if (token && email) {
      // Verify token with API
      verifyAccess(token, email)
    } else {
      setIsLoading(false)
    }
  }, [searchParams])

  const verifyAccess = async (token: string, email: string) => {
    try {
      const response = await fetch(`/api/resources/verify-access?token=${token}&email=${encodeURIComponent(email)}`)
      if (response.ok) {
        setIsAuthenticated(true)
        setUserEmail(email)
        localStorage.setItem('resources_access_token', token)
        localStorage.setItem('resources_user_email', email)
      } else {
        setIsAuthenticated(false)
        localStorage.removeItem('resources_access_token')
        localStorage.removeItem('resources_user_email')
      }
    } catch (error) {
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('resources_access_token')
    localStorage.removeItem('resources_user_email')
    router.push('/resources/request')
  }

  const [portalResources, setPortalResources] = useState<Resource[]>([])
  const [portalArticles, setPortalArticles] = useState<Array<{ title: string; description: string; readTime?: string; category?: string; url?: string }>>([])
  const [contentLoaded, setContentLoaded] = useState(false)

  const iconByType: Record<string, typeof FileText> = {
    Guide: FileText,
    Template: BarChart3,
    Tool: TrendingUp,
    Framework: Lightbulb,
  }

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    fetch('/api/resources/portal/content')
      .then((res) => res.ok ? res.json() : { resources: [], articles: [] })
      .then((data) => {
        if (cancelled) return
        const rs = (data.resources || []).map((r: { id: string; title: string; description: string; type: string; downloadUrl?: string | null; linkUrl?: string | null; color: string }) => ({
          id: r.id,
          icon: iconByType[r.type] || FileText,
          title: r.title,
          description: r.description,
          type: r.type,
          downloadUrl: r.downloadUrl || undefined,
          readUrl: r.linkUrl || undefined,
          color: r.color || 'from-blue-500 to-blue-600',
        }))
        const arts = (data.articles || []).map((a: { title: string; description: string; readTime?: string | null; category?: string | null; url?: string | null }) => ({
          title: a.title,
          description: a.description,
          readTime: a.readTime || undefined,
          category: a.category || undefined,
          url: a.url || undefined,
        }))
        setPortalResources(rs)
        setPortalArticles(arts)
      })
      .catch(() => { if (!cancelled) setPortalResources([]); setPortalArticles([]) })
      .finally(() => { if (!cancelled) setContentLoaded(true) })
    return () => { cancelled = true }
  }, [isAuthenticated])

  const defaultResources: Resource[] = [
    { id: '1', icon: FileText, title: 'Business Growth Guide', description: 'A comprehensive 50-page guide to scaling your business strategically and sustainably.', type: 'Guide', downloadUrl: '/resources/business-growth-guide.pdf', color: 'from-blue-500 to-blue-600' },
    { id: '2', icon: BarChart3, title: 'Risk Management Templates', description: 'Download our proven risk management templates. Excel and Google Sheets versions included.', type: 'Template', downloadUrl: '/resources/financial-planning-template.xlsx', color: 'from-green-500 to-green-600' },
    { id: '3', icon: TrendingUp, title: 'ROI Calculator Tool', description: 'Interactive Excel-based calculator for ROI of business initiatives and projects.', type: 'Tool', downloadUrl: '/resources/roi-calculator.xlsx', color: 'from-purple-500 to-purple-600' },
    { id: '4', icon: Lightbulb, title: 'Strategic Planning Framework', description: 'Our proven 5-step framework for effective business strategies.', type: 'Framework', downloadUrl: '/resources/strategic-planning-framework.pdf', color: 'from-orange-500 to-orange-600' },
  ]
  const defaultArticles = [
    { title: '5 Key Metrics Every Business Should Track', description: 'Discover the essential metrics that drive business success.', readTime: '5 min read', category: 'Strategy' },
    { title: 'Fractional COO: When and Why Your Business Needs One', description: 'Learn how fractional COO services can transform operational management.', readTime: '7 min read', category: 'Operations' },
    { title: 'Strategic Planning for Small Businesses', description: 'A practical guide to creating and executing effective business strategies.', readTime: '6 min read', category: 'Planning' },
    { title: 'Building a High-Performance Team', description: 'Strategies for recruiting, developing, and retaining top talent.', readTime: '8 min read', category: 'Leadership' },
  ]

  const resources = contentLoaded && portalResources.length > 0 ? portalResources : defaultResources
  const articles = contentLoaded && portalArticles.length > 0 ? portalArticles : defaultArticles

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
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
            <Link
              href="/resources/request"
              className="inline-flex items-center bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Request Access
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20 lg:pt-24">
      {/* Portal header: below fixed site header to avoid overlap */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">Resources Portal</h1>
              <p className="text-sm text-gray-600 truncate" title={userEmail ?? undefined}>Welcome, {userEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Resources Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Downloadable Resources</h2>
          <p className="text-gray-600 mb-8">Access exclusive guides, templates, and tools.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
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
                <p className="text-gray-600 mb-4 leading-relaxed">{resource.description}</p>
                <div className="flex flex-wrap gap-2">
                  {resource.downloadUrl && (
                    <a
                      href={resource.downloadUrl}
                      download
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
        </div>

        {/* Articles Section */}
        <div>
          <div className="flex items-center mb-8">
            <BookOpen className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((article, index) => (
              <motion.div
                key={article.title + index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                {(article.category || article.readTime) && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    {article.category && <span className="font-semibold text-primary">{article.category}</span>}
                    {article.readTime && <span>{article.readTime}</span>}
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{article.description}</p>
                {'url' in article && article.url && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-3 text-sm font-medium text-primary hover:text-primary-dark"
                  >
                    Read more
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResourcesPortalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResourcesPortalContent />
    </Suspense>
  )
}
