'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AdminNav from './AdminNav'
import SignOutConfirmModal from '@/components/SignOutConfirmModal'
import { useViewAs } from './AdminViewAsContext'
import type { ViewAsRole } from './AdminViewAs'

export default function AdminHeader({
  roles = [],
  organizationName = null,
  userEmail = null,
}: {
  roles: string[]
  organizationName: string | null
  userEmail: string | null
}) {
  const router = useRouter()
  const { viewAsRole, setViewAsRole } = useViewAs()
  const [mounted, setMounted] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)
  const isAdmin = roles.includes('admin')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleViewAsChange = (role: ViewAsRole) => {
    setViewAsRole(role)
    router.refresh()
  }

  const clearViewAs = () => {
    setViewAsRole('')
    router.refresh()
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 pt-[env(safe-area-inset-top)]">
        <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-16">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Link href="/admin" className="flex items-center gap-2 flex-shrink-0 group" aria-label="Admin dashboard">
              <Image src="/logo.svg" alt="" width={32} height={32} className="h-8 w-auto text-primary" />
              <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Admin</span>
            </Link>
            {mounted && (
              <AdminNav
                roles={roles}
                organizationName={organizationName}
                userEmail={userEmail}
                viewAsRole={viewAsRole}
                onViewAsChange={isAdmin ? handleViewAsChange : undefined}
                isAdmin={isAdmin}
              />
            )}
          </div>
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            {isAdmin && (
              <>
                <span className="flex items-center gap-1.5 text-xs text-gray-500" title="Preview what Partner or Business users see">
                  <Eye className="w-3.5 h-3.5" aria-hidden />
                  View as
                </span>
                <select
                  value={viewAsRole || 'admin'}
                  onChange={(e) => handleViewAsChange((e.target.value || '') as ViewAsRole)}
                  className="text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary"
                  aria-label="Preview view as role"
                >
                  <option value="">Admin</option>
                  <option value="partner">Partner</option>
                  <option value="business">Business</option>
                </select>
                <div className="w-px h-5 bg-gray-200" aria-hidden />
              </>
            )}
            {organizationName && (
              <span className="text-sm font-medium text-gray-800">{organizationName}</span>
            )}
            <span className="text-sm text-gray-600 truncate max-w-[180px]">{userEmail}</span>
            <button
              type="button"
              onClick={() => setSignOutOpen(true)}
              className="text-sm text-primary hover:text-primary-dark font-medium min-h-[44px] flex items-center"
            >
              Sign out
            </button>
          </div>
        </div>
        <SignOutConfirmModal open={signOutOpen} onClose={() => setSignOutOpen(false)} callbackUrl="/login" />
        {/* View as Partner notice */}
        {mounted && viewAsRole === 'partner' && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-blue-900 flex items-center gap-2">
                <Eye className="w-4 h-4 flex-shrink-0 text-blue-700" aria-hidden />
                <strong>Preview:</strong> You’re viewing the menu and dashboard as a Partner would see it (fewer options than Admin).
              </p>
              <button
                type="button"
                onClick={clearViewAs}
                className="text-sm font-medium text-blue-800 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg whitespace-nowrap"
              >
                Return to Admin view
              </button>
            </div>
          </div>
        )}
        {/* View as Business notice */}
        {mounted && viewAsRole === 'business' && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-amber-900 flex items-center gap-2">
                <Eye className="w-4 h-4 flex-shrink-0 text-amber-700" aria-hidden />
                <strong>Preview:</strong> Business users don’t have access to the admin area. They use the <Link href="/resources/request" className="underline font-medium">Resources Portal</Link> with their access link after approval.
              </p>
              <button
                type="button"
                onClick={clearViewAs}
                className="text-sm font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg whitespace-nowrap"
              >
                Return to Admin view
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
