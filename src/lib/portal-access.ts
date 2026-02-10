/**
 * Portal access: verify token+email and compute which resource/article IDs the user can see.
 * Used by portal content API and file serving.
 */
import { prisma } from '@/lib/prisma'

export interface PortalViewer {
  email: string
  fullAccess: boolean
  grantedResourceIds: Set<string>
  grantedArticleIds: Set<string>
  bundleResourceIds: Set<string>
  bundleArticleIds: Set<string>
}

export async function verifyPortalViewer(
  token: string | null,
  email: string | null
): Promise<{ viewer: PortalViewer } | { error: string; status: number }> {
  if (!token?.trim() || !email?.trim()) {
    return { error: 'Token and email are required', status: 400 }
  }
  const accessRequest = await prisma.accessRequest.findFirst({
    where: {
      token: token.trim(),
      email: email.trim().toLowerCase(),
      status: 'approved',
    },
    select: { email: true, fullAccess: true },
  })
  if (!accessRequest) {
    return { error: 'Invalid or expired access token', status: 401 }
  }
  const normalizedEmail = accessRequest.email.toLowerCase()

  const [itemGrants, userBundles] = await Promise.all([
    prisma.portalItemGrant.findMany({
      where: { email: normalizedEmail },
      select: { resourceId: true, articleId: true },
    }),
    prisma.userPortalBundle.findMany({
      where: { email: normalizedEmail },
      select: { bundleId: true },
    }),
  ])

  const grantedResourceIds = new Set<string>()
  const grantedArticleIds = new Set<string>()
  for (const g of itemGrants) {
    if (g.resourceId) grantedResourceIds.add(g.resourceId)
    if (g.articleId) grantedArticleIds.add(g.articleId)
  }

  const bundleIds = userBundles.map((b) => b.bundleId)
  let bundleResourceIds = new Set<string>()
  let bundleArticleIds = new Set<string>()
  if (bundleIds.length > 0) {
    const items = await prisma.portalBundleItem.findMany({
      where: { bundleId: { in: bundleIds } },
      select: { resourceId: true, articleId: true },
    })
    for (const i of items) {
      if (i.resourceId) bundleResourceIds.add(i.resourceId)
      if (i.articleId) bundleArticleIds.add(i.articleId)
    }
  }

  const viewer: PortalViewer = {
    email: normalizedEmail,
    fullAccess: accessRequest.fullAccess ?? false,
    grantedResourceIds,
    grantedArticleIds,
    bundleResourceIds,
    bundleArticleIds,
  }
  return { viewer }
}

/** User can see this resource if: not locked, or has full access, or has grant, or in redeemed bundle */
export function canSeeResource(
  resource: { id: string; lockedByAdmin: boolean },
  viewer: PortalViewer
): boolean {
  if (!resource.lockedByAdmin) return true
  if (viewer.fullAccess) return true
  if (viewer.grantedResourceIds.has(resource.id)) return true
  if (viewer.bundleResourceIds.has(resource.id)) return true
  return false
}

/** User can see this article if: not locked, or has full access, or has grant, or in redeemed bundle */
export function canSeeArticle(
  article: { id: string; lockedByAdmin: boolean },
  viewer: PortalViewer
): boolean {
  if (!article.lockedByAdmin) return true
  if (viewer.fullAccess) return true
  if (viewer.grantedArticleIds.has(article.id)) return true
  if (viewer.bundleArticleIds.has(article.id)) return true
  return false
}
