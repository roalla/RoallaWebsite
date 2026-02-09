'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ExternalLink, Download, Lock } from 'lucide-react'
import RichTextEditor from '@/components/RichTextEditor'
import { PORTAL_CATEGORIES, isPortalCategory } from '@/lib/portal-categories'

interface PortalResource {
  id: string
  title: string
  description: string
  type: string
  downloadUrl: string | null
  linkUrl: string | null
  color: string
  sortOrder: number
  gated?: boolean
  canEdit?: boolean
}

const RESOURCE_CATEGORIES = PORTAL_CATEGORIES

const COLOR_OPTIONS = [
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
  'from-purple-500 to-purple-600',
  'from-orange-500 to-orange-600',
  'from-teal-500 to-teal-600',
  'from-rose-500 to-rose-600',
]

export default function AdminPortalResourcesPage() {
  const [items, setItems] = useState<PortalResource[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'Other',
    downloadUrl: '',
    linkUrl: '',
    color: 'from-blue-500 to-blue-600',
    sortOrder: 0,
    gated: false,
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
      const res = await fetch('/api/admin/portal-resources')
      if (res.ok) setItems(await res.json())
    } catch {
      setError('Failed to load tiles')
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
      type: 'Other',
      downloadUrl: '',
      linkUrl: '',
      color: 'from-blue-500 to-blue-600',
      sortOrder: items.length,
      gated: false,
    })
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/portal-resources/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            type: form.type,
            downloadUrl: form.downloadUrl || null,
            linkUrl: form.linkUrl || null,
            color: form.color,
            sortOrder: form.sortOrder,
            gated: form.gated,
          }),
        })
        if (!res.ok) throw new Error(await res.json().then((d) => d.error))
        await fetchItems()
        resetForm()
      } else {
        const res = await fetch('/api/admin/portal-resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            type: form.type,
            downloadUrl: form.downloadUrl || null,
            linkUrl: form.linkUrl || null,
            color: form.color,
            sortOrder: form.sortOrder,
            gated: form.gated,
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
    if (!confirm('Delete this tile?')) return
    try {
      const res = await fetch(`/api/admin/portal-resources/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchItems()
      else setError('Failed to delete')
    } catch {
      setError('Failed to delete')
    }
  }

  const startEdit = (r: PortalResource) => {
    setForm({
      title: r.title,
      description: r.description,
      type: isPortalCategory(r.type) ? r.type : 'Other',
      downloadUrl: r.downloadUrl || '',
      linkUrl: r.linkUrl || '',
      color: r.color,
      sortOrder: r.sortOrder,
      gated: r.gated ?? false,
    })
    setEditingId(r.id)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal tiles (downloadable resources)</h1>
      <p className="text-gray-600 mb-6">
        These tiles appear on the Resources Portal. Add a download URL (path or link to a file) or a link URL (e.g. to an app). At least one is recommended.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-800 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {editingId ? 'Edit tile' : 'Add tile'}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g. Business Growth Guide"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              required
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {RESOURCE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <RichTextEditor
              value={form.description}
              onChange={(html) => setForm((f) => ({ ...f, description: html }))}
              placeholder="Short description for the tile"
              minHeight="120px"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Download URL</label>
            <input
              type="text"
              value={form.downloadUrl}
              onChange={(e) => setForm((f) => ({ ...f, downloadUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="/resources/file.pdf or https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (e.g. app)</label>
            <input
              type="text"
              value={form.linkUrl}
              onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tile color</label>
            <select
              value={form.color}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {COLOR_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c.replace('from-', '').replace('-500 to-', ' → ').replace('-600', '')}
                </option>
              ))}
            </select>
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
          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="gated"
              checked={form.gated}
              onChange={(e) => setForm((f) => ({ ...f, gated: e.target.checked }))}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="gated" className="text-sm font-medium text-gray-700">
              Require NDA + approval (Trust Center gated)
            </label>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? 'Saving...' : editingId ? 'Update' : 'Add tile'}
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

      <h2 className="text-lg font-semibold text-gray-900 mb-3">Current tiles</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No tiles yet. Add one above.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900">{r.title}</div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  {r.type}
                  {r.gated && <span className="inline-flex items-center gap-0.5 text-amber-600"><Lock className="w-3.5 h-3.5" /> Gated</span>}
                </div>
                {(r.downloadUrl || r.linkUrl) && (
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                    {r.downloadUrl && (
                      <span className="inline-flex items-center gap-1">
                        <Download className="w-3 h-3" /> Download
                      </span>
                    )}
                    {r.linkUrl && (
                      <span className="inline-flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> Link
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {r.canEdit !== false && (
                  <button
                    type="button"
                    onClick={() => startEdit(r)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    aria-label="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
