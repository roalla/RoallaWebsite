'use client'

import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, UserPlus, ExternalLink, Linkedin, Building2 } from 'lucide-react'

interface TrustedContactItem {
  id: string
  organizationId: string
  organizationName?: string
  organizationSlug?: string | null
  name: string
  email: string
  company: string | null
  serviceOrRole: string | null
  url: string | null
  linkedInUrl: string | null
  notes: string | null
  createdByUserId: string | null
  createdAt: string
  updatedAt: string
}

interface OrganizationOption {
  id: string
  name: string
  slug: string | null
}

export default function AdminTrustedContactsPage() {
  const [contacts, setContacts] = useState<TrustedContactItem[]>([])
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [orgFilter, setOrgFilter] = useState<string>('') // slug for admins
  const [isAdmin, setIsAdmin] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    serviceOrRole: '',
    url: '',
    linkedInUrl: '',
    notes: '',
    organizationId: '' as string,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showAddOrg, setShowAddOrg] = useState(false)
  const [newOrg, setNewOrg] = useState({ name: '', slug: '' })
  const [savingOrg, setSavingOrg] = useState(false)

  const fetchOrganizations = () =>
    fetch('/api/admin/organizations')
      .then((r) => (r.ok ? r.json() : []))
      .then(setOrganizations)
      .catch(() => setOrganizations([]))

  const fetchContacts = () => {
    const url = orgFilter ? `/api/admin/trusted-contacts?org=${encodeURIComponent(orgFilter)}` : '/api/admin/trusted-contacts'
    return fetch(url).then(async (res) => {
      if (res.ok) return res.json()
      if (res.status === 401) {
        setError('Please sign in again to view trusted contacts.')
        return []
      }
      if (res.status === 403) {
        setError('You don’t have access to trusted contacts.')
        return []
      }
      return []
    }).then(setContacts)
  }

  useEffect(() => {
    let cancelled = false
    setError('')
    Promise.all([
      fetchContacts(),
      fetch('/api/admin/capabilities').then((r) => r.json()).then((d) => {
        if (!cancelled) setIsAdmin(d.isAdmin === true)
      }),
    ])
      .then(() => {
        if (!cancelled) setLoading(false)
      })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [orgFilter])

  useEffect(() => {
    if (!isAdmin) return
    fetchOrganizations()
  }, [isAdmin])

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = newOrg.name.trim()
    if (!name) {
      setError('Organization name is required.')
      return
    }
    setError('')
    setSavingOrg(true)
    try {
      const res = await fetch('/api/admin/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug: newOrg.slug.trim() || null }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data && typeof data.error === 'string') ? data.error : 'Failed to create organization')
      }
      setNewOrg({ name: '', slug: '' })
      setShowAddOrg(false)
      await fetchOrganizations()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organization')
    } finally {
      setSavingOrg(false)
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      company: '',
      serviceOrRole: '',
      url: '',
      linkedInUrl: '',
      notes: '',
      organizationId: organizations[0]?.id ?? '',
    })
    setEditingId(null)
    setShowAddForm(false)
  }

  const startEdit = (c: TrustedContactItem) => {
    setForm({
      name: c.name,
      email: c.email,
      company: c.company ?? '',
      serviceOrRole: c.serviceOrRole ?? '',
      url: c.url ?? '',
      linkedInUrl: c.linkedInUrl ?? '',
      notes: c.notes ?? '',
      organizationId: c.organizationId,
    })
    setEditingId(c.id)
    setShowAddForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!editingId && isAdmin && organizations.length > 0 && !form.organizationId?.trim()) {
      setError('Please select an organization.')
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/trusted-contacts/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            company: form.company.trim() || null,
            serviceOrRole: form.serviceOrRole.trim() || null,
            url: form.url.trim() || null,
            linkedInUrl: form.linkedInUrl.trim() || null,
            notes: form.notes.trim() || null,
          }),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Update failed')
        await fetchContacts()
        resetForm()
      } else {
        const res = await fetch('/api/admin/trusted-contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            company: form.company.trim() || null,
            serviceOrRole: form.serviceOrRole.trim() || null,
            url: form.url.trim() || null,
            linkedInUrl: form.linkedInUrl.trim() || null,
            notes: form.notes.trim() || null,
            ...(isAdmin && form.organizationId ? { organizationId: form.organizationId } : {}),
          }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          const message = (data && typeof data.error === 'string') ? data.error : 'Add failed'
          throw new Error(message)
        }
        await fetchContacts()
        resetForm()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this trusted contact?')) return
    try {
      const res = await fetch(`/api/admin/trusted-contacts/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchContacts()
      else setError((await res.json()).error || 'Delete failed')
    } catch {
      setError('Failed to delete')
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Trusted contacts</h1>
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Trusted contacts</h1>
      <p className="text-gray-600 mb-6">
        A shared list of trusted contacts for supporting services (e.g. legal, accounting, insurance). Partners see and manage their organization’s list; you can add contacts for your org.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-800 text-sm">{error}</div>
      )}

      {isAdmin && organizations.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <label htmlFor="org-filter" className="text-sm font-medium text-gray-700">Filter by organization</label>
          <select
            id="org-filter"
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All organizations</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.slug ?? org.id}>
                {org.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowAddOrg(true)}
            className="text-sm text-primary font-medium hover:text-primary-dark flex items-center gap-1"
          >
            <Building2 className="w-3.5 h-3.5" />
            Add organization
          </button>
        </div>
      )}

      {isAdmin && showAddOrg && (
        <div className="mb-6 p-4 rounded-xl border border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Create organization</h3>
          <form onSubmit={handleCreateOrg} className="space-y-3 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization name *</label>
              <input
                type="text"
                required
                value={newOrg.name}
                onChange={(e) => setNewOrg((o) => ({ ...o, name: e.target.value }))}
                placeholder="e.g. Acme Consulting"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portal slug <span className="text-gray-500 font-normal">(optional)</span></label>
              <input
                type="text"
                value={newOrg.slug}
                onChange={(e) => setNewOrg((o) => ({ ...o, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                placeholder="e.g. acme"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">Used for shareable portal URLs: /p/acme</p>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={savingOrg}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50"
              >
                {savingOrg ? 'Creating...' : 'Create organization'}
              </button>
              <button
                type="button"
                onClick={() => { setShowAddOrg(false); setNewOrg({ name: '', slug: '' }); setError('') }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isAdmin && organizations.length === 0 && !showAddOrg && (
        <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50">
          <p className="text-amber-800 text-sm mb-4">
            Create an organization first to add trusted contacts.
          </p>
          <button
            type="button"
            onClick={() => setShowAddOrg(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
          >
            <Building2 className="w-4 h-4" />
            Create organization
          </button>
        </div>
      )}

      {!showAddForm && !editingId && (isAdmin ? organizations.length > 0 : true) && (
        <button
          type="button"
          onClick={() => {
            setShowAddForm(true)
            setForm({
              name: '',
              email: '',
              company: '',
              serviceOrRole: '',
              url: '',
              linkedInUrl: '',
              notes: '',
              organizationId: organizations[0]?.id ?? '',
            })
          }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
        >
          <UserPlus className="w-4 h-4" />
          Add contact
        </button>
      )}

      {(showAddForm || editingId) && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit contact' : 'Add trusted contact'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. Jane Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company / practice</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service / role</label>
              <input
                type="text"
                value={form.serviceOrRole}
                onChange={(e) => setForm((f) => ({ ...f, serviceOrRole: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. Legal, Accounting, Insurance"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website / URL</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn profile URL</label>
              <input
                type="url"
                value={form.linkedInUrl}
                onChange={(e) => setForm((f) => ({ ...f, linkedInUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            {isAdmin && !editingId && organizations.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization *</label>
                <select
                  value={form.organizationId}
                  onChange={(e) => setForm((f) => ({ ...f, organizationId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[80px]"
                placeholder="Optional notes"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add contact'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <h2 className="text-lg font-semibold text-gray-900 mb-3">Contacts</h2>
      {contacts.length === 0 ? (
        <p className="text-gray-500">
          {orgFilter && isAdmin ? 'No contacts for this organization.' : 'No trusted contacts yet. Add one above.'}
        </p>
      ) : (
        <ul className="space-y-3">
          {contacts.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-start justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900">{c.name}</div>
                <div className="text-sm text-gray-600">{c.email}</div>
                {(c.company || c.serviceOrRole) && (
                  <div className="text-sm text-gray-500 mt-1">
                    {[c.company, c.serviceOrRole].filter(Boolean).join(' · ')}
                  </div>
                )}
                {c.notes && (
                  <p className="text-sm text-gray-500 mt-1">{c.notes}</p>
                )}
                {(c.url || c.linkedInUrl) && (
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Website
                      </a>
                    )}
                    {c.linkedInUrl && (
                      <a
                        href={c.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                )}
                {isAdmin && c.organizationName && (
                  <div className="text-xs text-gray-400 mt-1">{c.organizationName}</div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(c)}
                  className="min-w-[44px] min-h-[44px] p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center justify-center"
                  aria-label="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="min-w-[44px] min-h-[44px] p-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center"
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
