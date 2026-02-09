'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, User, Building2, Users, ChevronDown, X, UserPlus, Trash2, Info, Download, Upload } from 'lucide-react'

export type TeamUser = {
  id: string
  email: string | null
  name: string | null
  image: string | null
  primaryRole: string
  roles: string[]
  createdAt: Date
  lastLoginAt?: Date | null
  organizationId?: string | null
  organizationName?: string | null
}

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin', icon: Shield, color: 'bg-primary/10 text-primary' },
  { value: 'partner', label: 'Partner', icon: Users, color: 'bg-amber-100 text-amber-800' },
  { value: 'business', label: 'Business', icon: Building2, color: 'bg-blue-100 text-blue-800' },
  { value: 'member', label: 'Member', icon: User, color: 'bg-gray-100 text-gray-700' },
] as const

/** Reference for admins: what each role can do. Update when adding roles or permissions. */
const ROLE_ACCESS_REFERENCE: { capability: string; admin: boolean; partner: boolean; business: string; member: string }[] = [
  { capability: 'Access admin area (dashboard)', admin: true, partner: true, business: '—', member: '—' },
  { capability: 'Portal: view, create, edit resources & articles', admin: true, partner: true, business: '—', member: '—' },
  { capability: 'Portal: delete resources & articles', admin: true, partner: false, business: '—', member: '—' },
  { capability: 'Team: view list, add users, edit roles', admin: true, partner: true, business: '—', member: '—' },
  { capability: 'Team: assign or remove Admin role', admin: true, partner: false, business: '—', member: '—' },
  { capability: 'Team: delete users', admin: true, partner: false, business: '—', member: '—' },
  { capability: 'Library access (approve/revoke requests)', admin: true, partner: false, business: '—', member: '—' },
  { capability: 'Trust Center (NDA, gated requests)', admin: true, partner: false, business: '—', member: '—' },
  { capability: 'Security (2FA setup)', admin: true, partner: false, business: '—', member: '—' },
]

export default function TeamManager({
  initialUsers,
  currentUserId,
  canDeleteUser = true,
  canAssignAdmin = true,
}: {
  initialUsers: TeamUser[]
  currentUserId: string | null
  canDeleteUser?: boolean
  canAssignAdmin?: boolean
}) {
  const router = useRouter()
  const [users, setUsers] = useState<TeamUser[]>(initialUsers)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    email: '',
    name: '',
    password: '',
    roles: ['member'] as string[],
    organizationId: '' as string,
    sendInviteEmail: true,
  })
  const [addSubmitting, setAddSubmitting] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [referenceOpen, setReferenceOpen] = useState(false)
  const [organizations, setOrganizations] = useState<{ id: string; name: string }[]>([])
  const [partnerAddUserCapRemaining, setPartnerAddUserCapRemaining] = useState<number | null>(null)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [bulkFile, setBulkFile] = useState<File | null>(null)
  const [bulkSendInvite, setBulkSendInvite] = useState(true)
  const [bulkSubmitting, setBulkSubmitting] = useState(false)
  const [bulkResult, setBulkResult] = useState<{ created: number; errors: string[] } | null>(null)

  useEffect(() => {
    setUsers(initialUsers)
  }, [initialUsers])

  useEffect(() => {
    if (canAssignAdmin) {
      fetch('/api/admin/organizations')
        .then((r) => (r.ok ? r.json() : []))
        .then((list: { id: string; name: string }[]) => setOrganizations(Array.isArray(list) ? list : []))
        .catch(() => setOrganizations([]))
    }
  }, [canAssignAdmin])

  useEffect(() => {
    if (!canAssignAdmin) {
      fetch('/api/admin/capabilities')
        .then((r) => (r.ok ? r.json() : {}))
        .then((d: { partnerAddUserCapRemaining?: number }) =>
          setPartnerAddUserCapRemaining(typeof d.partnerAddUserCapRemaining === 'number' ? d.partnerAddUserCapRemaining : null)
        )
        .catch(() => setPartnerAddUserCapRemaining(null))
    }
  }, [canAssignAdmin])

  const toggleRole = async (userId: string, role: string, add: boolean) => {
    setLoading(userId)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/team/${userId}/roles`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(add ? { add: [role] } : { remove: [role] }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to update roles' })
        return
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, roles: data.roles as string[] } : u
        )
      )
      setEditingId(null)
    } catch {
      setMessage({ type: 'error', text: 'Failed to update roles' })
    } finally {
      setLoading(null)
    }
  }

  const roleLabel = (value: string) => ROLE_OPTIONS.find((r) => r.value === value)?.label ?? value

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddSubmitting(true)
    setMessage(null)
    try {
      const body: Record<string, unknown> = {
        email: addForm.email.trim(),
        name: addForm.name.trim() || undefined,
        password: addForm.password,
        roles: addForm.roles.length > 0 ? addForm.roles : ['member'],
        sendInviteEmail: addForm.sendInviteEmail,
      }
      if (canAssignAdmin && addForm.organizationId) body.organizationId = addForm.organizationId
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to add user' })
        return
      }
      setMessage({ type: 'success', text: `Added ${data.email}. They can sign in now.` })
      setAddForm((f) => ({ ...f, email: '', name: '', password: '', roles: ['member'], organizationId: '', sendInviteEmail: f.sendInviteEmail }))
      setAddOpen(false)
      router.refresh()
      if (!canAssignAdmin) {
        fetch('/api/admin/capabilities')
          .then((r) => (r.ok ? r.json() : {}))
          .then((d: { partnerAddUserCapRemaining?: number }) =>
            setPartnerAddUserCapRemaining(typeof d.partnerAddUserCapRemaining === 'number' ? d.partnerAddUserCapRemaining : null)
          )
          .catch(() => {})
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to add user' })
    } finally {
      setAddSubmitting(false)
    }
  }

  const handleRemoveUser = async (userId: string, email: string | null) => {
    if (!confirm(`Remove user ${email || userId}? This cannot be undone.`)) return
    setRemovingId(userId)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/team/${userId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to remove user' })
        return
      }
      setMessage({ type: 'success', text: 'User removed.' })
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setEditingId((id) => (id === userId ? null : id))
    } catch {
      setMessage({ type: 'error', text: 'Failed to remove user' })
    } finally {
      setRemovingId(null)
    }
  }

  const toggleAddRole = (role: string) => {
    setAddForm((prev) =>
      prev.roles.includes(role)
        ? { ...prev, roles: prev.roles.filter((r) => r !== role) }
        : { ...prev, roles: [...prev.roles, role] }
    )
  }

  const parseCsv = (text: string): { email: string; name?: string; role?: string }[] => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim())
    if (lines.length === 0) return []
    const rows: { email: string; name?: string; role?: string }[] = []
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const cells: string[] = []
      let cell = ''
      let inQuotes = false
      for (let j = 0; j < line.length; j++) {
        const ch = line[j]
        if (ch === '"') {
          inQuotes = !inQuotes
        } else if ((ch === ',' && !inQuotes) || ch === '\t') {
          cells.push(cell.trim())
          cell = ''
        } else {
          cell += ch
        }
      }
      cells.push(cell.trim())
      const email = (cells[0] ?? '').trim().toLowerCase()
      if (email) {
        rows.push({
          email,
          name: (cells[1] ?? '').trim() || undefined,
          role: (cells[2] ?? '').trim() || undefined,
        })
      }
    }
    return rows
  }

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bulkFile) {
      setMessage({ type: 'error', text: 'Choose a CSV file' })
      return
    }
    setBulkSubmitting(true)
    setBulkResult(null)
    setMessage(null)
    try {
      const text = await bulkFile.text()
      const rows = parseCsv(text)
      if (rows.length === 0) {
        setMessage({ type: 'error', text: 'No valid rows (need at least email column)' })
        setBulkSubmitting(false)
        return
      }
      const res = await fetch('/api/admin/team/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows, sendInviteEmail: bulkSendInvite }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Bulk add failed' })
        setBulkSubmitting(false)
        return
      }
      setBulkResult({ created: data.created ?? 0, errors: data.errors ?? [] })
      setBulkFile(null)
      if ((data.created ?? 0) > 0) {
        router.refresh()
        if (!canAssignAdmin) {
          fetch('/api/admin/capabilities')
            .then((r) => (r.ok ? r.json() : {}))
            .then((d: { partnerAddUserCapRemaining?: number }) =>
              setPartnerAddUserCapRemaining(typeof d.partnerAddUserCapRemaining === 'number' ? d.partnerAddUserCapRemaining : null)
            )
            .catch(() => {})
        }
      }
    } catch {
      setMessage({ type: 'error', text: 'Bulk add failed' })
    } finally {
      setBulkSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {!canAssignAdmin && (
        <p className="text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          As a partner you can add users and edit roles; only admins can delete users or assign the Admin role.
          {partnerAddUserCapRemaining !== null && (
            <span className="block mt-1 font-medium">
              You can add {partnerAddUserCapRemaining} more user{partnerAddUserCapRemaining !== 1 ? 's' : ''}.
            </span>
          )}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setReferenceOpen(true)}
          className="inline-flex items-center gap-2 min-h-[44px] px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-200"
          aria-label="View role access reference"
        >
          <Info className="w-4 h-4" />
          Role access reference
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/api/admin/team/export"
            download="team.csv"
            className="inline-flex items-center gap-2 min-h-[44px] px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </a>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark"
          >
            <UserPlus className="w-4 h-4" />
            Add user
          </button>
          <button
            type="button"
            onClick={() => { setBulkOpen((o) => !o); setBulkResult(null); setBulkFile(null); }}
            className="inline-flex items-center gap-2 min-h-[44px] px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Bulk add (CSV)
          </button>
        </div>
      </div>
      {bulkOpen && (
        <form onSubmit={handleBulkUpload} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <p className="text-sm text-gray-600">
            CSV with columns: <strong>email</strong> (required), name (optional), role (optional). Default role: member. Header row optional.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => setBulkFile(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bulkSendInvite}
                onChange={(e) => setBulkSendInvite(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Send invite email to each new user</span>
            </label>
            <button
              type="submit"
              disabled={bulkSubmitting || !bulkFile}
              className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {bulkSubmitting ? 'Adding…' : 'Upload CSV'}
            </button>
          </div>
          {bulkResult && (
            <div className="text-sm">
              <p className="text-green-700 font-medium">Created {bulkResult.created} user(s).</p>
              {bulkResult.errors.length > 0 && (
                <ul className="mt-1 text-amber-800 list-disc list-inside">
                  {bulkResult.errors.slice(0, 10).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                  {bulkResult.errors.length > 10 && (
                    <li>…and {bulkResult.errors.length - 10} more</li>
                  )}
                </ul>
              )}
            </div>
          )}
        </form>
      )}
      {message && (
        <div
          className={`rounded-lg px-4 py-2 text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {users.length === 0 && (
          <p className="text-gray-500 py-8 px-4 text-center">No users yet. Add a user above or they will appear when they sign up.</p>
        )}

        {/* Mobile: card list */}
        {users.length > 0 && (
          <div className="md:hidden divide-y divide-gray-100">
            {users.map((u) => (
              <div key={u.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  {u.image ? (
                    <img src={u.image} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 flex-shrink-0">
                      {(u.name || u.email || '?').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">{u.name || '—'}</p>
                    <p className="text-sm text-gray-500 truncate">{u.email || '—'}</p>
                    {(organizations.length > 0 || u.organizationName) && (
                      <p className="text-sm text-gray-600 mt-0.5">{u.organizationName ?? '—'}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {u.roles.map((r) => (
                    <span
                      key={r}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                        ROLE_OPTIONS.find((o) => o.value === r)?.color ?? 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {roleLabel(r)}
                      {editingId === u.id && (canAssignAdmin || r !== 'admin') && (
                        <button
                          type="button"
                          onClick={() => toggleRole(u.id, r, false)}
                          disabled={loading === u.id}
                          className="ml-0.5 rounded hover:bg-black/10 p-0.5 min-w-[24px] min-h-[24px] inline-flex items-center justify-center"
                          aria-label={`Remove ${r}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {editingId === u.id &&
                    ROLE_OPTIONS.filter((o) => !u.roles.includes(o.value) && (canAssignAdmin || o.value !== 'admin')).map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => toggleRole(u.id, o.value, true)}
                        disabled={loading === u.id}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 min-h-[32px]"
                      >
                        <o.icon className="w-3 h-3" />
                        + {o.label}
                      </button>
                    ))}
                </div>
                <p className="text-xs text-gray-400">
                  Joined {new Date(u.createdAt).toLocaleDateString()}
                  {u.lastLoginAt && ` · Last active ${new Date(u.lastLoginAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}`}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {editingId === u.id ? (
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="min-h-[44px] px-4 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
                    >
                      Done
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingId(u.id)}
                      className="min-h-[44px] px-4 rounded-lg text-sm font-medium text-primary hover:text-primary-dark bg-primary/10"
                    >
                      Edit roles
                    </button>
                  )}
                  {canDeleteUser && currentUserId != null && currentUserId !== u.id && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(u.id, u.email)}
                      disabled={removingId === u.id}
                      className="min-h-[44px] min-w-[44px] p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center justify-center"
                      aria-label={`Remove ${u.email || u.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop: table */}
        {users.length > 0 && (
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  {(organizations.length > 0 || users.some((u) => u.organizationName)) && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last active</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {u.image ? (
                          <img
                            src={u.image}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                            {(u.name || u.email || '?').slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{u.name || '—'}</p>
                          <p className="text-sm text-gray-500">{u.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    {(organizations.length > 0 || users.some((u) => u.organizationName)) && (
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {u.organizationName ?? '—'}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {u.roles.map((r) => (
                          <span
                            key={r}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                              ROLE_OPTIONS.find((o) => o.value === r)?.color ?? 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {roleLabel(r)}
                            {editingId === u.id && (canAssignAdmin || r !== 'admin') && (
                              <button
                                type="button"
                                onClick={() => toggleRole(u.id, r, false)}
                                disabled={loading === u.id}
                                className="ml-0.5 rounded hover:bg-black/10 p-0.5"
                                aria-label={`Remove ${r}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        ))}
                        {editingId === u.id &&
                          ROLE_OPTIONS.filter((o) => !u.roles.includes(o.value) && (canAssignAdmin || o.value !== 'admin')).map((o) => (
                            <button
                              key={o.value}
                              type="button"
                              onClick={() => toggleRole(u.id, o.value, true)}
                              disabled={loading === u.id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                            >
                              <o.icon className="w-3 h-3" />
                              + {o.label}
                            </button>
                          ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === u.id ? (
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            Done
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingId(u.id)}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
                          >
                            Edit roles
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        )}
                        {canDeleteUser && currentUserId != null && currentUserId !== u.id && (
                          <button
                            type="button"
                            onClick={() => handleRemoveUser(u.id, u.email)}
                            disabled={removingId === u.id}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
                            title="Remove user"
                            aria-label={`Remove ${u.email || u.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {referenceOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="role-reference-title"
        >
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 id="role-reference-title" className="text-lg font-semibold text-gray-900">Role access reference</h2>
              <button
                type="button"
                onClick={() => setReferenceOpen(false)}
                className="min-w-[44px] min-h-[44px] p-2 text-gray-400 hover:text-gray-600 rounded-lg flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto px-6 py-4">
              <p className="text-sm text-gray-600 mb-4">
                What each role can do in the admin area. Update this reference when you add or change roles.
              </p>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4 font-medium text-gray-700">Capability</th>
                    <th className="text-center py-2 px-2 w-20 font-medium text-gray-700">Admin</th>
                    <th className="text-center py-2 px-2 w-20 font-medium text-gray-700">Partner</th>
                    <th className="text-center py-2 px-2 w-20 font-medium text-gray-700">Business</th>
                    <th className="text-center py-2 px-2 w-20 font-medium text-gray-700">Member</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ROLE_ACCESS_REFERENCE.map((row, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-4 text-gray-900">{row.capability}</td>
                      <td className="text-center py-2">{row.admin ? '✓' : '—'}</td>
                      <td className="text-center py-2">{row.partner ? '✓' : '—'}</td>
                      <td className="text-center py-2 text-gray-500">{row.business}</td>
                      <td className="text-center py-2 text-gray-500">{row.member}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-500 mt-4">— means no access or not applicable. Business and Member do not have admin area access today.</p>
            </div>
          </div>
        </div>
      )}

      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" aria-modal="true" role="dialog">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add user</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label htmlFor="add-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  id="add-email"
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="add-name"
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label htmlFor="add-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password * (min 8 characters)
                </label>
                <input
                  id="add-password"
                  type="password"
                  required
                  minLength={8}
                  value={addForm.password}
                  onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">Roles</span>
                <div className="flex flex-wrap gap-2">
                  {ROLE_OPTIONS.filter((o) => canAssignAdmin || o.value !== 'admin').map((o) => (
                    <label key={o.value} className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addForm.roles.includes(o.value)}
                        onChange={() => toggleAddRole(o.value)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{o.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-1">If none selected, member is assigned.</p>
              </div>
              {canAssignAdmin && organizations.length > 0 && (
                <div>
                  <label htmlFor="add-org" className="block text-sm font-medium text-gray-700 mb-1">
                    Organization
                  </label>
                  <select
                    id="add-org"
                    value={addForm.organizationId}
                    onChange={(e) => setAddForm((f) => ({ ...f, organizationId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">None</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addForm.sendInviteEmail}
                  onChange={(e) => setAddForm((f) => ({ ...f, sendInviteEmail: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Send invite email (login link; user uses password you set)</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addSubmitting}
                  className="flex-1 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {addSubmitting ? 'Adding…' : 'Add user'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
