'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function AdminNav({
  roles = [],
  organizationName = null,
  userEmail = null,
}: {
  roles?: string[]
  organizationName?: string | null
  userEmail?: string | null
}) {
  const [open, setOpen] = useState(false)
  const isAdmin = roles.includes('admin')
  const isPartner = roles.includes('partner')

  const navLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/team', label: 'Team & roles' },
    ...(isPartner && !isAdmin ? [{ href: '/admin/partner-guide', label: 'Partner guide' }] : []),
    ...(isAdmin ? [{ href: '/admin/requests', label: 'Library access' }] : []),
    { href: '/admin/portal', label: 'Portal content' },
    { href: '/admin/trusted-contacts', label: 'Trusted contacts' },
    ...(isAdmin
      ? [
          { href: '/admin/trust', label: 'Trust Centre' },
          { href: '/admin/security', label: 'Security' },
        ]
      : []),
  ]

  return (
    <>
      {/* Desktop: horizontal nav */}
      <nav className="hidden lg:flex items-center gap-6" aria-label="Admin navigation">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile: hamburger + drawer */}
      <div className="lg:hidden flex items-center">
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

      {/* Mobile drawer overlay */}
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
              <span className="font-semibold text-gray-900">Admin</span>
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
              <ul className="space-y-1 px-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
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
