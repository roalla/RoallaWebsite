'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { Check, X, Lock, Copy, Send } from 'lucide-react'

type RequestItem = {
  id: string
  email: string
  name: string
  company: string | null
  status: string
  createdAt: string
  reviewedAt: string | null
  ndaSignature: { signedAt: string; name: string }
  items: { resourceId: string | null; articleId: string | null }[]
}

export default function AdminTrustRequestsPage() {
  const searchParams = useSearchParams()
  const initialStatus = useMemo(() => {
    const s = searchParams.get('status')
    return (s === 'pending' || s === 'approved' || s === 'rejected' || s === 'all') ? s : 'pending'
  }, [searchParams])
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState<string | null>(null)
  const [accessLink, setAccessLink] = useState<{ id: string; link: string; emailSent?: boolean } | null>(null)
  const [sendEmail, setSendEmail] = useState(true)
  const [sendRejectEmail, setSendRejectEmail] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>(initialStatus)
  const [search, setSearch] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [rejectModal, setRejectModal] = useState<{ id: string } | { ids: string[] } | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [bulkRejectSendEmail, setBulkRejectSendEmail] = useState(false)

  const fetchRequests = (append = false) => {
    if (!append) setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (search.trim()) params.set('search', search.trim())
    const off = append ? offset : 0
    params.set('limit', '50')
    params.set('offset', String(off))
    fetch('/api/admin/trust/requests?' + params.toString())
      .then((r) => r.json())
      .then((data) => {
        const list = data.requests ?? []
        if (append) setRequests((prev) => [...prev, ...list])
        else setRequests(list)
        setHasMore(data.hasMore === true)
        setOffset(off + list.length)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setStatusFilter(initialStatus)
  }, [initialStatus])

  useEffect(() => {
    setOffset(0)
    setSelectedIds(new Set())
    fetchRequests()
  }, [statusFilter, search])

  const handleApprove = async (id: string) => {
    setActingId(id)
    setAccessLink(null)
    try {
      const res = await fetch(`/api/admin/trust/requests/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sendEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAccessLink({ id, link: data.accessLink, emailSent: data.emailSent })
      fetchRequests()
    } catch {
      alert('Failed to approve')
    } finally {
      setActingId(null)
    }
  }

  const openRejectModal = (id: string) => setRejectModal({ id })
  const openBulkRejectModal = () => {
    if (selectedIds.size === 0) return
    setRejectModal({ ids: Array.from(selectedIds) })
    setRejectReason('')
  }

  const submitReject = async () => {
    if (!rejectModal) return
    const isBulk = 'ids' in rejectModal
    const ids = isBulk ? rejectModal.ids : [rejectModal.id]
    setActingId(ids[0])
    try {
      if (isBulk) {
        const res = await fetch('/api/admin/trust/requests/bulk-reject', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids, reason: rejectReason || undefined, sendEmail: bulkRejectSendEmail }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setSelectedIds(new Set())
        setRejectModal(null)
        setRejectReason('')
        fetchRequests()
      } else {
        const res = await fetch(`/api/admin/trust/requests/${rejectModal.id}/reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sendEmail: sendRejectEmail, reason: rejectReason || undefined }),
        })
        if (!res.ok) throw new Error((await res.json()).error)
        setRejectModal(null)
        setRejectReason('')
        fetchRequests()
      }
    } catch {
      alert('Failed to reject')
    } finally {
      setActingId(null)
    }
  }

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return
    setActingId('bulk')
    try {
      const res = await fetch('/api/admin/trust/requests/bulk-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds), sendEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSelectedIds(new Set())
      fetchRequests()
      toast.success(`Approved ${data.succeeded} of ${data.total} request(s).`)
    } catch {
      alert('Bulk approve failed')
    } finally {
      setActingId(null)
    }
  }

  const handleResendLink = async (id: string) => {
    setActingId(id)
    try {
      const res = await fetch(`/api/admin/trust/requests/${id}/resend-link`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAccessLink({ id, link: data.accessLink, emailSent: data.emailSent })
      fetchRequests()
    } catch {
      alert('Failed to resend link')
    } finally {
      setActingId(null)
    }
  }

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast.success('Link copied to clipboard')
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const toggleSelectAllPending = () => {
    const pending = requests.filter((r) => r.status === 'pending')
    if (selectedIds.size >= pending.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(pending.map((r) => r.id)))
  }

  const exportCsv = () => {
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (search.trim()) params.set('search', search.trim())
    window.open('/api/admin/trust/requests/export?' + params.toString(), '_blank')
  }

  const pendingCount = requests.filter((r) => r.status === 'pending').length

  if (loading && requests.length === 0) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/trust" className="text-sm text-gray-600 hover:text-gray-900">← Trust Center</Link>
        </div>
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-4" />
        <div className="h-4 bg-gray-100 rounded w-96 animate-pulse mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded bg-gray-200 animate-pulse flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-48 animate-pulse mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-64 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-32 mt-2 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/trust" className="text-sm text-gray-600 hover:text-gray-900">← Trust Center</Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Gated access requests</h1>
      <p className="text-gray-600 mb-4">
        Requests that have signed the NDA. Approve to create access grants and generate a link to share with the requestor.
      </p>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatusFilter(tab)}
            className={`text-sm font-medium capitalize min-h-[44px] px-4 py-2 rounded-lg ${statusFilter === tab ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {tab}
          </button>
        ))}
        <input
          type="search"
          placeholder="Search by email or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-auto sm:ml-auto min-w-0 sm:min-w-[200px] min-h-[44px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <button
          type="button"
          onClick={exportCsv}
          className="min-h-[44px] px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Export CSV
        </button>
      </div>
      {statusFilter === 'pending' && pendingCount > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={selectedIds.size === pendingCount && pendingCount > 0}
              onChange={toggleSelectAllPending}
              className="rounded border-gray-300"
            />
            Select all pending
          </label>
          <button
            type="button"
            onClick={handleBulkApprove}
            disabled={actingId !== null || selectedIds.size === 0}
            className="min-h-[44px] px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Approve selected ({selectedIds.size})
          </button>
          <button
            type="button"
            onClick={openBulkRejectModal}
            disabled={selectedIds.size === 0}
            className="min-h-[44px] px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Reject selected ({selectedIds.size})
          </button>
        </div>
      )}
      <label className="flex items-center gap-2 text-sm text-gray-700 mb-2 cursor-pointer">
        <input
          type="checkbox"
          checked={sendEmail}
          onChange={(e) => setSendEmail(e.target.checked)}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        Email the requestor with the access link when approving (requires RESEND_API_KEY)
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-700 mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={sendRejectEmail}
          onChange={(e) => setSendRejectEmail(e.target.checked)}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        Email the requestor when rejecting (optional, requires RESEND_API_KEY)
      </label>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {requests.length === 0 ? (
          <p className="p-6 text-gray-500">No requests yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {requests.map((r) => (
              <li key={r.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-2">
                    {r.status === 'pending' && (
                      <input
                        type="checkbox"
                        checked={selectedIds.has(r.id)}
                        onChange={() => toggleSelect(r.id)}
                        className="mt-1 rounded border-gray-300"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{r.name}</p>
                      <p className="text-sm text-gray-500">{r.email}</p>
                      {r.company && <p className="text-sm text-gray-500">{r.company}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        Signed NDA {new Date(r.ndaSignature.signedAt).toLocaleString()} · Requested {new Date(r.createdAt).toLocaleString()}
                      </p>
                      {r.status === 'approved' && r.reviewedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Access until {new Date(new Date(r.reviewedAt).getTime() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()} · Link expires {new Date(new Date(r.reviewedAt).getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      )}
                      {r.items.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {r.items.length} gated item(s) requested
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      r.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      r.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {r.status}
                    </span>
                    {r.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApprove(r.id)}
                          disabled={actingId !== null}
                          className="inline-flex items-center gap-1 min-h-[44px] px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => openRejectModal(r.id)}
                          disabled={actingId !== null}
                          className="inline-flex items-center gap-1 min-h-[44px] px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </>
                    )}
                    {r.status === 'approved' && (
                      <button
                        type="button"
                        onClick={() => handleResendLink(r.id)}
                        disabled={actingId !== null}
                        className="inline-flex items-center gap-1 min-h-[44px] px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" /> Resend link
                      </button>
                    )}
                  </div>
                </div>
                {accessLink?.id === r.id && accessLink.link && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg space-y-2">
                    {accessLink.emailSent && (
                      <p className="text-sm text-green-800 font-medium">An email with the access link has been sent to the requestor.</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-green-800 font-medium">Access link:</span>
                      <code className="text-sm text-green-900 break-all flex-1 min-w-0">{accessLink.link}</code>
                      <button
                        type="button"
                        onClick={() => copyLink(accessLink.link)}
                        className="inline-flex items-center gap-1 min-h-[44px] px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        {hasMore && (
          <div className="p-4 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={() => fetchRequests(true)}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-primary hover:underline disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </div>

      {rejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="reject-modal-title"
          onKeyDown={(e) => { if (e.key === 'Escape') setRejectModal(null) }}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 id="reject-modal-title" className="text-lg font-semibold text-gray-900 mb-2">
              {'ids' in rejectModal ? `Reject ${rejectModal.ids.length} request(s)?` : 'Reject request?'}
            </h3>
            <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Reason (optional, included in email)</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="e.g. Incomplete company information"
            />
            {'ids' in rejectModal ? (
              <label className="flex items-center gap-2 text-sm text-gray-700 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bulkRejectSendEmail}
                  onChange={(e) => setBulkRejectSendEmail(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Email all requestors when rejecting
              </label>
            ) : null}
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => { setRejectModal(null); setRejectReason('') }}
                className="flex-1 min-h-[44px] px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReject}
                className="flex-1 min-h-[44px] px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
