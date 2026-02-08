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
        Access requests
      </Link>
      <Link
        href="/admin/users"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        Approved users
      </Link>
      <Link
        href="/admin/portal-resources"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        Portal tiles
      </Link>
      <Link
        href="/admin/portal-articles"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        Portal articles
      </Link>
    </nav>
  )
}
