import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? undefined
  let grantedResourceIds: string[] = []
  let grantedArticleIds: string[] = []

  if (token) {
    const tc = await prisma.trustCenterToken.findUnique({
      where: { token },
    })
    if (tc && tc.expiresAt > new Date()) {
      const grants = await prisma.gatedAccessGrant.findMany({
        where: { email: tc.email, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
      })
      grantedResourceIds = grants.map((g) => g.resourceId).filter(Boolean) as string[]
      grantedArticleIds = grants.map((g) => g.articleId).filter(Boolean) as string[]
    }
  }

  const [resources, articles] = await Promise.all([
    prisma.portalResource.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.portalArticle.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  const resourcesWithAccess = resources.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    type: r.type,
    downloadUrl: r.downloadUrl,
    linkUrl: r.linkUrl,
    color: r.color,
    sortOrder: r.sortOrder,
    gated: r.gated,
    hasAccess: !r.gated || grantedResourceIds.includes(r.id),
  }))

  const articlesWithAccess = articles.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    readTime: a.readTime,
    category: a.category,
    url: a.url,
    sortOrder: a.sortOrder,
    gated: a.gated,
    hasAccess: !a.gated || grantedArticleIds.includes(a.id),
  }))

  return NextResponse.json({ resources: resourcesWithAccess, articles: articlesWithAccess })
}
