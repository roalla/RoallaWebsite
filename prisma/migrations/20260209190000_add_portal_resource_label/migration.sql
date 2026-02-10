-- AlterTable PortalResource: add optional label (e.g. "2 min", "Video") for link-style items
ALTER TABLE "PortalResource" ADD COLUMN IF NOT EXISTS "label" TEXT;
