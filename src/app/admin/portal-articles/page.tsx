'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ExternalLink, Lock } from 'lucide-react'
import RichTextEditor from '@/components/RichTextEditor'
import { PORTAL_CATEGORIES, isPortalCategory } from '@/lib/portal-categories'

interface PortalArticle {
  id: string
  title: string
  description: string
  readTime: string | null
  category: string | null
  url: string | null
  sortOrder: number
  gated?: boolean
}

export default function AdminPortalArticlesPage() {
  const [items, setItems] = useState<PortalArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    readTime: '',
    category: 'Other' as string,
    url: '',
    sortOrder: 0,
    gated: false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/portal-articles')
      if (res.ok) setItems(await res.json())
    } catch {
      setError('Failed to load articles')
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
      category: 'Other',
      url: '',
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
    if (!confirm('Delete this article?')) return
    try {
      const res = await fetch(`/api/admin/portal-articles/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchItems()
      else setError('Failed to delete')
    } catch {
      setError('Failed to delete')
    }
  }

  const startEdit = (a: PortalArticle) => {
    setForm({
      title: a.title,
      description: a.description,
      readTime: a.readTime || '',
      category: a.category && isPortalCategory(a.category) ? a.category : 'Other',
      url: a.url || '',
      sortOrder: a.sortOrder,
      gated: a.gated ?? false,
    })
    setEditingId(a.id)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal articles</h1>
      <p className="text-gray-600 mb-6">
        Featured articles shown on the Resources Portal. Optionally add a URL to link to the full article.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-800 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {editingId ? 'Edit article' : 'Add article'}
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
              placeholder="e.g. 5 Key Metrics Every Business Should Track"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Read time</label>
            <input
              type="text"
              value={form.readTime}
              onChange={(e) => setForm((f) => ({ ...f, readTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g. 5 min read"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {PORTAL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Article URL (optional)</label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="https://..."
            />
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
              id="gated-article"
              checked={form.gated}
              onChange={(e) => setForm((f) => ({ ...f, gated: e.target.checked }))}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="gated-article" className="text-sm font-medium text-gray-700">
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
            {saving ? 'Saving...' : editingId ? 'Update' : 'Add article'}
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

      <h2 className="text-lg font-semibold text-gray-900 mb-3">Current articles</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No articles yet. Add one above.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900">{a.title}</div>
                <div className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                  {(a.category || a.readTime) && (
                    <>
                      {a.category}
                      {a.category && a.readTime && ' · '}
                      {a.readTime}
                    </>
                  )}
                  {a.gated && <span className="inline-flex items-center gap-0.5 text-amber-600"><Lock className="w-3.5 h-3.5" /> Gated</span>}
                </div>
                {a.url && (
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> Has link
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(a)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  aria-label="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(a.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
