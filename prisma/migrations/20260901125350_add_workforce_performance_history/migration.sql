-- CreateTable
CREATE TABLE "WorkforcePerformanceDay" (
    "id" TEXT NOT NULL,
    "workforceId" INTEGER NOT NULL,
    "workDate" TIMESTAMP(3) NOT NULL,
    "preparedOrders" INTEGER NOT NULL DEFAULT 0,
    "preparedLines" INTEGER NOT NULL DEFAULT 0,
    "preparedParcels" INTEGER NOT NULL DEFAULT 0,
    "preparedQuantity" INTEGER NOT NULL DEFAULT 0,
    "workedMinutes" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'ORGANIA',
    "sourceReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkforcePerformanceDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkforcePerformanceDay_workDate_idx" ON "WorkforcePerformanceDay"("workDate");

-- CreateIndex
CREATE INDEX "WorkforcePerformanceDay_workforceId_workDate_idx" ON "WorkforcePerformanceDay"("workforceId", "workDate");

-- CreateIndex
CREATE UNIQUE INDEX "WorkforcePerformanceDay_workforceId_workDate_key" ON "WorkforcePerformanceDay"("workforceId", "workDate");

-- AddForeignKey
ALTER TABLE "WorkforcePerformanceDay" ADD CONSTRAINT "WorkforcePerformanceDay_workforceId_fkey" FOREIGN KEY ("workforceId") REFERENCES "Workforce"("id") ON DELETE CASCADE ON UPDATE CASCADE;
