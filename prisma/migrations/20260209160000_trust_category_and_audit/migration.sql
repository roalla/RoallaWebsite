-- AlterTable: add optional trustCategory to portal content
ALTER TABLE "PortalResource" ADD COLUMN "trustCategory" TEXT;
ALTER TABLE "PortalArticle" ADD COLUMN "trustCategory" TEXT;

-- CreateTable: audit log for gated document access
CREATE TABLE "TrustAccessLog" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "resourceId" TEXT,
    "articleId" TEXT,
    "action" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrustAccessLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TrustAccessLog_email_idx" ON "TrustAccessLog"("email");
CREATE INDEX "TrustAccessLog_resourceId_idx" ON "TrustAccessLog"("resourceId");
CREATE INDEX "TrustAccessLog_articleId_idx" ON "TrustAccessLog"("articleId");
CREATE INDEX "TrustAccessLog_accessedAt_idx" ON "TrustAccessLog"("accessedAt");
