'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, HelpCircle, X } from 'lucide-react'

const STORAGE_KEY = 'admin-guide-opened-once'

type GuideSection = {
  title: string
  summary: string
  steps: string[]
  links: { href: string; label: string }[]
}

function getGuideForPath(pathname: string): GuideSection {
  if (pathname.startsWith('/admin/portal-access')) {
    return {
      title: 'Portal Access Guide',
      summary:
        'Approve users, assign a tier (bundle), and fine-tune access to locked items.',
      steps: [
        'Approve pending requests with public-only, tier, or full access.',
        'Use Access tier to assign a bundle for course/client entitlements.',
        'Use Select items only for one-off exceptions.',
        'Remove access when engagement ends.',
      ],
      links: [
        { href: '/admin/portal-bundles', label: 'Manage Bundles & Codes' },
        { href: '/admin/portal', label: 'Manage Portal Content' },
      ],
    }
  }
  if (pathname.startsWith('/admin/portal-bundles')) {
    return {
      title: 'Bundles & Codes Guide',
      summary:
        'Create reusable access tiers and redemption codes for training or programs.',
      steps: [
        'Create a bundle for each tier/course.',
        'Add locked resources and links to the bundle.',
        'Generate codes with expiry or redemption limits.',
        'Assign bundles directly in Portal Access when needed.',
      ],
      links: [
        { href: '/admin/portal-access', label: 'Assign Bundles to Users' },
        { href: '/admin/portal', label: 'Manage Portal Content' },
      ],
    }
  }
  if (pathname.startsWith('/admin/portal')) {
    return {
      title: 'Portal Content Guide',
      summary:
        'Create resources and links, then lock sensitive items for controlled release.',
      steps: [
        'Add resources/links with clear titles and descriptions.',
        'Enable Locked by admin for restricted content.',
        'Use categories and sort order to improve discoverability.',
        'Verify content visibility through Portal Access assignments.',
      ],
      links: [
        { href: '/admin/portal-access', label: 'Control Who Sees What' },
        { href: '/admin/portal-bundles', label: 'Build Tier Bundles' },
      ],
    }
  }
  if (pathname.startsWith('/admin/team')) {
    return {
      title: 'Team & Roles Guide',
      summary:
        'Manage who can administer content, users, and trust workflows safely.',
      steps: [
        'Assign least-privilege roles (admin vs partner).',
        'Review organization scoping for partner users.',
        'Remove stale accounts and outdated elevated roles.',
      ],
      links: [{ href: '/admin/security', label: 'Review Security Settings' }],
    }
  }
  if (pathname.startsWith('/admin/trust')) {
    return {
      title: 'Trust Centre Guide',
      summary:
        'Handle NDA-gated requests and protected trust documentation with auditability.',
      steps: [
        'Review pending trust requests and approve/reject quickly.',
        'Track request status and resend links when needed.',
        'Ensure sensitive documents stay under gated access.',
      ],
      links: [{ href: '/admin/trust/requests', label: 'Open Trust Requests' }],
    }
  }

  return {
    title: 'Admin Guide',
    summary: 'Quick orientation for the main admin workflows.',
    steps: [
      'People & access: approve users and set content access.',
      'Content: manage portal items, bundles, and codes.',
      'Trust & compliance: process gated requests and trust docs.',
      'Settings: maintain security and role hygiene.',
    ],
    links: [
      { href: '/admin/portal-access', label: 'Portal Access' },
      { href: '/admin/portal', label: 'Portal Content' },
      { href: '/admin/portal-bundles', label: 'Bundles & Codes' },
      { href: '/admin/trust/requests', label: 'Trust Requests' },
    ],
  }
}

export default function AdminGuide() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const section = useMemo(() => getGuideForPath(pathname || '/admin'), [pathname])

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY)
      if (!seen) {
        setOpen(true)
        localStorage.setItem(STORAGE_KEY, 'true')
      }
    } catch {
      // ignore localStorage failures
    }
  }, [])

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-primary-dark"
          aria-label="Open admin guide"
        >
          <HelpCircle className="h-4 w-4" />
          Guide
        </button>
      )}

      {open && (
        <aside
          className="fixed right-4 top-24 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-2xl"
          aria-label="Admin guide panel"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="mb-1 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <BookOpen className="h-3.5 w-3.5" />
                Guidance
              </p>
              <h2 className="text-base font-semibold text-gray-900">{section.title}</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close admin guide"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mb-3 text-sm text-gray-600">{section.summary}</p>

          <ol className="mb-4 list-decimal space-y-1 pl-5 text-sm text-gray-700">
            {section.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <div className="flex flex-wrap gap-2">
            {section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:border-primary/40 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </aside>
      )}
    </>
  )
}
