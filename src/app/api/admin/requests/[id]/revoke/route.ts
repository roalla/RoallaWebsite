import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { roles?: string[] } | undefined
  if (!session || !user?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'Request ID required' }, { status: 400 })
  }

  try {
    await prisma.accessRequest.update({
      where: { id },
      data: { status: 'rejected' },
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Revoke approval error:', e)
    return NextResponse.json({ error: 'Request not found or update failed' }, { status: 404 })
  }
}
