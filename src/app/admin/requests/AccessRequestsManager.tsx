'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserPlus, Upload, X } from 'lucide-react'
import RequestsTable from './RequestsTable'

type Request = {
  id: string
  email: string
  name: string
  company: string | null
  reason: string | null
  status: string
  token: string
  createdAt: Date
  updatedAt: Date
}

const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: '', label: 'All' },
] as const

export default function AccessRequestsManager({
  requests,
  baseUrl,
  initialTab = 'pending',
}: {
  requests: Request[]
  baseUrl: string
  initialTab?: string
}) {
  const router = useRouter()
  const [tab, setTab] = useState<string>(initialTab)
  useEffect(() => {
    setTab(initialTab)
  }, [initialTab])
  const [addOpen, setAddOpen] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [addForm, setAddForm] = useState({ email: '', name: '', company: '', sendEmail: true })
  const [bulkText, setBulkText] = useState('')
  const [bulkSendEmail, setBulkSendEmail] = useState(true)
  const [addSubmitting, setAddSubmitting] = useState(false)
  const [bulkSubmitting, setBulkSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const filtered = tab ? requests.filter((r) => r.status === tab) : requests

  const refresh = () => {
    setMessage(null)
    router.refresh()
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
      setMessage({ type: 'success', text: `Added ${addForm.email}. ${data.emailSent ? 'Approval email sent.' : ''}` })
      setAddForm({ email: '', name: '', company: '', sendEmail: true })
      setAddOpen(false)
      refresh()
    } catch {
      setMessage({ type: 'error', text: 'Failed to add user' })
    } finally {
      setAddSubmitting(false)
    }
  }

  const parseBulkLine = (line: string): { email: string; name?: string; company?: string } | null => {
    const parts = line.split(',').map((p) => p.trim()).filter(Boolean)
    if (parts.length === 0) return null
    const email = parts[0]
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
    return {
      email,
      name: parts[1],
      company: parts[2],
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
      const { created, updated, skipped } = data.summary || {}
      setMessage({
        type: 'success',
        text: `Done: ${created ?? 0} added, ${updated ?? 0} updated, ${skipped ?? 0} skipped.`,
      })
      setBulkText('')
      setBulkOpen(false)
      refresh()
    } catch {
      setMessage({ type: 'error', text: 'Bulk add failed' })
    } finally {
      setBulkSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Users & access</h1>
      <p className="text-gray-600 mb-6">
        Manage resource portal access: approve or reject requests, add users manually or in bulk, and remove approval when needed.
      </p>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {TABS.map((t) => (
            <Link
              key={t.key || 'all'}
              href={t.key ? `/admin/requests?tab=${t.key}` : '/admin/requests'}
              className={`min-h-[44px] inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${(tab || '') === (t.key || '') ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={(e) => { e.preventDefault(); setTab(t.key) }}
            >
              {t.label}
            </Link>
          ))}
        </div>
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
      </div>

      <RequestsTable
        requests={filtered}
        baseUrl={baseUrl}
        showRevokeForApproved={tab === 'approved'}
        onRevoked={refresh}
      />

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
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company (optional)</label>
                <input
                  type="text"
                  value={addForm.company}
                  onChange={(e) => setAddForm((f) => ({ ...f, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={addForm.sendEmail}
                  onChange={(e) => setAddForm((f) => ({ ...f, sendEmail: e.target.checked }))}
                />
                <span className="text-sm text-gray-700">Send approval email with portal link</span>
              </label>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={addSubmitting}
                  className="min-h-[44px] px-4 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {addSubmitting ? 'Adding…' : 'Add'}
                </button>
                <button type="button" onClick={() => setAddOpen(false)} className="min-h-[44px] px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                  Cancel
                </button>
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
              One user per line. Format: <code className="bg-gray-100 px-1 rounded">email</code> or{' '}
              <code className="bg-gray-100 px-1 rounded">email, name</code> or{' '}
              <code className="bg-gray-100 px-1 rounded">email, name, company</code>
            </p>
            <form onSubmit={handleBulkAdd} className="space-y-4">
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={8}
                placeholder="user@example.com, Jane Doe, Acme Inc"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={bulkSendEmail}
                  onChange={(e) => setBulkSendEmail(e.target.checked)}
                />
                <span className="text-sm text-gray-700">Send approval emails with portal links</span>
              </label>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={bulkSubmitting}
                  className="min-h-[44px] px-4 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {bulkSubmitting ? 'Adding…' : 'Add all'}
                </button>
                <button type="button" onClick={() => setBulkOpen(false)} className="min-h-[44px] px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
