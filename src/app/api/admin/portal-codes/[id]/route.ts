import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canManagePortal } from '@/lib/access'

export const dynamic = 'force-dynamic'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || !canManagePortal(session.user)) return null
  return session
}

/** DELETE a code */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  try {
    await prisma.portalCode.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Portal code delete error:', e)
    return NextResponse.json({ error: 'Not found or delete failed' }, { status: 404 })
  }
}
