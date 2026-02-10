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

/** PATCH: update bundle name and/or items */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const existing = await prisma.portalBundle.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  try {
    const body = await request.json()
    const updates: { name?: string } = {}
    if (typeof body.name === 'string') updates.name = body.name.trim()

    if (Object.keys(updates).length > 0) {
      await prisma.portalBundle.update({
        where: { id },
        data: updates,
      })
    }

    const resourceIds = Array.isArray(body.resourceIds) ? body.resourceIds.filter((x: unknown) => typeof x === 'string') : undefined
    const articleIds = Array.isArray(body.articleIds) ? body.articleIds.filter((x: unknown) => typeof x === 'string') : undefined
    if (resourceIds !== undefined || articleIds !== undefined) {
      await prisma.portalBundleItem.deleteMany({ where: { bundleId: id } })
      const toCreate: { bundleId: string; resourceId?: string; articleId?: string }[] = []
      for (const rid of resourceIds || []) {
        toCreate.push({ bundleId: id, resourceId: rid })
      }
      for (const aid of articleIds || []) {
        toCreate.push({ bundleId: id, articleId: aid })
      }
      if (toCreate.length > 0) {
        await prisma.portalBundleItem.createMany({ data: toCreate })
      }
    }

    const bundle = await prisma.portalBundle.findUnique({
      where: { id },
      include: { items: true, codes: true },
    })
    return NextResponse.json(bundle)
  } catch (e) {
    console.error('Portal bundle update error:', e)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

/** DELETE bundle */
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
    await prisma.portalBundle.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Portal bundle delete error:', e)
    return NextResponse.json({ error: 'Not found or delete failed' }, { status: 404 })
  }
}
