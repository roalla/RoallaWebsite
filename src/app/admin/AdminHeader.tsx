'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminNav from './AdminNav'
import { getViewAsCookie, setViewAsCookie, type ViewAsRole } from './AdminViewAs'

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
  const [viewAsRole, setViewAsRoleState] = useState<ViewAsRole>('')
  const [mounted, setMounted] = useState(false)
  const isAdmin = roles.includes('admin')

  useEffect(() => {
    setViewAsRoleState(getViewAsCookie())
    setMounted(true)
  }, [])

  const handleViewAsChange = (role: ViewAsRole) => {
    setViewAsCookie(role)
    setViewAsRoleState(role)
    router.refresh()
  }

  const clearViewAs = () => {
    setViewAsCookie('')
    setViewAsRoleState('')
    router.refresh()
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 pt-[env(safe-area-inset-top)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-16">
          <div className="flex items-center gap-4 lg:gap-8 min-w-0 flex-1">
            <Link href="/admin" className="font-semibold text-gray-900 flex-shrink-0">
              Admin
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
            {organizationName && (
              <span className="text-sm font-medium text-gray-800">{organizationName}</span>
            )}
            <span className="text-sm text-gray-600 truncate max-w-[180px]">{userEmail}</span>
            <Link
              href="/api/auth/signout"
              className="text-sm text-primary hover:text-primary-dark font-medium min-h-[44px] flex items-center"
            >
              Sign out
            </Link>
          </div>
        </div>
        {/* View as Partner notice */}
        {mounted && viewAsRole === 'partner' && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-blue-900">
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
              <p className="text-sm text-amber-900">
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
