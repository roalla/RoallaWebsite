import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isAdmin, canAccessAdmin } from '@/lib/access'
import Link from 'next/link'
import { FileText, CheckCircle, XCircle, Clock, Users, Lock, BookOpen, FileStack } from 'lucide-react'

const PARTNER_ADD_USER_CAP = Math.max(0, Number(process.env.PARTNER_ADD_USER_CAP) || 50)

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  const admin = session?.user && isAdmin(session.user)
  const currentUserId = (session?.user as { id?: string } | undefined)?.id

  const [
    pending,
    approved,
    rejected,
    globalUserCount,
    gatedPending,
    partnerContext,
  ] = await Promise.all([
    prisma.accessRequest.count({ where: { status: 'pending' } }),
    prisma.accessRequest.count({ where: { status: 'approved' } }),
    prisma.accessRequest.count({ where: { status: 'rejected' } }),
    prisma.user.count(),
    prisma.gatedAccessRequest.count({ where: { status: 'pending' } }),
    currentUserId && canAccessAdmin(session?.user) && !admin
      ? (async () => {
          const u = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { organizationId: true, organization: { select: { name: true, slug: true } } },
          })
          if (!u?.organizationId) return null
          const [orgUserCount, myResourceCount, myArticleCount, addedCount] = await Promise.all([
            prisma.user.count({ where: { organizationId: u.organizationId } }),
            prisma.portalResource.count({
              where: { OR: [{ createdByUserId: currentUserId }, { createdByUserId: null }] },
            }),
            prisma.portalArticle.count({
              where: { OR: [{ createdByUserId: currentUserId }, { createdByUserId: null }] },
            }),
            prisma.user.count({ where: { addedByUserId: currentUserId } }),
          ])
          return {
            organizationName: u.organization?.name ?? null,
            organizationSlug: u.organization?.slug ?? null,
            orgUserCount,
            myResourceCount,
            myArticleCount,
            addUserCapRemaining: Math.max(0, PARTNER_ADD_USER_CAP - addedCount),
          }
        })()
      : Promise.resolve(null),
  ])

  const userCount = admin ? globalUserCount : partnerContext?.orgUserCount ?? 0

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome back, {session?.user?.email}
        {partnerContext?.organizationName && (
          <span className="ml-2 text-gray-500">· {partnerContext.organizationName}</span>
        )}
      </p>

      {partnerContext && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm font-medium text-amber-900">Partner overview</p>
          <p className="text-sm text-amber-800 mt-1">
            You can add {partnerContext.addUserCapRemaining} more user{partnerContext.addUserCapRemaining !== 1 ? 's' : ''}.
            <Link href="/admin/partner-guide" className="ml-2 underline font-medium">Partner guide</Link>
          </p>
          {partnerContext.organizationSlug && (
            <p className="text-sm text-amber-800 mt-2">
              Shareable portal link: <a href={`/p/${encodeURIComponent(partnerContext.organizationSlug)}`} className="underline font-medium" target="_blank" rel="noopener noreferrer">/p/{partnerContext.organizationSlug}</a>
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Link
          href="/admin/team"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                {admin ? 'Team & roles' : 'Your team'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{userCount}</p>
            </div>
          </div>
        </Link>
        {partnerContext && (
          <>
            <Link
              href="/admin/portal-resources"
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileStack className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Resources you can edit</p>
                  <p className="text-2xl font-bold text-gray-900">{partnerContext.myResourceCount}</p>
                </div>
              </div>
            </Link>
            <Link
              href="/admin/portal-articles"
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Portal links you can edit</p>
                  <p className="text-2xl font-bold text-gray-900">{partnerContext.myArticleCount}</p>
                </div>
              </div>
            </Link>
          </>
        )}
        {admin && (
          <>
            <Link
              href="/admin/requests?tab=pending"
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Library pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pending}</p>
                </div>
              </div>
            </Link>
            <Link
              href="/admin/requests?tab=approved"
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Library approved</p>
                  <p className="text-2xl font-bold text-gray-900">{approved}</p>
                </div>
              </div>
            </Link>
            <Link
              href="/admin/requests?tab=rejected"
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Library rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{rejected}</p>
                </div>
              </div>
            </Link>
            <Link
              href="/admin/trust/requests?status=pending"
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Gated requests pending</p>
                  <p className="text-2xl font-bold text-gray-900">{gatedPending}</p>
                </div>
              </div>
            </Link>
          </>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/admin/team"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark"
        >
          <Users className="w-4 h-4" />
          Team & roles
        </Link>
        {!admin && (
          <Link
            href="/admin/partner-guide"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 font-medium rounded-lg hover:border-primary/30 text-gray-700"
          >
            <FileText className="w-4 h-4" />
            Partner guide
          </Link>
        )}
        {admin && (
          <>
            <Link
              href="/admin/requests"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 font-medium rounded-lg hover:border-primary/30 text-gray-700"
            >
              <FileText className="w-4 h-4" />
              Library access
            </Link>
            <Link
              href="/admin/trust/requests"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 font-medium rounded-lg hover:border-primary/30 text-gray-700"
            >
              <Lock className="w-4 h-4" />
              Trust Center requests
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
