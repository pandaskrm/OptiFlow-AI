-- AlterTable
ALTER TABLE "MailMessage" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "outlookFolderId" TEXT,
ADD COLUMN     "outlookFolderName" TEXT,
ADD COLUMN     "readAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "MailMessage_companyId_isRead_idx" ON "MailMessage"("companyId", "isRead");

-- CreateIndex
CREATE INDEX "MailMessage_companyId_outlookFolderId_idx" ON "MailMessage"("companyId", "outlookFolderId");
