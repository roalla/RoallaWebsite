'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/components/Toast'
import { Unlock, Lock, Loader2, UserPlus, Upload, X, CheckCircle, XCircle } from 'lucide-react'

const BULK_ADD_MAX = 100

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
  const toast = useToast()
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
  const [approveModalRequest, setApproveModalRequest] = useState<AccessRequestRow | null>(null)
  const [approveOptions, setApproveOptions] = useState({ fullAccess: false, sendEmail: true })
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const bulkButtonRef = useRef<HTMLButtonElement>(null)
  const addModalRef = useRef<HTMLDivElement>(null)
  const bulkModalRef = useRef<HTMLDivElement>(null)
  const addModalFirstInputRef = useRef<HTMLInputElement>(null)
  const bulkModalFirstInputRef = useRef<HTMLTextAreaElement>(null)
  const approveModalRef = useRef<HTMLDivElement>(null)

  const focusTrap = (e: KeyboardEvent, container: HTMLElement | null) => {
    if (e.key !== 'Tab' || !container || !document.activeElement || !container.contains(document.activeElement)) return
    const focusable = container.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])')
    const list = Array.from(focusable)
    if (list.length === 0) return
    const first = list[0]
    const last = list[list.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
  }

  useEffect(() => {
    if (!addOpen) return
    const el = addModalRef.current
    const onKeyDown = (e: KeyboardEvent) => focusTrap(e, el)
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [addOpen])

  useEffect(() => {
    if (!bulkOpen) return
    const el = bulkModalRef.current
    const onKeyDown = (e: KeyboardEvent) => focusTrap(e, el)
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [bulkOpen])

  useEffect(() => {
    if (!approveModalRequest) return
    const el = approveModalRef.current
    const onKeyDown = (e: KeyboardEvent) => focusTrap(e, el)
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [approveModalRequest])

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

  useEffect(() => {
    if (addOpen) {
      const t = setTimeout(() => addModalFirstInputRef.current?.focus(), 0)
      return () => clearTimeout(t)
    }
  }, [addOpen])

  useEffect(() => {
    if (bulkOpen) {
      const t = setTimeout(() => bulkModalFirstInputRef.current?.focus(), 0)
      return () => clearTimeout(t)
    }
  }, [bulkOpen])

  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(null), 5000)
    return () => clearTimeout(t)
  }, [message])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (approveModalRequest) setApproveModalRequest(null)
      else if (bulkOpen) setBulkOpen(false)
      else if (addOpen) setAddOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [addOpen, bulkOpen, approveModalRequest])

  const setTabAndUrl = (newTab: string) => {
    setTab(newTab)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', newTab)
    window.history.replaceState({}, '', url.pathname + url.search)
  }

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

  const handleApprove = async (req: AccessRequestRow, fullAccess: boolean, sendEmail: boolean) => {
    setApprovingId(req.id)
    setError('')
    setApproveModalRequest(null)
    try {
      const res = await fetch(`/api/admin/requests/${req.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullAccess, grantResourceIds: [], grantArticleIds: [], sendEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Approve failed')
      setMessage({ type: 'success', text: `Approved ${req.email}. ${data.emailSent ? 'Email sent.' : ''} Access: ${fullAccess ? 'full' : 'public files only'}.` })
      toast?.success(`Approved ${req.email}`)
      router.refresh()
      fetchData()
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Approve failed'
      setError(msg)
      toast?.error(msg)
    } finally {
      setApprovingId(null)
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm('Reject this request? The person will not be able to access the portal.')) return
    setRejectingId(id)
    try {
      const res = await fetch(`/api/admin/requests/${id}/reject`, { method: 'POST' })
      if (res.ok) {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)))
        toast?.success('Request rejected')
      }
    } finally {
      setRejectingId(null)
    }
  }

  const handleRevoke = async (id: string) => {
    if (!confirm('Remove this user’s portal access? They will no longer be able to use the portal.')) return
    setRevokingId(id)
    try {
      const res = await fetch(`/api/admin/requests/${id}/revoke`, { method: 'POST' })
      if (res.ok) {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)))
        fetchData()
        toast?.success('Access revoked')
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
      } else {
        setMessage({ type: 'success', text: `Added ${addForm.email}. ${data.emailSent ? 'Email sent. ' : ''}Default: public files only.` })
        toast?.success(`Added ${addForm.email}`)
        setAddForm({ email: '', name: '', company: '', sendEmail: true })
        setAddOpen(false)
        await fetchData()
        if (data.requestId) {
          setTabAndUrl('approved')
          setExpandedId(data.requestId)
        }
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to add user' })
    } finally {
      setAddSubmitting(false)
    }
  }

  const BULK_CONFIRM_THRESHOLD = 15

  const handleBulkAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean)
    const users = lines.map(parseBulkLine).filter((u): u is { email: string; name?: string; company?: string } => u !== null)
    if (users.length === 0) {
      setMessage({ type: 'error', text: 'Enter at least one valid line (email or email, name or email, name, company)' })
      return
    }
    if (users.length > BULK_ADD_MAX) {
      setMessage({ type: 'error', text: `Bulk add is limited to ${BULK_ADD_MAX} users per request. You have ${users.length} valid lines.` })
      return
    }
    if (users.length >= BULK_CONFIRM_THRESHOLD && !window.confirm(`You're about to add ${users.length} users. Continue?`)) {
      return
    }
    setBulkSubmitting(true)
    try {
      const res = await fetch('/api/admin/requests/bulk-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users, sendEmail: bulkSendEmail }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Bulk add failed' })
      } else {
        const { created = 0, updated = 0, skipped = 0 } = data.summary || {}
        setMessage({ type: 'success', text: `Done: ${created} added, ${updated} updated, ${skipped} skipped. Default: public files only.` })
        setBulkText('')
        setBulkOpen(false)
        fetchData()
      }
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

  const pendingCount = requests.filter((r) => r.status === 'pending').length
  const approvedCount = requests.filter((r) => r.status === 'approved').length
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length

  const formatRequestDate = (iso: string | undefined) => {
    if (!iso) return ''
    const d = new Date(iso)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
  }

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link href="/admin/portal" className="hover:text-gray-700">Portal</Link>
        <span aria-hidden>/</span>
        <span className="text-gray-900 font-medium">Portal access</span>
      </nav>
      <Link href="/admin/portal" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
        ← Back to Portal
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal access</h1>
      <p className="text-gray-600 mb-6">
        Who can use the Resources Portal and what they see: approve or reject requests, add users, then set <strong>Full access</strong> or <strong>Select items</strong> (default: public files only). Lock items in Portal content to restrict them, then grant per user below.
      </p>

      {(error || message) && (
        <div
          role="alert"
          className={`mb-4 p-3 rounded-lg text-sm flex items-center justify-between gap-2 ${message ? (message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800') : 'bg-red-50 text-red-800'}`}
        >
          <span>{message ? message.text : error}</span>
          <button
            type="button"
            onClick={() => { setMessage(null); setError('') }}
            className="shrink-0 p-1 rounded hover:bg-black/10"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-6">
        {isAdmin && TABS.map((t) => {
          const count = t.key === 'pending' ? pendingCount : t.key === 'approved' ? approvedCount : rejectedCount
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTabAndUrl(t.key)}
              className={`min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${tab === t.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {t.label}
              <span className={tab === t.key ? 'text-white/90' : 'text-gray-500'}>({count})</span>
            </button>
          )
        })}
        {!isAdmin && <span className="text-sm text-gray-500">Approved users</span>}
        {isAdmin && (
          <div className="flex gap-2 ml-auto">
            <button
              ref={addButtonRef}
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
            >
              <UserPlus className="w-4 h-4" />
              Add user
            </button>
            <button
              ref={bulkButtonRef}
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
                {req.createdAt && (
                  <div className="text-xs text-gray-400 mt-0.5">Requested {formatRequestDate(req.createdAt)}</div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setApproveModalRequest(req); setApproveOptions({ fullAccess: false, sendEmail: true }) }}
                  disabled={approvingId === req.id}
                  className="inline-flex items-center gap-1 min-h-[44px] px-4 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:opacity-50"
                >
                  {approvingId === req.id ? '…' : <><CheckCircle className="w-4 h-4" /> Approve</>}
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
                {req.createdAt && (
                  <div className="text-xs text-gray-400 mt-0.5">Requested {formatRequestDate(req.createdAt)}</div>
                )}
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
                      {req.createdAt && (
                        <div className="text-xs text-gray-400 mt-0.5">Added {formatRequestDate(req.createdAt)}</div>
                      )}
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-user-title"
        >
          <div ref={addModalRef} className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 id="add-user-title" className="text-lg font-semibold text-gray-900">Add user</h2>
              <button type="button" onClick={() => { setAddOpen(false); addButtonRef.current?.focus() }} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input ref={addModalFirstInputRef} type="email" required value={addForm.email} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" aria-required="true" />
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
                <button type="button" onClick={() => { setAddOpen(false); addButtonRef.current?.focus() }} className="min-h-[44px] px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {bulkOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bulk-add-title"
        >
          <div ref={bulkModalRef} className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 id="bulk-add-title" className="text-lg font-semibold text-gray-900">Bulk add users</h2>
              <button type="button" onClick={() => { setBulkOpen(false); bulkButtonRef.current?.focus() }} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              One per line (max {BULK_ADD_MAX}): <code className="bg-gray-100 px-1 rounded">email</code> or <code className="bg-gray-100 px-1 rounded">email, name</code> or <code className="bg-gray-100 px-1 rounded">email, name, company</code>. Default: public files only.
            </p>
            <form onSubmit={handleBulkAdd} className="space-y-4">
              <textarea ref={bulkModalFirstInputRef} value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={8} placeholder="user@example.com, Jane Doe, Acme Inc" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm" aria-label="User list" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={bulkSendEmail} onChange={(e) => setBulkSendEmail(e.target.checked)} />
                <span className="text-sm text-gray-700">Send approval emails</span>
              </label>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={bulkSubmitting} className="min-h-[44px] px-4 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50">
                  {bulkSubmitting ? 'Adding…' : 'Add all'}
                </button>
                <button type="button" onClick={() => { setBulkOpen(false); bulkButtonRef.current?.focus() }} className="min-h-[44px] px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {approveModalRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="approve-modal-title"
        >
          <div ref={approveModalRef} className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 id="approve-modal-title" className="text-lg font-semibold text-gray-900 mb-2">Approve access</h2>
            <p className="text-sm text-gray-600 mb-4">{approveModalRequest.email} — {approveModalRequest.name}</p>
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={approveOptions.fullAccess}
                  onChange={(e) => setApproveOptions((o) => ({ ...o, fullAccess: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Full access (see all content including locked items)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={approveOptions.sendEmail}
                  onChange={(e) => setApproveOptions((o) => ({ ...o, sendEmail: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Send approval email with portal link</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mb-4">If you leave Full access unchecked, they get public files only. You can change this later in Approved.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleApprove(approveModalRequest, approveOptions.fullAccess, approveOptions.sendEmail)}
                disabled={approvingId === approveModalRequest.id}
                className="min-h-[44px] px-4 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
              >
                {approvingId === approveModalRequest.id ? '…' : 'Approve'}
              </button>
              <button type="button" onClick={() => setApproveModalRequest(null)} className="min-h-[44px] px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">Cancel</button>
            </div>
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
            By default users see public files only. Check boxes to grant this user access to <strong>locked</strong> items. Lock items in Portal content first to restrict them.
          </p>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Resources</div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {resources.length === 0 ? (
                <span className="text-gray-500 text-sm">
                  No resources yet.{' '}
                  <Link href="/admin/portal" className="text-primary font-medium hover:underline">Add in Portal</Link>
                </span>
              ) : resources.map((r) => (
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
              {articles.length === 0 ? (
                <span className="text-gray-500 text-sm">
                  No links yet.{' '}
                  <Link href="/admin/portal" className="text-primary font-medium hover:underline">Add in Portal</Link>
                </span>
              ) : articles.map((a) => (
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
