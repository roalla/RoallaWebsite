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

/** POST: create a code for this bundle */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id: bundleId } = await params
  if (!bundleId) return NextResponse.json({ error: 'Bundle ID required' }, { status: 400 })
  const bundle = await prisma.portalBundle.findUnique({ where: { id: bundleId } })
  if (!bundle) return NextResponse.json({ error: 'Bundle not found' }, { status: 404 })
  try {
    const body = await request.json()
    const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : ''
    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }
    const existing = await prisma.portalCode.findUnique({ where: { code } })
    if (existing) {
      return NextResponse.json({ error: 'This code is already in use' }, { status: 400 })
    }
    let expiresAt: Date | null = null
    if (body.expiresAt) {
      const d = new Date(body.expiresAt)
      if (!isNaN(d.getTime())) expiresAt = d
    }
    const maxRedemptions = typeof body.maxRedemptions === 'number' && body.maxRedemptions > 0 ? body.maxRedemptions : null
    const portalCode = await prisma.portalCode.create({
      data: { code, bundleId, expiresAt, maxRedemptions },
    })
    return NextResponse.json(portalCode)
  } catch (e) {
    console.error('Portal code create error:', e)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
