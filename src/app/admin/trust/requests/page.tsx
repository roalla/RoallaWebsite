'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, X, Lock, Copy } from 'lucide-react'

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
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState<string | null>(null)
  const [accessLink, setAccessLink] = useState<{ id: string; link: string; emailSent?: boolean } | null>(null)
  const [sendEmail, setSendEmail] = useState(true)

  const fetchRequests = () => {
    fetch('/api/admin/trust/requests')
      .then((r) => r.json())
      .then(setRequests)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchRequests()
  }, [])

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

  const handleReject = async (id: string) => {
    if (!confirm('Reject this request?')) return
    setActingId(id)
    try {
      const res = await fetch(`/api/admin/trust/requests/${id}/reject`, { method: 'POST' })
      if (!res.ok) throw new Error((await res.json()).error)
      fetchRequests()
    } catch {
      alert('Failed to reject')
    } finally {
      setActingId(null)
    }
  }

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link)
  }

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/trust" className="text-sm text-gray-600 hover:text-gray-900">← Trust Center</Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Gated access requests</h1>
      <p className="text-gray-600 mb-4">
        Requests that have signed the NDA. Approve to create access grants and generate a link to share with the requestor.
      </p>
      <label className="flex items-center gap-2 text-sm text-gray-700 mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={sendEmail}
          onChange={(e) => setSendEmail(e.target.checked)}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        Email the requestor with the access link when approving (requires RESEND_API_KEY)
      </label>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {requests.length === 0 ? (
          <p className="p-6 text-gray-500">No requests yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {requests.map((r) => (
              <li key={r.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900">{r.name}</p>
                    <p className="text-sm text-gray-500">{r.email}</p>
                    {r.company && <p className="text-sm text-gray-500">{r.company}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      Signed NDA {new Date(r.ndaSignature.signedAt).toLocaleString()} · Requested {new Date(r.createdAt).toLocaleString()}
                    </p>
                    {r.items.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {r.items.length} gated item(s) requested
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(r.id)}
                          disabled={actingId !== null}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </>
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
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
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
      </div>
    </div>
  )
}
