/**
 * One-time migration: copy PortalArticle rows into PortalResource (link-only items),
 * update all FKs (grants, bundle items, gated access) to use the new resource IDs,
 * then delete PortalArticle rows.
 *
 * Run after: prisma migrate (with label column)
 * Run before: migration that drops PortalArticle and articleId columns
 *
 * Usage: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/migrate-articles-to-resources.ts
 * Or: npx tsx scripts/migrate-articles-to-resources.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEFAULT_COLOR = 'from-teal-500 to-teal-600'

async function main() {
  const articles = await prisma.portalArticle.findMany({ orderBy: { sortOrder: 'asc' } })
  if (articles.length === 0) {
    console.log('No articles to migrate.')
    return
  }

  const articleIdToResourceId = new Map<string, string>()

  for (const a of articles) {
    const resource = await prisma.portalResource.create({
      data: {
        title: a.title,
        description: a.description,
        type: a.category?.trim() || 'Other',
        downloadUrl: null,
        linkUrl: a.url?.trim() || null,
        color: DEFAULT_COLOR,
        sortOrder: a.sortOrder,
        gated: a.gated ?? false,
        lockedByAdmin: a.lockedByAdmin ?? false,
        viewOnly: false,
        label: a.readTime?.trim() || null,
        trustCategory: a.trustCategory?.trim() || null,
        createdByUserId: a.createdByUserId,
        organizationId: a.organizationId,
      },
    })
    articleIdToResourceId.set(a.id, resource.id)
    console.log(`Migrated article "${a.title}" -> resource ${resource.id}`)
  }

  const entries = Array.from(articleIdToResourceId.entries())

  // Update PortalItemGrant: articleId -> resourceId
  for (const [articleId, resourceId] of entries) {
    await prisma.portalItemGrant.updateMany({
      where: { articleId },
      data: { resourceId, articleId: null },
    })
  }

  // Update PortalBundleItem: articleId -> resourceId
  for (const [articleId, resourceId] of entries) {
    await prisma.portalBundleItem.updateMany({
      where: { articleId },
      data: { resourceId, articleId: null },
    })
  }

  // Update GatedAccessRequestItem
  for (const [articleId, resourceId] of entries) {
    await prisma.gatedAccessRequestItem.updateMany({
      where: { articleId },
      data: { resourceId, articleId: null },
    })
  }

  // Update GatedAccessGrant
  for (const [articleId, resourceId] of entries) {
    await prisma.gatedAccessGrant.updateMany({
      where: { articleId },
      data: { resourceId, articleId: null },
    })
  }

  // Delete all PortalArticle rows (must drop FKs first in next migration, so we delete after updating refs)
  const deleted = await prisma.portalArticle.deleteMany({})
  console.log(`Deleted ${deleted.count} article(s). Migration complete.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
