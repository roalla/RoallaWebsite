import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canManagePortal, isAdmin } from '@/lib/access'

export const dynamic = 'force-dynamic'

/** GET: lightweight counts for portal access (pending, approved, rejected). Used for badges. */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !canManagePortal(session.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const admin = isAdmin(session.user)
    const [pending, approved, rejected] = await Promise.all([
      prisma.accessRequest.count({ where: { status: 'pending' } }),
      prisma.accessRequest.count({ where: { status: 'approved' } }),
      admin ? prisma.accessRequest.count({ where: { status: 'rejected' } }) : Promise.resolve(0),
    ])
    return NextResponse.json({ pending, approved, rejected })
  } catch (e) {
    console.error('Portal access counts error:', e)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}
