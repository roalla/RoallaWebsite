-- CreateTable Organization
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");
CREATE INDEX "Organization_slug_idx" ON "Organization"("slug");

-- AlterTable User: add organizationId, addedByUserId
ALTER TABLE "User" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "User" ADD COLUMN "addedByUserId" TEXT;

ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "User" ADD CONSTRAINT "User_addedByUserId_fkey" FOREIGN KEY ("addedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");
CREATE INDEX "User_addedByUserId_idx" ON "User"("addedByUserId");

-- AlterTable PortalResource, PortalArticle: add createdByUserId
ALTER TABLE "PortalResource" ADD COLUMN "createdByUserId" TEXT;
CREATE INDEX "PortalResource_createdByUserId_idx" ON "PortalResource"("createdByUserId");

ALTER TABLE "PortalArticle" ADD COLUMN "createdByUserId" TEXT;
CREATE INDEX "PortalArticle_createdByUserId_idx" ON "PortalArticle"("createdByUserId");

-- CreateTable TeamAuditLog
CREATE TABLE "TeamAuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorUserId" TEXT,
    "targetUserId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TeamAuditLog_actorUserId_idx" ON "TeamAuditLog"("actorUserId");
CREATE INDEX "TeamAuditLog_targetUserId_idx" ON "TeamAuditLog"("targetUserId");
CREATE INDEX "TeamAuditLog_createdAt_idx" ON "TeamAuditLog"("createdAt");
