import { prisma } from '@/lib/prisma'
import { CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const users = await prisma.accessRequest.findMany({
    where: { status: 'approved' },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Approved users</h1>
      <p className="text-gray-600 mb-6">
        People who have been approved to access the Resources Portal (via the approve link).
      </p>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {users.length === 0 ? (
          <p className="text-gray-500 py-8 px-4">No approved users yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {users.map((u) => (
              <li key={u.id} className="flex items-center gap-4 py-4 px-4 hover:bg-gray-50/50">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                  {u.company && (
                    <p className="text-sm text-gray-500">{u.company}</p>
                  )}
                </div>
                <p className="text-sm text-gray-400 flex-shrink-0">
                  Approved {new Date(u.updatedAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
