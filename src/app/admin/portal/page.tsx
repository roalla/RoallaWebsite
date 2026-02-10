'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Users, Gift, ChevronDown, ChevronUp, HelpCircle, Lightbulb } from 'lucide-react'

export default function AdminPortalPage() {
  const [showGuide, setShowGuide] = useState(true)
  const [pendingCount, setPendingCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/admin/portal-access/counts')
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => setPendingCount(typeof data.pending === 'number' ? data.pending : null))
      .catch(() => setPendingCount(null))
  }, [])

  const cards = [
    {
      href: '/admin/portal-content',
      icon: FileText,
      title: 'Portal content (resources & links)',
      description: 'Add or edit downloadable resources (files, tiles) and portal links (external or internal). Lock items or set view-only.',
      step: 1,
      tip: 'One place for both: resource tiles (PDFs, guides) and links. Then control access below.',
    },
    {
      href: '/admin/portal-access',
      icon: Users,
      title: 'Portal access',
      description: 'Set full access or select items per user (consultation clients, partners).',
      step: 2,
      tip: 'Control who sees what: grant full access or pick specific resources per user.',
    },
    {
      href: '/admin/portal-bundles',
      icon: Gift,
      title: 'Bundles & codes',
      description: 'Create bundles and redemption codes for training clients.',
      step: 3,
      tip: 'Create redemption codes so clients can unlock a set of resources without manual approval.',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal content</h1>
      <p className="text-gray-600 mb-6">
        Manage what appears on the Resources Portal: downloadable resources and links (external content or internal tools). Control who sees locked items and manage bundles and codes.
      </p>

      {/* How to use – collapsible guide */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50/80 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="w-full flex items-center justify-between gap-2 px-5 py-4 text-left hover:bg-gray-100/80 transition-colors"
          aria-expanded={showGuide}
        >
          <span className="flex items-center gap-2 font-semibold text-gray-900">
            <Lightbulb className="w-5 h-5 text-primary" />
            How to use the Portal
          </span>
          {showGuide ? (
            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
          )}
        </button>
        {showGuide && (
          <div className="px-5 pb-5 pt-0">
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold text-xs">
                  1
                </span>
                <span>
                  <strong>Add content</strong> — Open <strong>Portal content</strong> to manage both downloadable resources (files, tiles) and portal links (external or internal). Same access rules for both.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold text-xs">
                  2
                </span>
                <span>
                  <strong>Lock if needed</strong> — Turn on “Gated” or “Locked” so only approved users (or users with the right code) can see the item.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold text-xs">
                  3
                </span>
                <span>
                  <strong>Control access</strong> — In <strong>Portal access</strong>, approve or reject requests, add users, then set full access or which locked items each user can see (default: public files only).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold text-xs">
                  4
                </span>
                <span>
                  <strong>Optional: Bundles & codes</strong> — Create redemption codes so clients can unlock a bundle of resources without going through the request flow.
                </span>
              </li>
            </ol>
            <p className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-gray-600">
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                Partners: see the <Link href="/admin/partner-guide" className="text-primary font-medium underline hover:no-underline">Partner guide</Link> for team setup and sharing your client portal.
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Section label */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Manage</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(({ href, icon: Icon, title, description, step, tip }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-3 p-6 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all text-left"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                Step {step}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {title}
                {href === '/admin/portal-access' && pendingCount != null && pendingCount > 0 && (
                  <span className="ml-1.5 text-amber-600 font-medium">({pendingCount} pending)</span>
                )}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{description}</p>
              <p className="text-xs text-gray-500 italic">{tip}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
