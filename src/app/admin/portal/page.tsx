import Link from 'next/link'
import { FileText, BookOpen, Users, Gift } from 'lucide-react'

export default function AdminPortalPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal content</h1>
      <p className="text-gray-600 mb-8">
        Manage what appears on the Resources Portal: downloadable resources and links (external content or internal tools). Control who sees locked items and manage bundles and codes.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/portal-resources"
          className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Downloadable resources</h2>
            <p className="text-sm text-gray-600">
              Add or edit resource tiles: guides, templates, tools. Lock items or set view-only.
            </p>
          </div>
        </Link>
        <Link
          href="/admin/portal-articles"
          className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Portal links</h2>
            <p className="text-sm text-gray-600">
              Links to external content or internal tools. Lock by default if needed.
            </p>
          </div>
        </Link>
        <Link
          href="/admin/portal-access"
          className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Portal access</h2>
            <p className="text-sm text-gray-600">
              Set full access or select items per user (consultation clients, partners).
            </p>
          </div>
        </Link>
        <Link
          href="/admin/portal-bundles"
          className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Bundles & codes</h2>
            <p className="text-sm text-gray-600">
              Create bundles and redemption codes for training clients.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
