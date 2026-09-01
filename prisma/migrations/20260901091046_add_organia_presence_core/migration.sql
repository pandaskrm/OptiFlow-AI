-- AlterTable
ALTER TABLE "Workforce" ADD COLUMN     "agency" TEXT,
ADD COLUMN     "contractType" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "service" TEXT;

-- CreateTable
CREATE TABLE "PresenceSchedule" (
    "id" TEXT NOT NULL,
    "workforceId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "morningStart" TEXT,
    "morningEnd" TEXT,
    "afternoonStart" TEXT,
    "afternoonEnd" TEXT,
    "isWorkingDay" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresenceSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresencePunch" (
    "id" TEXT NOT NULL,
    "workforceId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "punchedAt" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "deviceId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PresencePunch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresenceDay" (
    "id" TEXT NOT NULL,
    "workforceId" INTEGER NOT NULL,
    "workDate" TIMESTAMP(3) NOT NULL,
    "dayCode" TEXT,
    "plannedMinutes" INTEGER NOT NULL DEFAULT 0,
    "calculatedMinutes" INTEGER NOT NULL DEFAULT 0,
    "approvedMinutes" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "anomaly" BOOLEAN NOT NULL DEFAULT false,
    "anomalyReason" TEXT,
    "note" TEXT,
    "managerValidatedAt" TIMESTAMP(3),
    "managerValidatedBy" TEXT,
    "hrValidatedAt" TIMESTAMP(3),
    "hrValidatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresenceDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresenceCorrection" (
    "id" TEXT NOT NULL,
    "presenceDayId" TEXT NOT NULL,
    "originalMinutes" INTEGER,
    "correctedMinutes" INTEGER NOT NULL,
    "originalDayCode" TEXT,
    "correctedDayCode" TEXT,
    "reason" TEXT NOT NULL,
    "correctedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PresenceCorrection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PresenceSchedule_workforceId_idx" ON "PresenceSchedule"("workforceId");

-- CreateIndex
CREATE INDEX "PresenceSchedule_workforceId_dayOfWeek_idx" ON "PresenceSchedule"("workforceId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "PresencePunch_workforceId_punchedAt_idx" ON "PresencePunch"("workforceId", "punchedAt");

-- CreateIndex
CREATE INDEX "PresencePunch_punchedAt_idx" ON "PresencePunch"("punchedAt");

-- CreateIndex
CREATE INDEX "PresenceDay_workDate_idx" ON "PresenceDay"("workDate");

-- CreateIndex
CREATE INDEX "PresenceDay_status_idx" ON "PresenceDay"("status");

-- CreateIndex
CREATE INDEX "PresenceDay_dayCode_idx" ON "PresenceDay"("dayCode");

-- CreateIndex
CREATE UNIQUE INDEX "PresenceDay_workforceId_workDate_key" ON "PresenceDay"("workforceId", "workDate");

-- CreateIndex
CREATE INDEX "PresenceCorrection_presenceDayId_idx" ON "PresenceCorrection"("presenceDayId");

-- CreateIndex
CREATE INDEX "PresenceCorrection_createdAt_idx" ON "PresenceCorrection"("createdAt");

-- AddForeignKey
ALTER TABLE "PresenceSchedule" ADD CONSTRAINT "PresenceSchedule_workforceId_fkey" FOREIGN KEY ("workforceId") REFERENCES "Workforce"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresencePunch" ADD CONSTRAINT "PresencePunch_workforceId_fkey" FOREIGN KEY ("workforceId") REFERENCES "Workforce"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresenceDay" ADD CONSTRAINT "PresenceDay_workforceId_fkey" FOREIGN KEY ("workforceId") REFERENCES "Workforce"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresenceCorrection" ADD CONSTRAINT "PresenceCorrection_presenceDayId_fkey" FOREIGN KEY ("presenceDayId") REFERENCES "PresenceDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
