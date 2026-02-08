'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import RichTextEditor from '@/components/RichTextEditor'

type Agreement = {
  id: string
  title: string
  body: string
  version: string
  effectiveAt: string
} | null

export default function AdminTrustAgreementPage() {
  const [agreement, setAgreement] = useState<Agreement>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: 'Non-Disclosure Agreement', body: '', version: '1.0' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/trust/agreement')
      .then((r) => r.json())
      .then((data) => {
        const a = data.id ? data : null
        setAgreement(a)
        if (a) setForm({ title: a.title, body: a.body, version: a.version })
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setSaving(true)
    try {
      if (agreement) {
        const res = await fetch('/api/admin/trust/agreement', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: agreement.id, ...form }),
        })
        if (!res.ok) throw new Error((await res.json()).error)
        const updated = await res.json()
        setAgreement(updated)
      } else {
        const res = await fetch('/api/admin/trust/agreement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error((await res.json()).error)
        const created = await res.json()
        setAgreement(created)
      }
      setMessage({ type: 'success', text: 'Saved.' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/trust" className="text-sm text-gray-600 hover:text-gray-900">← Trust Center</Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">NDA agreement</h1>
      <p className="text-gray-600 mb-6">
        This text is shown to users when they request access to gated documents. They must accept it before submitting.
      </p>
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input
              type="text"
              value={form.version}
              onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="1.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agreement body (HTML)</label>
            <RichTextEditor
              value={form.body}
              onChange={(html) => setForm((f) => ({ ...f, body: html }))}
              placeholder="Enter the NDA text. Requestors must accept this to request access."
              minHeight="280px"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? 'Saving...' : agreement ? 'Update agreement' : 'Create agreement'}
          </button>
        </div>
      </form>
    </div>
  )
}
