import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { canAccessAdmin, isAdmin } from '@/lib/access'
import { prisma } from '@/lib/prisma'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import AdminProviders from './AdminProviders'

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
    <AdminProviders>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AdminHeader
          roles={roles}
          organizationName={organizationName}
          userEmail={session.user?.email ?? null}
        />
        <div className="flex flex-1 min-h-0">
          <AdminSidebar roles={roles} />
          <main id="main-content" tabIndex={-1} className="flex-1 min-w-0 overflow-auto bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminProviders>
  )
}
