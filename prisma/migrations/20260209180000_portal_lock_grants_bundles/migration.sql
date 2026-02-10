-- AlterTable AccessRequest: add fullAccess
ALTER TABLE "AccessRequest" ADD COLUMN IF NOT EXISTS "fullAccess" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable PortalResource: add lockedByAdmin, viewOnly
ALTER TABLE "PortalResource" ADD COLUMN IF NOT EXISTS "lockedByAdmin" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "PortalResource" ADD COLUMN IF NOT EXISTS "viewOnly" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable PortalArticle: add lockedByAdmin
ALTER TABLE "PortalArticle" ADD COLUMN IF NOT EXISTS "lockedByAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable PortalItemGrant
CREATE TABLE IF NOT EXISTS "PortalItemGrant" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "resourceId" TEXT,
    "articleId" TEXT,
    "grantedByUserId" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortalItemGrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable PortalBundle
CREATE TABLE IF NOT EXISTS "PortalBundle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortalBundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable PortalBundleItem
CREATE TABLE IF NOT EXISTS "PortalBundleItem" (
    "id" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "resourceId" TEXT,
    "articleId" TEXT,

    CONSTRAINT "PortalBundleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable PortalCode
CREATE TABLE IF NOT EXISTS "PortalCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "maxRedemptions" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortalCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable PortalCodeRedemption
CREATE TABLE IF NOT EXISTS "PortalCodeRedemption" (
    "id" TEXT NOT NULL,
    "codeId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortalCodeRedemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable UserPortalBundle
CREATE TABLE IF NOT EXISTS "UserPortalBundle" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPortalBundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable PortalAccessLog
CREATE TABLE IF NOT EXISTS "PortalAccessLog" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "resourceId" TEXT,
    "articleId" TEXT,
    "action" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortalAccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "PortalCode_code_key" ON "PortalCode"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "PortalCodeRedemption_codeId_email_key" ON "PortalCodeRedemption"("codeId", "email");
CREATE UNIQUE INDEX IF NOT EXISTS "UserPortalBundle_email_bundleId_key" ON "UserPortalBundle"("email", "bundleId");

CREATE INDEX IF NOT EXISTS "PortalItemGrant_email_idx" ON "PortalItemGrant"("email");
CREATE INDEX IF NOT EXISTS "PortalItemGrant_resourceId_idx" ON "PortalItemGrant"("resourceId");
CREATE INDEX IF NOT EXISTS "PortalItemGrant_articleId_idx" ON "PortalItemGrant"("articleId");
CREATE INDEX IF NOT EXISTS "PortalBundleItem_bundleId_idx" ON "PortalBundleItem"("bundleId");
CREATE INDEX IF NOT EXISTS "PortalCode_code_idx" ON "PortalCode"("code");
CREATE INDEX IF NOT EXISTS "PortalCode_bundleId_idx" ON "PortalCode"("bundleId");
CREATE INDEX IF NOT EXISTS "PortalCodeRedemption_email_idx" ON "PortalCodeRedemption"("email");
CREATE INDEX IF NOT EXISTS "UserPortalBundle_email_idx" ON "UserPortalBundle"("email");
CREATE INDEX IF NOT EXISTS "UserPortalBundle_bundleId_idx" ON "UserPortalBundle"("bundleId");
CREATE INDEX IF NOT EXISTS "PortalAccessLog_email_idx" ON "PortalAccessLog"("email");
CREATE INDEX IF NOT EXISTS "PortalAccessLog_resourceId_idx" ON "PortalAccessLog"("resourceId");
CREATE INDEX IF NOT EXISTS "PortalAccessLog_articleId_idx" ON "PortalAccessLog"("articleId");
CREATE INDEX IF NOT EXISTS "PortalAccessLog_accessedAt_idx" ON "PortalAccessLog"("accessedAt");

-- AddForeignKey
DO $$ BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM pg_constraint WHERE conname = 'PortalItemGrant_resourceId_fkey'
 ) THEN
  ALTER TABLE "PortalItemGrant" ADD CONSTRAINT "PortalItemGrant_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "PortalResource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 END IF;
END $$;
DO $$ BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM pg_constraint WHERE conname = 'PortalItemGrant_articleId_fkey'
 ) THEN
  ALTER TABLE "PortalItemGrant" ADD CONSTRAINT "PortalItemGrant_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "PortalArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 END IF;
END $$;
DO $$ BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM pg_constraint WHERE conname = 'PortalItemGrant_grantedByUserId_fkey'
 ) THEN
  ALTER TABLE "PortalItemGrant" ADD CONSTRAINT "PortalItemGrant_grantedByUserId_fkey" FOREIGN KEY ("grantedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
 END IF;
END $$;
DO $$ BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM pg_constraint WHERE conname = 'PortalBundleItem_bundleId_fkey'
 ) THEN
  ALTER TABLE "PortalBundleItem" ADD CONSTRAINT "PortalBundleItem_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "PortalBundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 END IF;
END $$;
DO $$ BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM pg_constraint WHERE conname = 'PortalBundleItem_resourceId_fkey'
 ) THEN
  ALTER TABLE "PortalBundleItem" ADD CONSTRAINT "PortalBundleItem_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "PortalResource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 END IF;
END $$;
DO $$ BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM pg_constraint WHERE conname = 'PortalBundleItem_articleId_fkey'
 ) THEN
  ALTER TABLE "PortalBundleItem" ADD CONSTRAINT "PortalBundleItem_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "PortalArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 END IF;
END $$;
DO $$ BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM pg_constraint WHERE conname = 'PortalCode_bundleId_fkey'
 ) THEN
  ALTER TABLE "PortalCode" ADD CONSTRAINT "PortalCode_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "PortalBundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 END IF;
END $$;
DO $$ BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM pg_constraint WHERE conname = 'PortalCodeRedemption_codeId_fkey'
 ) THEN
  ALTER TABLE "PortalCodeRedemption" ADD CONSTRAINT "PortalCodeRedemption_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "PortalCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 END IF;
END $$;
DO $$ BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM pg_constraint WHERE conname = 'UserPortalBundle_bundleId_fkey'
 ) THEN
  ALTER TABLE "UserPortalBundle" ADD CONSTRAINT "UserPortalBundle_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "PortalBundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 END IF;
END $$;
