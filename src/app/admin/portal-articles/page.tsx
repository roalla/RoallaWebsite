'use client'

import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Lock, Link2 } from 'lucide-react'
import RichTextEditor from '@/components/RichTextEditor'
import { PORTAL_LINK_TYPES, isPortalLinkType } from '@/lib/portal-categories'

interface PortalLink {
  id: string
  title: string
  description: string
  readTime: string | null
  category: string | null
  url: string | null
  sortOrder: number
  gated?: boolean
  lockedByAdmin?: boolean
  trustCategory?: string | null
  canEdit?: boolean
}

export default function AdminPortalLinksPage() {
  const [items, setItems] = useState<PortalLink[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    readTime: '',
    category: 'External' as string,
    url: '',
    sortOrder: 0,
    gated: false,
    lockedByAdmin: false,
    trustCategory: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [canDelete, setCanDelete] = useState(true)

  useEffect(() => {
    fetch('/api/admin/capabilities')
      .then((r) => r.json())
      .then((d) => setCanDelete(d.canDeletePortal !== false))
      .catch(() => setCanDelete(false))
  }, [])

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/portal-articles')
      if (res.ok) setItems(await res.json())
    } catch {
      setError('Failed to load links')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      readTime: '',
      category: 'External',
      url: '',
      sortOrder: items.length,
      gated: false,
      lockedByAdmin: false,
      trustCategory: '',
    })
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/portal-articles/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            readTime: form.readTime || null,
            category: form.category || null,
            url: form.url || null,
            sortOrder: form.sortOrder,
            gated: form.gated,
            lockedByAdmin: form.lockedByAdmin,
            trustCategory: form.trustCategory.trim() || null,
          }),
        })
        if (!res.ok) throw new Error(await res.json().then((d) => d.error))
        await fetchItems()
        resetForm()
      } else {
        const res = await fetch('/api/admin/portal-articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            readTime: form.readTime || null,
            category: form.category || null,
            url: form.url || null,
            sortOrder: form.sortOrder,
            gated: form.gated,
            lockedByAdmin: form.lockedByAdmin,
            trustCategory: form.trustCategory.trim() || null,
          }),
        })
        if (!res.ok) throw new Error(await res.json().then((d) => d.error))
        await fetchItems()
        resetForm()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this link?')) return
    try {
      const res = await fetch(`/api/admin/portal-articles/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchItems()
      else setError('Failed to delete')
    } catch {
      setError('Failed to delete')
    }
  }

  const startEdit = (item: PortalLink) => {
    setForm({
      title: item.title,
      description: item.description,
      readTime: item.readTime || '',
      category: item.category && isPortalLinkType(item.category) ? item.category : 'External',
      url: item.url || '',
      sortOrder: item.sortOrder,
      gated: item.gated ?? false,
      lockedByAdmin: item.lockedByAdmin ?? false,
      trustCategory: item.trustCategory ?? '',
    })
    setEditingId(item.id)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal links</h1>
      <p className="text-gray-600 mb-6">
        Links shown on the Resources Portal: external content (e.g. LinkedIn, other sites) or links to internal tools in this app. Each item should have a destination URL.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-800 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {editingId ? 'Edit link' : 'Add link'}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g. LinkedIn post: 5 Key Metrics"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <RichTextEditor
              value={form.description}
              onChange={(html) => setForm((f) => ({ ...f, description: html }))}
              placeholder="Short summary for the card"
              minHeight="120px"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link type</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {PORTAL_LINK_TYPES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label (optional)</label>
            <input
              type="text"
              value={form.readTime}
              onChange={(e) => setForm((f) => ({ ...f, readTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g. 2 min, Video, Tool"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL</label>
            <input
              type="url"
              required
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="https://... or /internal-tool-path"
            />
            <p className="text-xs text-gray-500 mt-1">External (LinkedIn, other sites) or internal app path (e.g. /schedule, /p/your-page).</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <input
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value, 10) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trust Center badge (optional)</label>
            <input
              type="text"
              value={form.trustCategory}
              onChange={(e) => setForm((f) => ({ ...f, trustCategory: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g. Compliance, Policies, Legal"
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="gated-link"
              checked={form.gated}
              onChange={(e) => setForm((f) => ({ ...f, gated: e.target.checked }))}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="gated-link" className="text-sm font-medium text-gray-700">
              Require NDA + approval (Trust Center gated)
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="lockedByAdmin-link"
              checked={form.lockedByAdmin}
              onChange={(e) => setForm((f) => ({ ...f, lockedByAdmin: e.target.checked }))}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="lockedByAdmin-link" className="text-sm font-medium text-gray-700">
              Lock by default (only visible if user has grant/full access/bundle)
            </label>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? 'Saving...' : editingId ? 'Update' : 'Add link'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-lg font-semibold text-gray-900 mb-3">Current links</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No links yet. Add one above.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                  {(item.category || item.readTime) && (
                    <>
                      {item.category}
                      {item.category && item.readTime && ' · '}
                      {item.readTime}
                    </>
                  )}
                  {item.gated && <span className="inline-flex items-center gap-0.5 text-amber-600"><Lock className="w-3.5 h-3.5" /> Gated</span>}
                  {item.lockedByAdmin && <span className="inline-flex items-center gap-0.5 text-blue-600"><Lock className="w-3.5 h-3.5" /> Locked</span>}
                </div>
                {item.url && (
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Link2 className="w-3 h-3" /> {item.url.startsWith('/') ? 'Internal' : 'External'}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {item.canEdit !== false && (
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="min-w-[44px] min-h-[44px] p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center justify-center"
                    aria-label="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="min-w-[44px] min-h-[44px] p-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
