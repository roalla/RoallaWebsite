import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/access'
import Link from 'next/link'
import { FileText, CheckCircle, XCircle, Clock, Users, Lock } from 'lucide-react'

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  const admin = session?.user && isAdmin(session.user)
  const [pending, approved, rejected, userCount, gatedPending] = await Promise.all([
    prisma.accessRequest.count({ where: { status: 'pending' } }),
    prisma.accessRequest.count({ where: { status: 'approved' } }),
    prisma.accessRequest.count({ where: { status: 'rejected' } }),
    prisma.user.count(),
    prisma.gatedAccessRequest.count({ where: { status: 'pending' } }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {session?.user?.email}</p>

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
              <p className="text-sm font-medium text-gray-600">Team & roles</p>
              <p className="text-2xl font-bold text-gray-900">{userCount}</p>
            </div>
          </div>
        </Link>
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
