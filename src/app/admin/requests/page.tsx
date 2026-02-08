import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import RequestsTable from './RequestsTable'

export const dynamic = 'force-dynamic'

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const headersList = await headers()
  const host = headersList.get('host') || 'roalla.com'
  const protocol = headersList.get('x-forwarded-proto') || 'https'
  const baseUrl = `${protocol}://${host}`

  const requests = await prisma.accessRequest.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Access requests</h1>
      <p className="text-gray-600 mb-6">
        Approve or reject resource portal access requests. Approve opens the approval link in a new tab and sends the user their portal link.
      </p>
      <div className="flex gap-2 mb-6">
        <a
          href="/admin/requests"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${!status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All
        </a>
        <a
          href="/admin/requests?status=pending"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${status === 'pending' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Pending
        </a>
        <a
          href="/admin/requests?status=approved"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${status === 'approved' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Approved
        </a>
        <a
          href="/admin/requests?status=rejected"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${status === 'rejected' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Rejected
        </a>
      </div>
      <RequestsTable requests={requests} baseUrl={baseUrl} />
    </div>
  )
}
