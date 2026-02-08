import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string } | undefined
  if (!session || user?.role !== 'admin') {
    return null
  }
  return session
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  try {
    const body = await request.json()
    const data: Record<string, unknown> = {}
    if (body.title != null) data.title = String(body.title).trim()
    if (body.description != null) data.description = String(body.description).trim()
    if (body.type != null) data.type = String(body.type).trim()
    if (body.downloadUrl != null) data.downloadUrl = body.downloadUrl ? String(body.downloadUrl).trim() : null
    if (body.linkUrl != null) data.linkUrl = body.linkUrl ? String(body.linkUrl).trim() : null
    if (body.color != null) data.color = String(body.color).trim()
    if (typeof body.sortOrder === 'number') data.sortOrder = body.sortOrder
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
  if (!(await requireAdmin())) {
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
