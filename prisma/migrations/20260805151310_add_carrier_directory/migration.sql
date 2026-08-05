-- CreateTable
CREATE TABLE "Carrier" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "contactName" TEXT,
    "email" TEXT,
    "secondaryEmail" TEXT,
    "phone" TEXT,
    "averageLeadTimeHours" INTEGER,
    "notes" TEXT,
    "supportsPallet" BOOLEAN NOT NULL DEFAULT true,
    "supportsParcel" BOOLEAN NOT NULL DEFAULT false,
    "supportsExpress" BOOLEAN NOT NULL DEFAULT false,
    "supportsNational" BOOLEAN NOT NULL DEFAULT true,
    "supportsInternational" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carrier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Carrier_companyId_idx" ON "Carrier"("companyId");

-- CreateIndex
CREATE INDEX "Carrier_companyId_isActive_idx" ON "Carrier"("companyId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Carrier_companyId_name_key" ON "Carrier"("companyId", "name");

-- AddForeignKey
ALTER TABLE "Carrier" ADD CONSTRAINT "Carrier_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
