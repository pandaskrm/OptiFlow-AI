-- CreateTable
CREATE TABLE "AbsenceRequest" (
    "id" TEXT NOT NULL,
    "workforceId" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "startPart" TEXT NOT NULL DEFAULT 'FULL_DAY',
    "endPart" TEXT NOT NULL DEFAULT 'FULL_DAY',
    "employeeComment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "decidedBy" TEXT,
    "decisionComment" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AbsenceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbsenceRequestDocument" (
    "id" TEXT NOT NULL,
    "absenceRequestId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "contentType" TEXT,
    "size" INTEGER NOT NULL DEFAULT 0,
    "storageKey" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'JUSTIFICATIF',
    "isMedical" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AbsenceRequestDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbsenceApproval" (
    "id" TEXT NOT NULL,
    "absenceRequestId" TEXT NOT NULL,
    "step" INTEGER NOT NULL DEFAULT 1,
    "approverRole" TEXT,
    "approverUserId" TEXT,
    "decision" TEXT NOT NULL DEFAULT 'PENDING',
    "decisionComment" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AbsenceApproval_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AbsenceRequest_workforceId_startDate_idx" ON "AbsenceRequest"("workforceId", "startDate");

-- CreateIndex
CREATE INDEX "AbsenceRequest_companyId_status_idx" ON "AbsenceRequest"("companyId", "status");

-- CreateIndex
CREATE INDEX "AbsenceRequest_status_idx" ON "AbsenceRequest"("status");

-- CreateIndex
CREATE INDEX "AbsenceRequest_startDate_endDate_idx" ON "AbsenceRequest"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "AbsenceRequestDocument_absenceRequestId_idx" ON "AbsenceRequestDocument"("absenceRequestId");

-- CreateIndex
CREATE INDEX "AbsenceRequestDocument_isMedical_idx" ON "AbsenceRequestDocument"("isMedical");

-- CreateIndex
CREATE INDEX "AbsenceApproval_absenceRequestId_step_idx" ON "AbsenceApproval"("absenceRequestId", "step");

-- CreateIndex
CREATE INDEX "AbsenceApproval_approverUserId_idx" ON "AbsenceApproval"("approverUserId");

-- CreateIndex
CREATE INDEX "AbsenceApproval_decision_idx" ON "AbsenceApproval"("decision");

-- AddForeignKey
ALTER TABLE "AbsenceRequest" ADD CONSTRAINT "AbsenceRequest_workforceId_fkey" FOREIGN KEY ("workforceId") REFERENCES "Workforce"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsenceRequest" ADD CONSTRAINT "AbsenceRequest_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsenceRequestDocument" ADD CONSTRAINT "AbsenceRequestDocument_absenceRequestId_fkey" FOREIGN KEY ("absenceRequestId") REFERENCES "AbsenceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsenceApproval" ADD CONSTRAINT "AbsenceApproval_absenceRequestId_fkey" FOREIGN KEY ("absenceRequestId") REFERENCES "AbsenceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
