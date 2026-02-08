import Link from 'next/link'

export default function AdminNav() {
  return (
    <nav className="flex items-center gap-6">
      <Link
        href="/admin"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        Dashboard
      </Link>
      <Link
        href="/admin/requests"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        Users & access
      </Link>
      <Link
        href="/admin/portal"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        Portal content
      </Link>
    </nav>
  )
}
