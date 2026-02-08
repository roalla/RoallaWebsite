import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import AdminNav from './AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { roles?: string[] } | undefined
  const isAdmin = user?.roles?.includes('admin')
  if (!session || !isAdmin) {
    redirect('/login?callbackUrl=/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-semibold text-gray-900">
              Admin
            </Link>
            <AdminNav />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user?.email}</span>
            <Link
              href="/api/auth/signout"
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
