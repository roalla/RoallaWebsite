-- Add lastLoginAt to User for "last active" in partner team view
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);

-- Add organizationId to PortalResource and PortalArticle for org-specific visibility
ALTER TABLE "PortalResource" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;
ALTER TABLE "PortalArticle" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;

CREATE INDEX IF NOT EXISTS "PortalResource_organizationId_idx" ON "PortalResource"("organizationId");
CREATE INDEX IF NOT EXISTS "PortalArticle_organizationId_idx" ON "PortalArticle"("organizationId");

ALTER TABLE "PortalResource" ADD CONSTRAINT "PortalResource_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PortalArticle" ADD CONSTRAINT "PortalArticle_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
