import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeRichText } from '@/lib/sanitize-html'
import { canManagePortal, canDeletePortalContent, isAdmin } from '@/lib/access'

export const dynamic = 'force-dynamic'

async function requirePortalAccess() {
  const session = await getServerSession(authOptions)
  if (!session || !canManagePortal(session.user)) return null
  return session
}

async function requirePortalDelete() {
  const session = await getServerSession(authOptions)
  if (!session || !canDeletePortalContent(session.user)) return null
  return session
}

function partnerCanEditItem(createdByUserId: string | null, currentUserId: string | undefined): boolean {
  return createdByUserId == null || createdByUserId === currentUserId
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requirePortalAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const existing = await prisma.portalResource.findUnique({ where: { id }, select: { createdByUserId: true } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!isAdmin(session.user) && !partnerCanEditItem(existing.createdByUserId, (session.user as { id?: string }).id)) {
    return NextResponse.json({ error: 'You can only edit content you created' }, { status: 403 })
  }
  try {
    const body = await request.json()
    const data: Record<string, unknown> = {}
    if (body.title != null) data.title = String(body.title).trim()
    if (body.description != null) data.description = sanitizeRichText(String(body.description))
    if (body.type != null) data.type = String(body.type).trim()
    if (body.downloadUrl != null) data.downloadUrl = body.downloadUrl ? String(body.downloadUrl).trim() : null
    if (body.linkUrl != null) data.linkUrl = body.linkUrl ? String(body.linkUrl).trim() : null
    if (body.color != null) data.color = String(body.color).trim()
    if (typeof body.sortOrder === 'number') data.sortOrder = body.sortOrder
    if (typeof body.gated === 'boolean') data.gated = body.gated
    const item = await prisma.portalResource.update({
      where: { id },
      data,
    })
    return NextResponse.json(item)
  } catch (e) {
    console.error('Portal resource update error:', e)
    return NextResponse.json({ error: 'Not found or update failed' }, { status: 404 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requirePortalDelete())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  try {
    await prisma.portalResource.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Portal resource delete error:', e)
    return NextResponse.json({ error: 'Not found or delete failed' }, { status: 404 })
  }
}
