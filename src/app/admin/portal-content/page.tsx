'use client'

import React from 'react'
import Link from 'next/link'
import { FileText, Link2, ArrowRight, ArrowLeft } from 'lucide-react'

export default function AdminPortalContentPage() {
  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link href="/admin/portal" className="hover:text-gray-700">Portal</Link>
        <span aria-hidden>/</span>
        <span className="text-gray-900 font-medium">Portal content</span>
      </nav>
      <Link
        href="/admin/portal"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Portal
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal content</h1>
      <p className="text-gray-600 mb-8">
        Manage what appears on the Resources Portal: downloadable files (guides, templates, PDFs) and links to external content or internal tools. Both use the same access controls (gated, locked, bundles).
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        <Link
          href="/admin/portal-resources"
          className="group flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all text-left"
        >
          <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
            <FileText className="w-7 h-7 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Downloadable resources</h2>
            <p className="text-sm text-gray-600">
              Tiles with files (PDFs, guides) and optional links. Add download URL, view-only, and tile color.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary flex-shrink-0" />
        </Link>

        <Link
          href="/admin/portal-articles"
          className="group flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all text-left"
        >
          <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
            <Link2 className="w-7 h-7 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Portal links</h2>
            <p className="text-sm text-gray-600">
              Links to external content (e.g. LinkedIn) or internal tools. Destination URL and optional label.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary flex-shrink-0" />
        </Link>
      </div>
    </div>
  )
}
