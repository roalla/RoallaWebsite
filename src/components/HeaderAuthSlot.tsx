'use client'

import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import UserMenu from './UserMenu'

const placeholderClasses = 'w-9 h-9 rounded-full bg-gray-200 flex-shrink-0'

/** Rendered only on the client (via dynamic ssr:false) to avoid hydration mismatch with session. */
export default function HeaderAuthSlot({
  onNavigate,
  variant = 'desktop',
}: {
  onNavigate?: () => void
  variant?: 'desktop' | 'mobile'
}) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className={`${placeholderClasses} animate-pulse`} aria-hidden />
    )
  }

  if (status === 'authenticated' && session?.user) {
    return <UserMenu />
  }

  if (variant === 'mobile') {
    return (
      <Link
        href="/login"
        className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-gray-50 transition-colors duration-200"
        onClick={onNavigate}
      >
        Login
      </Link>
    )
  }

  return (
    <Link
      href="/login"
      className="text-sm font-medium text-gray-600 hover:text-primary transition-colors whitespace-nowrap"
      onClick={onNavigate}
    >
      Login
    </Link>
  )
}

export const authSlotPlaceholder = (
  <div className={placeholderClasses} aria-hidden />
)
