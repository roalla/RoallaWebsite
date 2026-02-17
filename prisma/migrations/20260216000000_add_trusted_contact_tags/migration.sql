-- AlterTable
ALTER TABLE "TrustedContact" ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
