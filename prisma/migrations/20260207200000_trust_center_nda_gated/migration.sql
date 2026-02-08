-- AlterTable: add gated to PortalResource and PortalArticle
ALTER TABLE "PortalResource" ADD COLUMN "gated" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "PortalArticle" ADD COLUMN "gated" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable NdaAgreement
CREATE TABLE "NdaAgreement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "effectiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NdaAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable NdaSignature
CREATE TABLE "NdaSignature" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "NdaSignature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex NdaSignature
CREATE INDEX "NdaSignature_email_idx" ON "NdaSignature"("email");
CREATE INDEX "NdaSignature_agreementId_idx" ON "NdaSignature"("agreementId");

-- AddForeignKey NdaSignature
ALTER TABLE "NdaSignature" ADD CONSTRAINT "NdaSignature_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "NdaAgreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable GatedAccessRequest
CREATE TABLE "GatedAccessRequest" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "ndaSignatureId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedByUserId" TEXT,

    CONSTRAINT "GatedAccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable GatedAccessRequestItem
CREATE TABLE "GatedAccessRequestItem" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "resourceId" TEXT,
    "articleId" TEXT,

    CONSTRAINT "GatedAccessRequestItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "GatedAccessRequestItem_requestId_idx" ON "GatedAccessRequestItem"("requestId");

-- AddForeignKey GatedAccessRequestItem
ALTER TABLE "GatedAccessRequestItem" ADD CONSTRAINT "GatedAccessRequestItem_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "GatedAccessRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey GatedAccessRequest
ALTER TABLE "GatedAccessRequest" ADD CONSTRAINT "GatedAccessRequest_ndaSignatureId_fkey" FOREIGN KEY ("ndaSignatureId") REFERENCES "NdaSignature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GatedAccessRequest" ADD CONSTRAINT "GatedAccessRequest_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable GatedAccessGrant
CREATE TABLE "GatedAccessGrant" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "resourceId" TEXT,
    "articleId" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedByUserId" TEXT,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "GatedAccessGrant_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "GatedAccessGrant_email_idx" ON "GatedAccessGrant"("email");
CREATE INDEX "GatedAccessGrant_resourceId_idx" ON "GatedAccessGrant"("resourceId");
CREATE INDEX "GatedAccessGrant_articleId_idx" ON "GatedAccessGrant"("articleId");

ALTER TABLE "GatedAccessGrant" ADD CONSTRAINT "GatedAccessGrant_grantedByUserId_fkey" FOREIGN KEY ("grantedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable TrustCenterToken
CREATE TABLE "TrustCenterToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrustCenterToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TrustCenterToken_token_key" ON "TrustCenterToken"("token");
CREATE INDEX "TrustCenterToken_token_idx" ON "TrustCenterToken"("token");
CREATE INDEX "TrustCenterToken_email_idx" ON "TrustCenterToken"("email");
