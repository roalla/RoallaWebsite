import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canManagePortal } from '@/lib/access'

export const dynamic = 'force-dynamic'

/** PATCH: set fullAccess and/or item grants for an approved access request */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || !canManagePortal(session.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { requestId } = await params
  if (!requestId) {
    return NextResponse.json({ error: 'Request ID required' }, { status: 400 })
  }
  const accessRequest = await prisma.accessRequest.findUnique({
    where: { id: requestId, status: 'approved' },
    select: { id: true, email: true },
  })
  if (!accessRequest) {
    return NextResponse.json({ error: 'Approved request not found' }, { status: 404 })
  }
  try {
    const body = await request.json()
    const fullAccess = typeof body.fullAccess === 'boolean' ? body.fullAccess : undefined
    const grantResourceIds = Array.isArray(body.grantResourceIds) ? body.grantResourceIds.filter((id: unknown) => typeof id === 'string') : undefined
    const grantArticleIds = Array.isArray(body.grantArticleIds) ? body.grantArticleIds.filter((id: unknown) => typeof id === 'string') : undefined

    const currentUserId = (session.user as { id?: string }).id

    await prisma.$transaction(async (tx) => {
      if (fullAccess !== undefined) {
        await tx.accessRequest.update({
          where: { id: requestId },
          data: { fullAccess },
        })
      }
      if (grantResourceIds !== undefined || grantArticleIds !== undefined) {
        await tx.portalItemGrant.deleteMany({ where: { email: accessRequest.email.toLowerCase() } })
        const toCreate: { email: string; resourceId?: string; articleId?: string; grantedByUserId: string | null }[] = []
        const email = accessRequest.email.toLowerCase()
        for (const id of grantResourceIds || []) {
          toCreate.push({ email, resourceId: id, grantedByUserId: currentUserId ?? null })
        }
        for (const id of grantArticleIds || []) {
          toCreate.push({ email, articleId: id, grantedByUserId: currentUserId ?? null })
        }
        if (toCreate.length > 0) {
          await tx.portalItemGrant.createMany({
            data: toCreate,
          })
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Portal access update error:', e)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
