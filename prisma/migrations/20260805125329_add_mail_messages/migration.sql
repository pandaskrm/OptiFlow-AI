-- CreateTable
CREATE TABLE "MailMessage" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "connectionId" TEXT,
    "receptionId" INTEGER,
    "externalId" TEXT NOT NULL,
    "internetMessageId" TEXT,
    "subject" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,
    "senderName" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "bodyText" TEXT,
    "bodyHtml" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "classification" TEXT,
    "confidence" DOUBLE PRECISION,
    "extractedData" JSONB,
    "processingError" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "membershipId" TEXT,

    CONSTRAINT "MailMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MailMessage_companyId_status_idx" ON "MailMessage"("companyId", "status");

-- CreateIndex
CREATE INDEX "MailMessage_connectionId_idx" ON "MailMessage"("connectionId");

-- CreateIndex
CREATE INDEX "MailMessage_receptionId_idx" ON "MailMessage"("receptionId");

-- CreateIndex
CREATE INDEX "MailMessage_receivedAt_idx" ON "MailMessage"("receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MailMessage_companyId_externalId_key" ON "MailMessage"("companyId", "externalId");

-- AddForeignKey
ALTER TABLE "MailMessage" ADD CONSTRAINT "MailMessage_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailMessage" ADD CONSTRAINT "MailMessage_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "MailConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailMessage" ADD CONSTRAINT "MailMessage_receptionId_fkey" FOREIGN KEY ("receptionId") REFERENCES "Reception"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailMessage" ADD CONSTRAINT "MailMessage_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;
