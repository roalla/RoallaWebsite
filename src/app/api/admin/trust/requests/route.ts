import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { roles?: string[] } | undefined
  if (!session || !user?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const status = request.nextUrl.searchParams.get('status') as 'pending' | 'approved' | 'rejected' | null
  const search = request.nextUrl.searchParams.get('search')?.trim()?.toLowerCase() || ''

  type SearchWhere =
    | { email: { contains: string; mode: 'insensitive' } }
    | { name: { contains: string; mode: 'insensitive' } }
  const where: { status?: string; OR?: SearchWhere[] } = {}
  if (status && ['pending', 'approved', 'rejected'].includes(status)) {
    where.status = status
  }
  if (search) {
    const term = { contains: search, mode: 'insensitive' as const }
    where.OR = [{ email: term }, { name: term }]
  }

  const limit = Math.min(Number(request.nextUrl.searchParams.get('limit')) || 50, 100)
  const offset = Number(request.nextUrl.searchParams.get('offset')) || 0

  const requests = await prisma.gatedAccessRequest.findMany({
    where: Object.keys(where).length ? where : undefined,
    orderBy: { createdAt: 'desc' },
    skip: offset,
    take: limit + 1,
    include: {
      ndaSignature: true,
      items: true,
    },
  })
  const hasMore = requests.length > limit
  const list = hasMore ? requests.slice(0, limit) : requests
  return NextResponse.json({ requests: list, hasMore })
}
