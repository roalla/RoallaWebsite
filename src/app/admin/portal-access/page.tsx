'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Unlock, Lock, Loader2, UserPlus, Upload, X, CheckCircle, XCircle } from 'lucide-react'

interface AccessRequestRow {
  id: string
  email: string
  name: string
  company: string | null
  fullAccess: boolean
  grantResourceIds: string[]
  grantArticleIds: string[]
  status?: string
  createdAt?: string
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

const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
] as const

export default function AdminPortalAccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab') || 'approved'
  const [requests, setRequests] = useState<AccessRequestRow[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [tab, setTab] = useState<string>(tabFromUrl)
  const [addOpen, setAddOpen] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [addForm, setAddForm] = useState({ email: '', name: '', company: '', sendEmail: true })
  const [bulkText, setBulkText] = useState('')
  const [bulkSendEmail, setBulkSendEmail] = useState(true)
  const [addSubmitting, setAddSubmitting] = useState(false)
  const [bulkSubmitting, setBulkSubmitting] = useState(false)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setMessage(null)
      const res = await fetch('/api/admin/portal-access')
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setRequests(data.requests || [])
      setResources(data.resources || [])
      setArticles(data.articles || [])
      setIsAdmin(data.isAdmin === true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (TABS.some((t) => t.key === tabFromUrl)) setTab(tabFromUrl)
  }, [tabFromUrl])

  const filtered = tab ? requests.filter((r) => r.status === tab) : requests
  const approved = requests.filter((r) => r.status === 'approved')

  const handleSave = async (req: AccessRequestRow, fullAccess: boolean, grantResourceIds: string[], grantArticleIds: string[]) => {
    setSavingId(req.id)
    setError('')
    try {
      const res = await fetch(`/api/admin/portal-access/${req.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullAccess, grantResourceIds, grantArticleIds }),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Update failed')
      setRequests((prev) =>
        prev.map((r) =>
          r.id === req.id ? { ...r, fullAccess, grantResourceIds, grantArticleIds } : r
        )
      )
      setExpandedId(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed')
    } finally {
      setSavingId(null)
    }
  }

  const handleApprove = async (req: AccessRequestRow, sendEmail = true) => {
    setApprovingId(req.id)
    setError('')
    try {
      const res = await fetch(`/api/admin/requests/${req.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullAccess: false, grantResourceIds: [], grantArticleIds: [], sendEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Approve failed')
      setMessage({ type: 'success', text: `Approved ${req.email}. ${data.emailSent ? 'Email sent.' : ''}` })
      router.refresh()
      fetchData()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Approve failed')
    } finally {
      setApprovingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setRejectingId(id)
    try {
      const res = await fetch(`/api/admin/requests/${id}/reject`, { method: 'POST' })
      if (res.ok) {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)))
      }
    } finally {
      setRejectingId(null)
    }
  }

  const handleRevoke = async (id: string) => {
    setRevokingId(id)
    try {
      const res = await fetch(`/api/admin/requests/${id}/revoke`, { method: 'POST' })
      if (res.ok) {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)))
        fetchData()
      }
    } finally {
      setRevokingId(null)
    }
  }

  const parseBulkLine = (line: string): { email: string; name?: string; company?: string } | null => {
    const parts = line.split(',').map((p) => p.trim()).filter(Boolean)
    if (parts.length === 0) return null
    const email = parts[0]
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
    return { email, name: parts[1], company: parts[2] }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddSubmitting(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/requests/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: addForm.email.trim(),
          name: addForm.name.trim(),
          company: addForm.company.trim() || undefined,
          sendEmail: addForm.sendEmail,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to add user' })
        return
      }
      setMessage({ type: 'success', text: `Added ${addForm.email}. ${data.emailSent ? 'Email sent. Default: public files only.' : ''}` })
      setAddForm({ email: '', name: '', company: '', sendEmail: true })
      setAddOpen(false)
      fetchData()
    } catch {
      setMessage({ type: 'error', text: 'Failed to add user' })
    } finally {
      setAddSubmitting(false)
    }
  }

  const handleBulkAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setBulkSubmitting(true)
    setMessage(null)
    const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean)
    const users = lines.map(parseBulkLine).filter((u): u is { email: string; name?: string; company?: string } => u !== null)
    if (users.length === 0) {
      setMessage({ type: 'error', text: 'Enter at least one valid line (email or email, name or email, name, company)' })
      setBulkSubmitting(false)
      return
    }
    try {
      const res = await fetch('/api/admin/requests/bulk-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users, sendEmail: bulkSendEmail }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Bulk add failed' })
        return
      }
      const { created = 0, updated = 0, skipped = 0 } = data.summary || {}
      setMessage({ type: 'success', text: `Done: ${created} added, ${updated} updated, ${skipped} skipped. Default: public files only.` })
      setBulkText('')
      setBulkOpen(false)
      fetchData()
    } catch {
      setMessage({ type: 'error', text: 'Bulk add failed' })
    } finally {
      setBulkSubmitting(false)
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
      <Link href="/admin/portal" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
        ← Back to Portal
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal access</h1>
      <p className="text-gray-600 mb-6">
        Who can use the Resources Portal and what they see: approve or reject requests, add users, then set <strong>Full access</strong> or <strong>Select items</strong> (default: public files only). Lock items in Portal content to restrict them, then grant per user below.
      </p>

      {(error || message) && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${message ? (message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800') : 'bg-red-50 text-red-800'}`}
        >
          {message ? message.text : error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-6">
        {isAdmin && TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`min-h-[44px] inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${tab === t.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {t.label}
          </button>
        ))}
        {!isAdmin && <span className="text-sm text-gray-500">Approved users</span>}
        {isAdmin && (
          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
            >
              <UserPlus className="w-4 h-4" />
              Add user
            </button>
            <button
              type="button"
              onClick={() => setBulkOpen(true)}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
            >
              <Upload className="w-4 h-4" />
              Bulk add
            </button>
          </div>
        )}
      </div>

      {tab === 'pending' && filtered.length === 0 && (
        <p className="text-gray-500 py-4">No pending requests.</p>
      )}
      {tab === 'rejected' && filtered.length === 0 && (
        <p className="text-gray-500 py-4">No rejected requests.</p>
      )}

      {tab === 'pending' && filtered.length > 0 && (
        <ul className="space-y-3 mb-8">
          {filtered.map((req) => (
            <li key={req.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-medium text-gray-900">{req.email}</div>
                <div className="text-sm text-gray-500">{req.name}{req.company && ` · ${req.company}`}</div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleApprove(req)}
                  disabled={approvingId === req.id}
                  className="inline-flex items-center gap-1 min-h-[44px] px-4 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:opacity-50"
                >
                  {approvingId === req.id ? '…' : <><CheckCircle className="w-4 h-4" /> Approve (public only)</>}
                </button>
                <button
                  type="button"
                  onClick={() => handleReject(req.id)}
                  disabled={rejectingId === req.id}
                  className="min-h-[44px] px-4 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {rejectingId === req.id ? '…' : 'Reject'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {tab === 'rejected' && filtered.length > 0 && (
        <ul className="space-y-3 mb-8">
          {filtered.map((req) => (
            <li key={req.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{req.email}</div>
                <div className="text-sm text-gray-500">{req.name}{req.company && ` · ${req.company}`}</div>
              </div>
              <span className="inline-flex items-center gap-1 text-sm text-red-700 bg-red-50 px-2 py-1 rounded">
                <XCircle className="w-4 h-4" /> Rejected
              </span>
            </li>
          ))}
        </ul>
      )}

      {(tab === 'approved' || !isAdmin) && (
        <>
          {approved.length === 0 ? (
            <p className="text-gray-500">No approved users yet. {isAdmin ? 'Approve requests above or add users.' : ''}</p>
          ) : (
            <ul className="space-y-4">
              {approved.map((req) => (
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
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRevoke(req.id) }}
                          disabled={revokingId === req.id}
                          className="text-sm font-medium text-amber-600 hover:text-amber-700 disabled:opacity-50"
                        >
                          {revokingId === req.id ? '…' : 'Remove access'}
                        </button>
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
        </>
      )}

      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Add user</h2>
              <button type="button" onClick={() => setAddOpen(false)} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" required value={addForm.email} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" required value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company (optional)</label>
                <input type="text" value={addForm.company} onChange={(e) => setAddForm((f) => ({ ...f, company: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <p className="text-xs text-gray-500">Default access: public files only. Set full or per-item access after adding.</p>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={addForm.sendEmail} onChange={(e) => setAddForm((f) => ({ ...f, sendEmail: e.target.checked }))} />
                <span className="text-sm text-gray-700">Send approval email with portal link</span>
              </label>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={addSubmitting} className="min-h-[44px] px-4 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50">
                  {addSubmitting ? 'Adding…' : 'Add'}
                </button>
                <button type="button" onClick={() => setAddOpen(false)} className="min-h-[44px] px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {bulkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Bulk add users</h2>
              <button type="button" onClick={() => setBulkOpen(false)} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              One per line: <code className="bg-gray-100 px-1 rounded">email</code> or <code className="bg-gray-100 px-1 rounded">email, name</code> or <code className="bg-gray-100 px-1 rounded">email, name, company</code>. Default: public files only.
            </p>
            <form onSubmit={handleBulkAdd} className="space-y-4">
              <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={8} placeholder="user@example.com, Jane Doe, Acme Inc" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={bulkSendEmail} onChange={(e) => setBulkSendEmail(e.target.checked)} />
                <span className="text-sm text-gray-700">Send approval emails</span>
              </label>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={bulkSubmitting} className="min-h-[44px] px-4 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50">
                  {bulkSubmitting ? 'Adding…' : 'Add all'}
                </button>
                <button type="button" onClick={() => setBulkOpen(false)} className="min-h-[44px] px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
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
        <input type="checkbox" id={`full-${request.id}`} checked={fullAccess} onChange={(e) => setFullAccess(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary" />
        <label htmlFor={`full-${request.id}`} className="text-sm font-medium text-gray-700">
          Full access (user sees all portal content, including locked items)
        </label>
      </div>
      {!fullAccess && (
        <>
          <p className="text-xs text-gray-500 bg-white/80 rounded px-2 py-1.5 border border-gray-200">
            Unlocked items are visible to all. Check boxes to grant this user access to <strong>locked</strong> items. Lock items in Portal content first to restrict them.
          </p>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Resources</div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {resources.length === 0 ? <span className="text-gray-500 text-sm">No resources yet.</span> : resources.map((r) => (
                <label key={r.id} className={`inline-flex items-center gap-1.5 text-sm ${r.lockedByAdmin ? '' : 'opacity-75'}`}>
                  <input type="checkbox" checked={grantResourceIds.has(r.id)} onChange={() => toggleResource(r.id)} disabled={!r.lockedByAdmin} className="rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50" />
                  <span className="text-gray-700">{r.title}</span>
                  {!r.lockedByAdmin && <span className="text-gray-400 text-xs">(visible to all)</span>}
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Links</div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {articles.length === 0 ? <span className="text-gray-500 text-sm">No links yet.</span> : articles.map((a) => (
                <label key={a.id} className={`inline-flex items-center gap-1.5 text-sm ${a.lockedByAdmin ? '' : 'opacity-75'}`}>
                  <input type="checkbox" checked={grantArticleIds.has(a.id)} onChange={() => toggleArticle(a.id)} disabled={!a.lockedByAdmin} className="rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50" />
                  <span className="text-gray-700">{a.title}</span>
                  {!a.lockedByAdmin && <span className="text-gray-400 text-xs">(visible to all)</span>}
                </label>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="flex gap-2">
        <button type="button" onClick={() => onSave(request, fullAccess, Array.from(grantResourceIds), Array.from(grantArticleIds))} disabled={saving} className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm disabled:opacity-50">
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200">Cancel</button>
      </div>
    </div>
  )
}
