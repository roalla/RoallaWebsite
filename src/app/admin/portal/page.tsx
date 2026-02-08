import Link from 'next/link'
import { FileText, BookOpen } from 'lucide-react'

export default function AdminPortalPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal content</h1>
      <p className="text-gray-600 mb-8">
        Manage what appears on the Resources Portal: downloadable tiles and featured articles.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        <Link
          href="/admin/portal-resources"
          className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Tiles (downloadable resources)</h2>
            <p className="text-sm text-gray-600">
              Add or edit the resource tiles shown on the portal: guides, templates, tools, and links.
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
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Featured articles</h2>
            <p className="text-sm text-gray-600">
              Add or edit the featured articles shown on the portal.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
