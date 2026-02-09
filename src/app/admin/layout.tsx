import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { canAccessAdmin, isAdmin } from '@/lib/access'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AdminNav from './AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const user = session?.user
  if (!session || !canAccessAdmin(user)) {
    redirect('/login?callbackUrl=/admin')
  }

  const roles = (user as { roles?: string[] })?.roles ?? []
  const currentUserId = (user as { id?: string })?.id
  const organizationName =
    currentUserId && !isAdmin(user)
      ? (await prisma.user.findUnique({
          where: { id: currentUserId },
          select: { organization: { select: { name: true } } },
        }))?.organization?.name ?? null
      : null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 pt-[env(safe-area-inset-top)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-16">
          <div className="flex items-center gap-4 lg:gap-8 min-w-0 flex-1">
            <Link href="/admin" className="font-semibold text-gray-900 flex-shrink-0">
              Admin
            </Link>
            <AdminNav
              roles={roles}
              organizationName={organizationName}
              userEmail={session.user?.email ?? null}
            />
          </div>
          {/* Desktop: org, email, sign out */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            {organizationName && (
              <span className="text-sm font-medium text-gray-800">{organizationName}</span>
            )}
            <span className="text-sm text-gray-600">{session.user?.email}</span>
            <Link
              href="/api/auth/signout"
              className="text-sm text-primary hover:text-primary-dark font-medium min-h-[44px] flex items-center"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">{children}</main>
    </div>
  )
}
