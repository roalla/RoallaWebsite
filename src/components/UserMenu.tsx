'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ChevronDown, User, LayoutDashboard, LogOut } from 'lucide-react'

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }
  if (email) {
    const local = email.split('@')[0]
    return local.slice(0, 2).toUpperCase()
  }
  return '?'
}

export default function UserMenu() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Loading: show placeholder so the header never has an empty slot
  if (status === 'loading') {
    return (
      <div
        className="w-9 h-9 rounded-full bg-gray-200 animate-pulse flex-shrink-0"
        aria-hidden
      />
    )
  }

  if (status !== 'authenticated' || !session?.user) return null

  const user = session.user as { id?: string; email?: string | null; name?: string | null; image?: string | null; role?: string; roles?: string[] }
  const initials = getInitials(user.name, user.email)
  const roles = user.roles?.length ? user.roles : (user.role ? [user.role] : [])
  const roleLabels = roles.map((r) => (r === 'admin' ? 'Admin' : r === 'partner' ? 'Partner' : r === 'business' ? 'Business' : 'Member'))
  const roleLabel = roleLabels.length ? roleLabels.join(', ') : 'Member'
  const isAdmin = roles.includes('admin')

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-w-[44px] min-h-[44px] justify-center"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt=""
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow"
          />
        ) : (
          <div
            className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold shadow"
            aria-hidden
          >
            {initials}
          </div>
        )}
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform hidden sm:block ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-gray-200 shadow-lg py-2 z-50"
          role="menu"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{user.name || 'No name'}</p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                <span
                  className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>
          <div className="py-1">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              <User className="w-4 h-4 text-gray-500" />
              Profile
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(false)}
                role="menuitem"
              >
                <LayoutDashboard className="w-4 h-4 text-gray-500" />
                Admin
              </Link>
            )}
            <Link
              href="/api/auth/signout"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              <LogOut className="w-4 h-4 text-gray-500" />
              Sign out
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
