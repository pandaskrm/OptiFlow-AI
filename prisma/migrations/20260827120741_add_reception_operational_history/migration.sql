-- AlterTable
ALTER TABLE "Reception" ADD COLUMN     "arrivedAt" TIMESTAMP(3),
ADD COLUMN     "inspectionStartedAt" TIMESTAMP(3),
ADD COLUMN     "unloadingStartedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ReceptionEvent" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "receptionId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "happenedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReceptionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReceptionEvent_companyId_idx" ON "ReceptionEvent"("companyId");

-- CreateIndex
CREATE INDEX "ReceptionEvent_receptionId_idx" ON "ReceptionEvent"("receptionId");

-- CreateIndex
CREATE INDEX "ReceptionEvent_companyId_receptionId_idx" ON "ReceptionEvent"("companyId", "receptionId");

-- CreateIndex
CREATE INDEX "ReceptionEvent_happenedAt_idx" ON "ReceptionEvent"("happenedAt");

-- AddForeignKey
ALTER TABLE "ReceptionEvent" ADD CONSTRAINT "ReceptionEvent_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceptionEvent" ADD CONSTRAINT "ReceptionEvent_receptionId_fkey" FOREIGN KEY ("receptionId") REFERENCES "Reception"("id") ON DELETE CASCADE ON UPDATE CASCADE;
