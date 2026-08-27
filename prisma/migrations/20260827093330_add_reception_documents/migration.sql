-- CreateTable
CREATE TABLE "ReceptionDocument" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "receptionId" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'DELIVERY_NOTE',
    "name" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "content" BYTEA NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mailConnectionId" TEXT,

    CONSTRAINT "ReceptionDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReceptionDocument_companyId_idx" ON "ReceptionDocument"("companyId");

-- CreateIndex
CREATE INDEX "ReceptionDocument_receptionId_idx" ON "ReceptionDocument"("receptionId");

-- CreateIndex
CREATE INDEX "ReceptionDocument_companyId_receptionId_idx" ON "ReceptionDocument"("companyId", "receptionId");

-- CreateIndex
CREATE INDEX "ReceptionDocument_capturedAt_idx" ON "ReceptionDocument"("capturedAt");

-- AddForeignKey
ALTER TABLE "ReceptionDocument" ADD CONSTRAINT "ReceptionDocument_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceptionDocument" ADD CONSTRAINT "ReceptionDocument_receptionId_fkey" FOREIGN KEY ("receptionId") REFERENCES "Reception"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceptionDocument" ADD CONSTRAINT "ReceptionDocument_mailConnectionId_fkey" FOREIGN KEY ("mailConnectionId") REFERENCES "MailConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
