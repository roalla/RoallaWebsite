import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  const currentUser = session?.user as { roles?: string[]; id?: string } | undefined
  if (!session || !currentUser?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const req = await prisma.gatedAccessRequest.findUnique({ where: { id } })
  if (!req || req.status !== 'pending') {
    return NextResponse.json({ error: 'Request not found or already reviewed' }, { status: 404 })
  }

  await prisma.gatedAccessRequest.update({
    where: { id },
    data: { status: 'rejected', reviewedAt: new Date(), reviewedByUserId: currentUser.id! },
  })

  return NextResponse.json({ success: true })
}
