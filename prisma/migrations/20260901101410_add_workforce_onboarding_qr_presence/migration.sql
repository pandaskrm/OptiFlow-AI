/*
  Warnings:

  - A unique constraint covering the columns `[membershipId]` on the table `Workforce` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Workforce" ADD COLUMN     "jobId" TEXT,
ADD COLUMN     "membershipId" TEXT,
ADD COLUMN     "onboardingSource" TEXT NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "onboardingStatus" TEXT NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "WorkforceJob" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkforceJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkforceAccessCode" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "codeHint" TEXT,
    "agency" TEXT,
    "contractType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkforceAccessCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresenceQrSession" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "workDate" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "tokenHint" TEXT,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "printedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresenceQrSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkforceJob_companyId_isActive_idx" ON "WorkforceJob"("companyId", "isActive");

-- CreateIndex
CREATE INDEX "WorkforceJob_companyId_service_idx" ON "WorkforceJob"("companyId", "service");

-- CreateIndex
CREATE UNIQUE INDEX "WorkforceJob_companyId_name_service_key" ON "WorkforceJob"("companyId", "name", "service");

-- CreateIndex
CREATE UNIQUE INDEX "WorkforceAccessCode_codeHash_key" ON "WorkforceAccessCode"("codeHash");

-- CreateIndex
CREATE INDEX "WorkforceAccessCode_companyId_isActive_idx" ON "WorkforceAccessCode"("companyId", "isActive");

-- CreateIndex
CREATE INDEX "WorkforceAccessCode_companyId_agency_idx" ON "WorkforceAccessCode"("companyId", "agency");

-- CreateIndex
CREATE INDEX "WorkforceAccessCode_expiresAt_idx" ON "WorkforceAccessCode"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PresenceQrSession_tokenHash_key" ON "PresenceQrSession"("tokenHash");

-- CreateIndex
CREATE INDEX "PresenceQrSession_companyId_workDate_type_idx" ON "PresenceQrSession"("companyId", "workDate", "type");

-- CreateIndex
CREATE INDEX "PresenceQrSession_companyId_isActive_idx" ON "PresenceQrSession"("companyId", "isActive");

-- CreateIndex
CREATE INDEX "PresenceQrSession_validUntil_idx" ON "PresenceQrSession"("validUntil");

-- CreateIndex
CREATE UNIQUE INDEX "Workforce_membershipId_key" ON "Workforce"("membershipId");

-- CreateIndex
CREATE INDEX "Workforce_jobId_idx" ON "Workforce"("jobId");

-- CreateIndex
CREATE INDEX "Workforce_companyId_service_idx" ON "Workforce"("companyId", "service");

-- CreateIndex
CREATE INDEX "Workforce_companyId_contractType_idx" ON "Workforce"("companyId", "contractType");

-- AddForeignKey
ALTER TABLE "Workforce" ADD CONSTRAINT "Workforce_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "WorkforceJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workforce" ADD CONSTRAINT "Workforce_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkforceJob" ADD CONSTRAINT "WorkforceJob_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkforceAccessCode" ADD CONSTRAINT "WorkforceAccessCode_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresenceQrSession" ADD CONSTRAINT "PresenceQrSession_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
