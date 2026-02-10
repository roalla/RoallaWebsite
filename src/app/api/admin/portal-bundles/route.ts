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

/** GET: list all bundles with items and codes */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const bundles = await prisma.portalBundle.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: { select: { id: true, resourceId: true, articleId: true } },
        codes: {
          include: { redemptions: { select: { id: true } } },
        },
      },
    })
    return NextResponse.json(bundles)
  } catch (e) {
    console.error('Portal bundles list error:', e)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}

/** POST: create bundle */
export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    const bundle = await prisma.portalBundle.create({
      data: { name },
    })
    return NextResponse.json(bundle)
  } catch (e) {
    console.error('Portal bundle create error:', e)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
