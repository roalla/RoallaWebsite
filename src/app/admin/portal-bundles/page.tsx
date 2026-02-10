'use client'

import React, { useState, useEffect } from 'react'
import { Gift, Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react'

interface BundleItem {
  id: string
  resourceId: string | null
  articleId: string | null
}

interface PortalCodeRow {
  id: string
  code: string
  expiresAt: string | null
  maxRedemptions: number | null
  createdAt: string
  redemptions?: { id: string }[]
}

interface Bundle {
  id: string
  name: string
  createdAt: string
  items: BundleItem[]
  codes: PortalCodeRow[]
}

interface Resource {
  id: string
  title: string
}

interface Article {
  id: string
  title: string
}

export default function AdminPortalBundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingBundleId, setEditingBundleId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [addingCodeBundleId, setAddingCodeBundleId] = useState<string | null>(null)
  const [newCode, setNewCode] = useState('')
  const [newCodeExpires, setNewCodeExpires] = useState('')
  const [newCodeMaxRedemptions, setNewCodeMaxRedemptions] = useState('')

  const fetchBundles = async () => {
    try {
      const res = await fetch('/api/admin/portal-bundles')
      if (res.ok) setBundles(await res.json())
    } catch {
      setError('Failed to load bundles')
    }
  }

  const fetchResourcesAndArticles = async () => {
    try {
      const [rRes, aRes] = await Promise.all([
        fetch('/api/admin/portal-resources'),
        fetch('/api/admin/portal-articles'),
      ])
      if (rRes.ok) setResources((await rRes.json()).map((x: { id: string; title: string }) => ({ id: x.id, title: x.title })))
      if (aRes.ok) setArticles((await aRes.json()).map((x: { id: string; title: string }) => ({ id: x.id, title: x.title })))
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([fetchBundles(), fetchResourcesAndArticles()]).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  const handleCreateBundle = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/admin/portal-bundles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed')
      setNewName('')
      await fetchBundles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteBundle = async (id: string) => {
    if (!confirm('Delete this bundle and its codes? Redemptions will be lost.')) return
    try {
      const res = await fetch(`/api/admin/portal-bundles/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchBundles()
      else setError('Failed to delete')
    } catch {
      setError('Failed to delete')
    }
  }

  const handleAddCode = async (bundleId: string, e: React.FormEvent) => {
    e.preventDefault()
    const code = newCode.trim().toUpperCase()
    if (!code) return
    setError('')
    try {
      const res = await fetch(`/api/admin/portal-bundles/${bundleId}/codes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          expiresAt: newCodeExpires.trim() || null,
          maxRedemptions: newCodeMaxRedemptions.trim() ? parseInt(newCodeMaxRedemptions, 10) : null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed')
      setNewCode('')
      setNewCodeExpires('')
      setNewCodeMaxRedemptions('')
      setAddingCodeBundleId(null)
      await fetchBundles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    }
  }

  const handleDeleteCode = async (codeId: string) => {
    if (!confirm('Delete this code? Users who already redeemed will keep bundle access.')) return
    try {
      const res = await fetch(`/api/admin/portal-codes/${codeId}`, { method: 'DELETE' })
      if (res.ok) await fetchBundles()
      else setError('Failed to delete')
    } catch {
      setError('Failed to delete')
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
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Bundles & codes</h1>
      <p className="text-gray-600 mb-6">
        Create bundles (sets of resources and links) and redemption codes. When a user redeems a code in the portal, they get access to that bundle.
      </p>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-800 text-sm">{error}</div>
      )}

      <form onSubmit={handleCreateBundle} className="flex flex-wrap gap-2 mb-8">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Bundle name (e.g. Post-training Q1 2026)"
          className="px-3 py-2 border border-gray-300 rounded-lg min-w-[200px]"
        />
        <button
          type="submit"
          disabled={creating || !newName.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Create bundle
        </button>
      </form>

      {bundles.length === 0 ? (
        <p className="text-gray-500">No bundles yet. Create one above, then add resources/links and codes.</p>
      ) : (
        <ul className="space-y-6">
          {bundles.map((bundle) => (
            <li key={bundle.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-gray-900">{bundle.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBundleId(editingBundleId === bundle.id ? null : bundle.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    aria-label="Edit bundle"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBundle(bundle.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    aria-label="Delete bundle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {editingBundleId === bundle.id && (
                <BundleEditForm
                  bundle={bundle}
                  resources={resources}
                  articles={articles}
                  onSave={async (name, resourceIds, articleIds) => {
                    setSaving(true)
                    setError('')
                    try {
                      const res = await fetch(`/api/admin/portal-bundles/${bundle.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, resourceIds, articleIds }),
                      })
                      if (!res.ok) throw new Error('Update failed')
                      await fetchBundles()
                      setEditingBundleId(null)
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Update failed')
                    } finally {
                      setSaving(false)
                    }
                  }}
                  onCancel={() => setEditingBundleId(null)}
                  saving={saving}
                />
              )}
              <div className="px-4 pb-4">
                <div className="text-sm text-gray-600 mb-2">
                  Items in bundle: {bundle.items.filter((i) => i.resourceId).length} resources, {bundle.items.filter((i) => i.articleId).length} links
                </div>
                <div className="text-sm font-medium text-gray-700 mb-1">Codes</div>
                <ul className="space-y-1 mb-2">
                  {bundle.codes.length === 0 ? (
                    <li className="text-gray-500 text-sm">No codes yet.</li>
                  ) : (
                    bundle.codes.map((c) => (
                      <li key={c.id} className="flex items-center justify-between gap-2 py-1">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">{c.code}</span>
                        <span className="text-gray-500 text-xs">
                          {c.redemptions?.length ?? 0} redemptions
                          {c.expiresAt && ` · expires ${new Date(c.expiresAt).toLocaleDateString()}`}
                          {c.maxRedemptions != null && ` · max ${c.maxRedemptions}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCode(c.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          aria-label="Delete code"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))
                  )}
                </ul>
                {addingCodeBundleId === bundle.id ? (
                  <form onSubmit={(e) => handleAddCode(bundle.id, e)} className="flex flex-wrap gap-2 mt-2">
                    <input
                      type="text"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                      placeholder="e.g. ROALLA-TRAIN-2026"
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="datetime-local"
                      value={newCodeExpires}
                      onChange={(e) => setNewCodeExpires(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      min={1}
                      value={newCodeMaxRedemptions}
                      onChange={(e) => setNewCodeMaxRedemptions(e.target.value)}
                      placeholder="Max redemptions"
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <button type="submit" className="px-2 py-1 bg-primary text-white rounded text-sm">Add</button>
                    <button type="button" onClick={() => { setAddingCodeBundleId(null); setNewCode(''); setNewCodeExpires(''); setNewCodeMaxRedemptions('') }} className="px-2 py-1 bg-gray-100 rounded text-sm">Cancel</button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAddingCodeBundleId(bundle.id)}
                    className="text-sm text-primary hover:underline"
                  >
                    + Add code
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

function BundleEditForm({
  bundle,
  resources,
  articles,
  onSave,
  onCancel,
  saving,
}: {
  bundle: Bundle
  resources: Resource[]
  articles: Article[]
  onSave: (name: string, resourceIds: string[], articleIds: string[]) => void
  onCancel: () => void
  saving: boolean
}) {
  const [name, setName] = useState(bundle.name)
  const [resourceIds, setResourceIds] = useState<Set<string>>(
    new Set(bundle.items.filter((i) => i.resourceId).map((i) => i.resourceId!))
  )
  const [articleIds, setArticleIds] = useState<Set<string>>(
    new Set(bundle.items.filter((i) => i.articleId).map((i) => i.articleId!))
  )

  const toggleResource = (id: string) => {
    setResourceIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const toggleArticle = (id: string) => {
    setArticleIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bundle name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Resources</label>
        <div className="flex flex-wrap gap-2">
          {resources.map((r) => (
            <label key={r.id} className="inline-flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                checked={resourceIds.has(r.id)}
                onChange={() => toggleResource(r.id)}
                className="rounded border-gray-300 text-primary"
              />
              {r.title}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Links</label>
        <div className="flex flex-wrap gap-2">
          {articles.map((a) => (
            <label key={a.id} className="inline-flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                checked={articleIds.has(a.id)}
                onChange={() => toggleArticle(a.id)}
                className="rounded border-gray-300 text-primary"
              />
              {a.title}
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onSave(name, Array.from(resourceIds), Array.from(articleIds))}
          disabled={saving}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm">
          Cancel
        </button>
      </div>
    </div>
  )
}
