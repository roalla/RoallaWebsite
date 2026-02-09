-- CreateTable
CREATE TABLE "TrustedContact" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "serviceOrRole" TEXT,
    "notes" TEXT,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrustedContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrustedContact_organizationId_idx" ON "TrustedContact"("organizationId");

-- CreateIndex
CREATE INDEX "TrustedContact_createdByUserId_idx" ON "TrustedContact"("createdByUserId");

-- AddForeignKey
ALTER TABLE "TrustedContact" ADD CONSTRAINT "TrustedContact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
