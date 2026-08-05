-- CreateTable
CREATE TABLE "MailAttachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contentType" TEXT,
    "size" INTEGER NOT NULL DEFAULT 0,
    "isInline" BOOLEAN NOT NULL DEFAULT false,
    "content" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MailAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MailAttachment_messageId_idx" ON "MailAttachment"("messageId");

-- CreateIndex
CREATE INDEX "MailAttachment_name_idx" ON "MailAttachment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MailAttachment_messageId_externalId_key" ON "MailAttachment"("messageId", "externalId");

-- AddForeignKey
ALTER TABLE "MailAttachment" ADD CONSTRAINT "MailAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "MailMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
