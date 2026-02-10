'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Eye } from 'lucide-react'
import { getViewAsCookie, setViewAsCookie, type ViewAsRole } from './AdminViewAs'

export type NavItem = {
  href: string
  label: string
  description: string
  group: string
}

const ALL_NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard', description: 'Overview and quick links', group: 'Overview' },
  { href: '/admin/team', label: 'Team & roles', description: 'Manage users and their permissions', group: 'People & access' },
  { href: '/admin/partner-guide', label: 'Partner guide', description: 'How to use the admin as a partner', group: 'People & access' },
  { href: '/admin/portal', label: 'Portal content', description: 'Resources, links, access, and bundles', group: 'Content' },
  { href: '/admin/trusted-contacts', label: 'Trusted contacts', description: 'Contacts list for your organization', group: 'Trust & compliance' },
  { href: '/admin/trust', label: 'Trust Centre', description: 'NDA and gated document requests', group: 'Trust & compliance' },
  { href: '/admin/security', label: 'Security', description: '2FA and account security', group: 'Settings' },
]

function getNavLinksForRoles(roles: string[]): NavItem[] {
  const isAdmin = roles.includes('admin')
  const isPartner = roles.includes('partner')
  // Business or no roles: no admin access; show only Dashboard so they can navigate back
  if (roles.length === 0) {
    return ALL_NAV_ITEMS.filter((item) => item.href === '/admin')
  }
  return ALL_NAV_ITEMS.filter((item) => {
    if (item.href === '/admin/partner-guide') return isPartner && !isAdmin
    if (item.href === '/admin/trust' || item.href === '/admin/security') return isAdmin
    return true
  })
}

function getGroups(items: NavItem[]): Map<string, NavItem[]> {
  const map = new Map<string, NavItem[]>()
  for (const item of items) {
    const list = map.get(item.group) ?? []
    list.push(item)
    map.set(item.group, list)
  }
  return map
}

export default function AdminNav({
  roles = [],
  organizationName = null,
  userEmail = null,
  viewAsRole = '',
  onViewAsChange,
  isAdmin: userIsAdmin = false,
}: {
  roles?: string[]
  organizationName?: string | null
  userEmail?: string | null
  viewAsRole?: ViewAsRole
  onViewAsChange?: (role: ViewAsRole) => void
  isAdmin?: boolean
}) {
  const [open, setOpen] = useState(false)
  const effectiveRoles = viewAsRole === 'partner' ? ['partner'] : viewAsRole === 'business' ? [] : roles
  const navItems = getNavLinksForRoles(effectiveRoles)
  const groups = getGroups(navItems)

  return (
    <>
      {/* Desktop: horizontal nav with grouped dropdown for "Portal content" */}
      <nav className="hidden lg:flex items-center gap-1" aria-label="Admin navigation">
        {Array.from(groups.entries()).map(([groupName, items]) => (
          <div key={groupName} className="flex items-center gap-1">
            {items.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                title={link.description}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* View as switcher - desktop: only when user is admin */}
      {userIsAdmin && onViewAsChange && (
        <div className="hidden lg:flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Eye className="w-3.5 h-3.5" aria-hidden />
            View as
          </span>
          <select
            value={viewAsRole || 'admin'}
            onChange={(e) => onViewAsChange((e.target.value || '') as ViewAsRole)}
            className="text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary"
            aria-label="Preview view as role"
          >
            <option value="">Admin (you)</option>
            <option value="partner">Partner</option>
            <option value="business">Business</option>
          </select>
        </div>
      )}

      {/* Mobile: hamburger */}
      <div className="lg:hidden flex items-center gap-2">
        {userIsAdmin && onViewAsChange && (
          <select
            value={viewAsRole || 'admin'}
            onChange={(e) => onViewAsChange((e.target.value || '') as ViewAsRole)}
            className="text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white"
            aria-label="Preview view as role"
          >
            <option value="">Admin</option>
            <option value="partner">Partner</option>
            <option value="business">Business</option>
          </select>
        )}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Open admin menu"
          aria-expanded={open}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          aria-modal="true"
          role="dialog"
          aria-label="Admin menu"
        >
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="font-semibold text-gray-900">Admin menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4" aria-label="Admin navigation">
              {Array.from(groups.entries()).map(([groupName, items]) => (
                <div key={groupName} className="px-4 mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {groupName}
                  </p>
                  <ul className="space-y-1">
                    {items.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        >
                          <span className="font-medium">{link.label}</span>
                          <span className="block text-xs text-gray-500 mt-0.5">{link.description}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200 space-y-2">
              {organizationName && (
                <p className="text-sm font-medium text-gray-800 px-2">{organizationName}</p>
              )}
              {userEmail && (
                <p className="text-sm text-gray-600 px-2 truncate">{userEmail}</p>
              )}
              <Link
                href="/api/auth/signout"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 min-h-[44px] flex items-center"
              >
                Sign out
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
