import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { roles?: string[] } | undefined
  if (!session || !user?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const requests = await prisma.gatedAccessRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      ndaSignature: true,
      items: true,
    },
  })
  return NextResponse.json(requests)
}
