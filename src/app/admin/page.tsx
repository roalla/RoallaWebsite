import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react'

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  const [pending, approved, rejected] = await Promise.all([
    prisma.accessRequest.count({ where: { status: 'pending' } }),
    prisma.accessRequest.count({ where: { status: 'approved' } }),
    prisma.accessRequest.count({ where: { status: 'rejected' } }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {session?.user?.email}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          href="/admin/requests?tab=pending"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
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
              <p className="text-sm font-medium text-gray-600">Approved</p>
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
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{rejected}</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-8">
        <Link
          href="/admin/requests"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark"
        >
          <FileText className="w-4 h-4" />
          Users & access
        </Link>
      </div>
    </div>
  )
}
