'use client'

import React, { useEffect } from 'react'
import { signOut } from 'next-auth/react'

interface SignOutConfirmModalProps {
  open: boolean
  onClose: () => void
  /** Redirect URL after sign out. Defaults to current path or '/' */
  callbackUrl?: string
}

export default function SignOutConfirmModal({ open, onClose, callbackUrl }: SignOutConfirmModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const handleConfirm = () => {
    onClose()
    signOut({ callbackUrl: callbackUrl ?? (typeof window !== 'undefined' ? window.location.pathname : '/') })
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signout-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-gray-900">
        <h2 id="signout-title" className="text-lg font-semibold mb-2">
          Sign out
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to sign out?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="min-h-[44px] px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
