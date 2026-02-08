import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import AccessRequestsManager from './AccessRequestsManager'

export const dynamic = 'force-dynamic'

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const headersList = await headers()
  const host = headersList.get('host') || 'roalla.com'
  const protocol = headersList.get('x-forwarded-proto') || 'https'
  const baseUrl = `${protocol}://${host}`

  const requests = await prisma.accessRequest.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <AccessRequestsManager
      requests={requests}
      baseUrl={baseUrl}
      initialTab={tab === undefined || tab === null ? 'pending' : tab}
    />
  )
}
