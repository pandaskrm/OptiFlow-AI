-- CreateTable
CREATE TABLE "MailConnection" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "host" TEXT,
    "port" INTEGER NOT NULL DEFAULT 993,
    "username" TEXT,
    "passwordEncrypted" TEXT,
    "tenantId" TEXT,
    "clientId" TEXT,
    "clientSecretEncrypted" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'DISCONNECTED',
    "lastTestedAt" TIMESTAMP(3),
    "lastSyncedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MailConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MailConnection_companyId_idx" ON "MailConnection"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "MailConnection_companyId_emailAddress_key" ON "MailConnection"("companyId", "emailAddress");

-- AddForeignKey
ALTER TABLE "MailConnection" ADD CONSTRAINT "MailConnection_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
