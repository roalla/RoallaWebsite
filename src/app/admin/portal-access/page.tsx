'use client'

import React, { useState, useEffect } from 'react'
import { Users, Unlock, Lock, Loader2 } from 'lucide-react'

interface AccessRequestRow {
  id: string
  email: string
  name: string
  company: string | null
  fullAccess: boolean
  grantResourceIds: string[]
  grantArticleIds: string[]
}

interface Resource {
  id: string
  title: string
  lockedByAdmin: boolean
}

interface Article {
  id: string
  title: string
  lockedByAdmin: boolean
}

export default function AdminPortalAccessPage() {
  const [requests, setRequests] = useState<AccessRequestRow[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/portal-access')
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setRequests(data.requests || [])
      setResources(data.resources || [])
      setArticles(data.articles || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async (req: AccessRequestRow, fullAccess: boolean, grantResourceIds: string[], grantArticleIds: string[]) => {
    setSavingId(req.id)
    setError('')
    try {
      const res = await fetch(`/api/admin/portal-access/${req.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullAccess,
          grantResourceIds,
          grantArticleIds,
        }),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Update failed')
      setRequests((prev) =>
        prev.map((r) =>
          r.id === req.id
            ? { ...r, fullAccess, grantResourceIds, grantArticleIds }
            : r
        )
      )
      setExpandedId(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed')
    } finally {
      setSavingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading...
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal access</h1>
      <p className="text-gray-600 mb-6">
        Control what each approved user sees: <strong>Full access</strong> (all content) or <strong>Select items</strong> (only chosen resources and links). Locked tiles are hidden unless the user has a grant, full access, or a redeemed bundle.
      </p>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-800 text-sm">{error}</div>
      )}
      {requests.length === 0 ? (
        <p className="text-gray-500">No approved access requests yet. Approve users from Library access first.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 truncate">{req.email}</div>
                  <div className="text-sm text-gray-500">
                    {req.name}
                    {req.company && ` · ${req.company}`}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {req.fullAccess ? (
                    <span className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-50 px-2 py-1 rounded">
                      <Unlock className="w-4 h-4" /> Full access
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                      <Lock className="w-4 h-4" />
                      {req.grantResourceIds.length + req.grantArticleIds.length} items
                    </span>
                  )}
                </div>
              </button>
              {expandedId === req.id && (
                <PortalAccessForm
                  request={req}
                  resources={resources}
                  articles={articles}
                  onSave={handleSave}
                  onCancel={() => setExpandedId(null)}
                  saving={savingId === req.id}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function PortalAccessForm({
  request,
  resources,
  articles,
  onSave,
  onCancel,
  saving,
}: {
  request: AccessRequestRow
  resources: Resource[]
  articles: Article[]
  onSave: (req: AccessRequestRow, fullAccess: boolean, grantResourceIds: string[], grantArticleIds: string[]) => void
  onCancel: () => void
  saving: boolean
}) {
  const [fullAccess, setFullAccess] = useState(request.fullAccess)
  const [grantResourceIds, setGrantResourceIds] = useState<Set<string>>(new Set(request.grantResourceIds))
  const [grantArticleIds, setGrantArticleIds] = useState<Set<string>>(new Set(request.grantArticleIds))

  useEffect(() => {
    setFullAccess(request.fullAccess)
    setGrantResourceIds(new Set(request.grantResourceIds))
    setGrantArticleIds(new Set(request.grantArticleIds))
  }, [request.id, request.fullAccess, request.grantResourceIds, request.grantArticleIds])

  const toggleResource = (id: string) => {
    setGrantResourceIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const toggleArticle = (id: string) => {
    setGrantArticleIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`full-${request.id}`}
          checked={fullAccess}
          onChange={(e) => setFullAccess(e.target.checked)}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor={`full-${request.id}`} className="text-sm font-medium text-gray-700">
          Full access (user sees all portal content, including locked items)
        </label>
      </div>
      {!fullAccess && (
        <>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Resources (locked items this user can see)</div>
            <div className="flex flex-wrap gap-2">
              {resources.filter((r) => r.lockedByAdmin).length === 0 ? (
                <span className="text-gray-500 text-sm">No locked resources. Lock tiles in Portal content → Downloadable resources.</span>
              ) : (
                resources
                  .filter((r) => r.lockedByAdmin)
                  .map((r) => (
                    <label key={r.id} className="inline-flex items-center gap-1.5 text-sm">
                      <input
                        type="checkbox"
                        checked={grantResourceIds.has(r.id)}
                        onChange={() => toggleResource(r.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-gray-700">{r.title}</span>
                    </label>
                  ))
              )}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Links (locked items this user can see)</div>
            <div className="flex flex-wrap gap-2">
              {articles.filter((a) => a.lockedByAdmin).length === 0 ? (
                <span className="text-gray-500 text-sm">No locked links. Lock tiles in Portal content → Portal links.</span>
              ) : (
                articles
                  .filter((a) => a.lockedByAdmin)
                  .map((a) => (
                    <label key={a.id} className="inline-flex items-center gap-1.5 text-sm">
                      <input
                        type="checkbox"
                        checked={grantArticleIds.has(a.id)}
                        onChange={() => toggleArticle(a.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-gray-700">{a.title}</span>
                    </label>
                  ))
              )}
            </div>
          </div>
        </>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onSave(request, fullAccess, Array.from(grantResourceIds), Array.from(grantArticleIds))}
          disabled={saving}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
