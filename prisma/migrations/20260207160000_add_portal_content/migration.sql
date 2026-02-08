-- CreateTable
CREATE TABLE "PortalResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "downloadUrl" TEXT,
    "linkUrl" TEXT,
    "color" TEXT NOT NULL DEFAULT 'from-blue-500 to-blue-600',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortalResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "readTime" TEXT,
    "category" TEXT,
    "url" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortalArticle_pkey" PRIMARY KEY ("id")
);
