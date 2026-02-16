'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const STORAGE_KEY = 'admin-dashboard-menu-open'

export default function AdminDashboardMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== null) setOpen(stored === 'true')
    } catch {
      /* ignore */
    }
  }, [])

  const setOpenPersisted = (value: boolean) => {
    setOpen(value)
    try {
      localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mb-8 p-4 bg-gray-100 border border-gray-200 rounded-xl">
      <button
        type="button"
        onClick={() => setOpenPersisted(!open)}
        className="flex items-center justify-between w-full text-left min-h-[44px]"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-gray-800">What&apos;s in the menu</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>
      {open && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li><strong>Dashboard</strong> — This page: overview and quick links.</li>
            <li><strong>Team &amp; roles</strong> — Add users and assign roles (admin, partner, etc.).</li>
            <li><strong>Portal content</strong> — Tiles (resources/links), portal access (approve requests, add users, set who sees what), and bundles/codes.</li>
            <li><strong>Trusted contacts</strong> — Contacts list for your organization (partners).</li>
            <li><strong>Trust Centre</strong> — NDA and gated document requests.</li>
            <li><strong>Security</strong> — 2FA and account settings.</li>
          </ul>
          <p className="text-sm text-gray-600 mt-3">
            Use <strong>View as → Partner / Business</strong> in the header to preview what that role sees in the menu and on this dashboard.
          </p>
        </div>
      )}
    </div>
  )
}
