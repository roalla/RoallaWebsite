'use client'

import React, { useState } from 'react'
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react'

type Request = {
  id: string
  email: string
  name: string
  company: string | null
  reason: string | null
  status: string
  token: string
  createdAt: Date
}

export default function RequestsTable({
  requests,
  baseUrl,
  showRevokeForApproved,
  onRevoked,
}: {
  requests: Request[]
  baseUrl: string
  showRevokeForApproved?: boolean
  onRevoked?: () => void
}) {
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [localRequests, setLocalRequests] = useState(requests)

  const handleReject = async (id: string) => {
    setRejectingId(id)
    try {
      const res = await fetch(`/api/admin/requests/${id}/reject`, { method: 'POST' })
      if (res.ok) {
        setLocalRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)))
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
        setLocalRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)))
        onRevoked?.()
      }
    } finally {
      setRevokingId(null)
    }
  }

  if (localRequests.length === 0) {
    return (
      <p className="text-gray-500 py-8">No access requests match the current filter.</p>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Company</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {localRequests.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 text-gray-900">{r.name}</td>
                <td className="py-3 px-4 text-gray-600">{r.email}</td>
                <td className="py-3 px-4 text-gray-600">{r.company || '—'}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      r.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : r.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {r.status === 'approved' && <CheckCircle className="w-3.5 h-3.5" />}
                    {r.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                    {r.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500 text-sm">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-right">
                  {r.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`${baseUrl}/api/resources/approve?requestId=${r.id}&token=${r.token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
                      >
                        Approve
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleReject(r.id)}
                        disabled={rejectingId === r.id}
                        className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        {rejectingId === r.id ? '…' : 'Reject'}
                      </button>
                    </div>
                  )}
                  {showRevokeForApproved && r.status === 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleRevoke(r.id)}
                      disabled={revokingId === r.id}
                      className="text-sm font-medium text-amber-600 hover:text-amber-700 disabled:opacity-50"
                    >
                      {revokingId === r.id ? '…' : 'Remove approval'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
