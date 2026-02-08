'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, User, Building2, Users, ChevronDown, X, UserPlus, Trash2 } from 'lucide-react'

export type TeamUser = {
  id: string
  email: string | null
  name: string | null
  image: string | null
  primaryRole: string
  roles: string[]
  createdAt: Date
}

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin', icon: Shield, color: 'bg-primary/10 text-primary' },
  { value: 'partner', label: 'Partner', icon: Users, color: 'bg-amber-100 text-amber-800' },
  { value: 'business', label: 'Business', icon: Building2, color: 'bg-blue-100 text-blue-800' },
  { value: 'member', label: 'Member', icon: User, color: 'bg-gray-100 text-gray-700' },
] as const

export default function TeamManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: TeamUser[]
  currentUserId: string | null
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
  })
  const [addSubmitting, setAddSubmitting] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    setUsers(initialUsers)
  }, [initialUsers])

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
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
          email: addForm.email.trim(),
          name: addForm.name.trim() || undefined,
          password: addForm.password,
          roles: addForm.roles.length > 0 ? addForm.roles : ['member'],
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to add user' })
        return
      }
      setMessage({ type: 'success', text: `Added ${data.email}. They can sign in now.` })
      setAddForm({ email: '', name: '', password: '', roles: ['member'] })
      setAddOpen(false)
      router.refresh()
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

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark"
        >
          <UserPlus className="w-4 h-4" />
          Add user
        </button>
      </div>
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
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
                          {editingId === u.id && (
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
                        ROLE_OPTIONS.filter((o) => !u.roles.includes(o.value)).map((o) => (
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
                      {currentUserId != null && currentUserId !== u.id && (
                        <button
                          type="button"
                          onClick={() => handleRemoveUser(u.id, u.email)}
                          disabled={removingId === u.id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
        {users.length === 0 && (
          <p className="text-gray-500 py-8 px-4 text-center">No users yet. Add a user above or they will appear when they sign up.</p>
        )}
      </div>

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
                  {ROLE_OPTIONS.map((o) => (
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
