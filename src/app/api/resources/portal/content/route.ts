import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  verifyPortalViewer,
  canSeeResource,
  canSeeArticle,
} from '@/lib/portal-access'

export const dynamic = 'force-dynamic'

/** Returns resources and articles. After migration, articles are empty and link-only items exist as resources. */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orgSlug = searchParams.get('org')?.trim() || null
    const token = searchParams.get('token')?.trim() || null
    const email = searchParams.get('email')?.trim() || null

    const verified = await verifyPortalViewer(token, email)
    if ('error' in verified) {
      return NextResponse.json({ error: verified.error }, { status: verified.status })
    }
    const { viewer } = verified

    let organizationId: string | null = null
    let orgName: string | null = null
    if (orgSlug) {
      const org = await prisma.organization.findUnique({
        where: { slug: orgSlug },
        select: { id: true, name: true },
      })
      if (org) {
        organizationId = org.id
        orgName = org.name
      }
    }

    const resourceOrgWhere = organizationId
      ? { OR: [{ organizationId: null }, { organizationId }] }
      : {}
    const articleOrgWhere = organizationId
      ? { OR: [{ organizationId: null }, { organizationId }] }
      : {}

    const [allResources, allArticles] = await Promise.all([
      prisma.portalResource.findMany({
        where: resourceOrgWhere,
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.portalArticle.findMany({
        where: articleOrgWhere,
        orderBy: { sortOrder: 'asc' },
      }),
    ])

    const resources = allResources.filter((r) =>
      canSeeResource(
        { id: r.id, lockedByAdmin: r.lockedByAdmin ?? false },
        viewer
      )
    )
    const articles = allArticles.filter((a) =>
      canSeeArticle(
        { id: a.id, lockedByAdmin: a.lockedByAdmin ?? false },
        viewer
      )
    )

    const payload: {
      resources: typeof resources
      articles: typeof articles
      orgName?: string | null
    } = { resources, articles }
    if (orgName) payload.orgName = orgName

    return NextResponse.json(payload)
  } catch (e) {
    console.error('Portal content error:', e)
    return NextResponse.json(
      { error: 'Failed to load portal content' },
      { status: 500 }
    )
  }
}
