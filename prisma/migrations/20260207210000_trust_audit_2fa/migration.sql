-- AlterTable
ALTER TABLE "User" ADD COLUMN "twoFactorSecret" TEXT;
ALTER TABLE "User" ADD COLUMN "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "TrustCenterAuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "requestId" TEXT,
    "userId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrustCenterAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrustCenterAuditLog_requestId_idx" ON "TrustCenterAuditLog"("requestId");
CREATE INDEX "TrustCenterAuditLog_userId_idx" ON "TrustCenterAuditLog"("userId");
CREATE INDEX "TrustCenterAuditLog_createdAt_idx" ON "TrustCenterAuditLog"("createdAt");

-- CreateTable (2FA pending/success tokens)
CREATE TABLE "AuthPendingToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthPendingToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AuthPendingToken_token_key" ON "AuthPendingToken"("token");
CREATE INDEX "AuthPendingToken_token_idx" ON "AuthPendingToken"("token");
CREATE INDEX "AuthPendingToken_expiresAt_idx" ON "AuthPendingToken"("expiresAt");
