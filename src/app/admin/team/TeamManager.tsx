'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, User, Building2, Users, ChevronDown, X } from 'lucide-react'

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

export default function TeamManager({ initialUsers }: { initialUsers: TeamUser[] }) {
  const router = useRouter()
  const [users, setUsers] = useState<TeamUser[]>(initialUsers)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

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

  return (
    <div className="space-y-4">
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
                <th className="px-4 py-3 w-24" />
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
                  <td className="px-4 py-3">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <p className="text-gray-500 py-8 px-4 text-center">No users yet. Users appear here when they sign up.</p>
        )}
      </div>
    </div>
  )
}
