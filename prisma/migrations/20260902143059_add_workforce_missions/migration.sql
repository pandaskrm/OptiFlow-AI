-- CreateTable
CREATE TABLE "WorkforceMission" (
    "id" TEXT NOT NULL,
    "workforceId" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,
    "agency" TEXT,
    "contractType" TEXT NOT NULL DEFAULT 'INTERIM',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkforceMission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkforceMission_workforceId_status_idx" ON "WorkforceMission"("workforceId", "status");

-- CreateIndex
CREATE INDEX "WorkforceMission_companyId_status_idx" ON "WorkforceMission"("companyId", "status");

-- CreateIndex
CREATE INDEX "WorkforceMission_startDate_endDate_idx" ON "WorkforceMission"("startDate", "endDate");

-- AddForeignKey
ALTER TABLE "WorkforceMission" ADD CONSTRAINT "WorkforceMission_workforceId_fkey" FOREIGN KEY ("workforceId") REFERENCES "Workforce"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkforceMission" ADD CONSTRAINT "WorkforceMission_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
