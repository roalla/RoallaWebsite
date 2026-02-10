import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canManagePortal, isAdmin } from '@/lib/access'

export const dynamic = 'force-dynamic'

/** GET: list access requests (all statuses for admin, approved only for partner) with fullAccess and item grants; plus resources/articles */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !canManagePortal(session.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const admin = isAdmin(session.user)
    const [requests, resources, articles, allGrants] = await Promise.all([
      prisma.accessRequest.findMany({
        where: admin ? undefined : { status: 'approved' },
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, name: true, company: true, fullAccess: true, status: true, createdAt: true },
      }),
      prisma.portalResource.findMany({
        orderBy: { sortOrder: 'asc' },
        select: { id: true, title: true, lockedByAdmin: true },
      }),
      prisma.portalArticle.findMany({
        orderBy: { sortOrder: 'asc' },
        select: { id: true, title: true, lockedByAdmin: true },
      }),
      prisma.portalItemGrant.findMany({
        select: { email: true, resourceId: true, articleId: true },
      }),
    ])
    const grantsByEmail = new Map<string, { resourceIds: string[]; articleIds: string[] }>()
    for (const g of allGrants) {
      const key = g.email.toLowerCase()
      if (!grantsByEmail.has(key)) grantsByEmail.set(key, { resourceIds: [], articleIds: [] })
      const entry = grantsByEmail.get(key)!
      if (g.resourceId) entry.resourceIds.push(g.resourceId)
      if (g.articleId) entry.articleIds.push(g.articleId)
    }
    const list = requests.map((r) => {
      const grants = grantsByEmail.get(r.email.toLowerCase()) || { resourceIds: [], articleIds: [] }
      return {
        id: r.id,
        email: r.email,
        name: r.name,
        company: r.company,
        fullAccess: r.fullAccess ?? false,
        grantResourceIds: grants.resourceIds,
        grantArticleIds: grants.articleIds,
        status: r.status,
        createdAt: r.createdAt,
      }
    })
    return NextResponse.json({
      requests: list,
      resources,
      articles,
      isAdmin: admin,
    })
  } catch (e) {
    console.error('Portal access list error:', e)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}
