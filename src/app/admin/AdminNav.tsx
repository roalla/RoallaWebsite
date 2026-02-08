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
        href="/admin/team"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        Team & roles
      </Link>
      <Link
        href="/admin/requests"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        Library access
      </Link>
      <Link
        href="/admin/portal"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        Portal content
      </Link>
      <Link
        href="/admin/trust"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        Trust Center
      </Link>
      <Link
        href="/admin/security"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        Security
      </Link>
    </nav>
  )
}
