import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeRichText } from '@/lib/sanitize-html'
import { canManagePortal, isAdmin } from '@/lib/access'

export const dynamic = 'force-dynamic'

async function requirePortalAccess() {
  const session = await getServerSession(authOptions)
  if (!session || !canManagePortal(session.user)) return null
  return session
}

export async function GET() {
  const session = await requirePortalAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const items = await prisma.portalResource.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { id: true, title: true, description: true, type: true, downloadUrl: true, linkUrl: true, color: true, sortOrder: true, gated: true, lockedByAdmin: true, viewOnly: true, label: true, trustCategory: true, createdByUserId: true, organizationId: true, createdAt: true, updatedAt: true },
    })
    const currentUserId = (session.user as { id?: string }).id
    const list = items.map((item) => ({
      ...item,
      canEdit: isAdmin(session.user) || item.createdByUserId == null || item.createdByUserId === currentUserId,
    }))
    return NextResponse.json(list)
  } catch (e) {
    console.error('Portal resources list error:', e)
    return NextResponse.json({ error: 'Failed to list' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await requirePortalAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { title, description, type, downloadUrl, linkUrl, color, sortOrder, gated, lockedByAdmin, viewOnly, label, trustCategory, organizationId: bodyOrgId } = body
    if (!title || !description || !type) {
      return NextResponse.json(
        { error: 'title, description, and type are required' },
        { status: 400 }
      )
    }
    const currentUserId = (session.user as { id?: string }).id
    let organizationId: string | null = null
    if (isAdmin(session.user)) {
      organizationId = typeof bodyOrgId === 'string' && bodyOrgId.trim() ? bodyOrgId.trim() : null
    } else {
      const u = currentUserId ? await prisma.user.findUnique({ where: { id: currentUserId }, select: { organizationId: true } }) : null
      organizationId = u?.organizationId ?? null
    }
    const item = await prisma.portalResource.create({
      data: {
        title: String(title).trim(),
        description: sanitizeRichText(String(description ?? '')),
        type: String(type).trim(),
        downloadUrl: downloadUrl != null ? String(downloadUrl).trim() || null : null,
        linkUrl: linkUrl != null ? String(linkUrl).trim() || null : null,
        color: color != null ? String(color).trim() : 'from-blue-500 to-blue-600',
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
        gated: typeof gated === 'boolean' ? gated : false,
        lockedByAdmin: typeof lockedByAdmin === 'boolean' ? lockedByAdmin : false,
        viewOnly: typeof viewOnly === 'boolean' ? viewOnly : false,
        label: label != null ? String(label).trim() || null : null,
        trustCategory: trustCategory != null ? String(trustCategory).trim() || null : null,
        createdByUserId: currentUserId ?? undefined,
        organizationId: organizationId ?? undefined,
      },
    })
    return NextResponse.json({ ...item, canEdit: true })
  } catch (e) {
    console.error('Portal resource create error:', e)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
