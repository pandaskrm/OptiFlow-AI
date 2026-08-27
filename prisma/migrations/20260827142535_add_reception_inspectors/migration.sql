-- CreateTable
CREATE TABLE "ReceptionInspector" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "receptionId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReceptionInspector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReceptionInspector_companyId_idx" ON "ReceptionInspector"("companyId");

-- CreateIndex
CREATE INDEX "ReceptionInspector_receptionId_idx" ON "ReceptionInspector"("receptionId");

-- CreateIndex
CREATE INDEX "ReceptionInspector_userId_idx" ON "ReceptionInspector"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReceptionInspector_receptionId_userId_key" ON "ReceptionInspector"("receptionId", "userId");

-- AddForeignKey
ALTER TABLE "ReceptionInspector" ADD CONSTRAINT "ReceptionInspector_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceptionInspector" ADD CONSTRAINT "ReceptionInspector_receptionId_fkey" FOREIGN KEY ("receptionId") REFERENCES "Reception"("id") ON DELETE CASCADE ON UPDATE CASCADE;
