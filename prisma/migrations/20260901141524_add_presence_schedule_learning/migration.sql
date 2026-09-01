-- CreateTable
CREATE TABLE "PresenceScheduleHabit" (
    "id" TEXT NOT NULL,
    "workforceId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "isWorkingDay" BOOLEAN NOT NULL,
    "morningStart" TEXT,
    "morningEnd" TEXT,
    "afternoonStart" TEXT,
    "afternoonEnd" TEXT,
    "sampleCount" INTEGER NOT NULL DEFAULT 0,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "firstObservedAt" TIMESTAMP(3),
    "lastObservedAt" TIMESTAMP(3),
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveUntil" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresenceScheduleHabit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresenceScheduleChange" (
    "id" TEXT NOT NULL,
    "workforceId" INTEGER NOT NULL,
    "workDate" TIMESTAMP(3) NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "expectedSnapshot" TEXT,
    "actualSnapshot" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'INFO',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "acknowledgedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresenceScheduleChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PresenceScheduleHabit_workforceId_dayOfWeek_status_idx" ON "PresenceScheduleHabit"("workforceId", "dayOfWeek", "status");

-- CreateIndex
CREATE INDEX "PresenceScheduleHabit_workforceId_effectiveFrom_idx" ON "PresenceScheduleHabit"("workforceId", "effectiveFrom");

-- CreateIndex
CREATE INDEX "PresenceScheduleHabit_status_idx" ON "PresenceScheduleHabit"("status");

-- CreateIndex
CREATE INDEX "PresenceScheduleChange_workforceId_workDate_idx" ON "PresenceScheduleChange"("workforceId", "workDate");

-- CreateIndex
CREATE INDEX "PresenceScheduleChange_workforceId_status_idx" ON "PresenceScheduleChange"("workforceId", "status");

-- CreateIndex
CREATE INDEX "PresenceScheduleChange_workDate_status_idx" ON "PresenceScheduleChange"("workDate", "status");

-- AddForeignKey
ALTER TABLE "PresenceScheduleHabit" ADD CONSTRAINT "PresenceScheduleHabit_workforceId_fkey" FOREIGN KEY ("workforceId") REFERENCES "Workforce"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresenceScheduleChange" ADD CONSTRAINT "PresenceScheduleChange_workforceId_fkey" FOREIGN KEY ("workforceId") REFERENCES "Workforce"("id") ON DELETE CASCADE ON UPDATE CASCADE;
