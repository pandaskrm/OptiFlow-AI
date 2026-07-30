-- CreateTable
CREATE TABLE "ErpConnection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiUrl" TEXT,
    "apiKeyEncrypted" TEXT,
    "externalCompanyId" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'DISCONNECTED',
    "lastTestedAt" DATETIME,
    "lastSyncedAt" DATETIME,
    "lastError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ErpConnection_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "carrier" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Normale',
    "status" TEXT NOT NULL DEFAULT 'Ã€ prÃ©parer',
    "totalLines" INTEGER NOT NULL DEFAULT 0,
    "preparedLines" INTEGER NOT NULL DEFAULT 0,
    "scheduledAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "companyId" TEXT,
    CONSTRAINT "Order_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("carrier", "companyId", "completedAt", "createdAt", "customer", "id", "number", "preparedLines", "priority", "scheduledAt", "status", "totalLines", "updatedAt") SELECT "carrier", "companyId", "completedAt", "createdAt", "customer", "id", "number", "preparedLines", "priority", "scheduledAt", "status", "totalLines", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_number_key" ON "Order"("number");
CREATE INDEX "Order_companyId_idx" ON "Order"("companyId");
CREATE TABLE "new_Shipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "orderNumber" TEXT,
    "customer" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "dock" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Ã€ expÃ©dier',
    "pallets" INTEGER NOT NULL DEFAULT 0,
    "packages" INTEGER NOT NULL DEFAULT 0,
    "scheduledAt" DATETIME,
    "shippedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "companyId" TEXT,
    CONSTRAINT "Shipment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Shipment" ("carrier", "companyId", "createdAt", "customer", "dock", "id", "number", "orderNumber", "packages", "pallets", "scheduledAt", "shippedAt", "status", "updatedAt") SELECT "carrier", "companyId", "createdAt", "customer", "dock", "id", "number", "orderNumber", "packages", "pallets", "scheduledAt", "shippedAt", "status", "updatedAt" FROM "Shipment";
DROP TABLE "Shipment";
ALTER TABLE "new_Shipment" RENAME TO "Shipment";
CREATE UNIQUE INDEX "Shipment_number_key" ON "Shipment"("number");
CREATE INDEX "Shipment_companyId_idx" ON "Shipment"("companyId");
CREATE TABLE "new_Workforce" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "team" TEXT,
    "zone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PrÃ©sent',
    "workedMinutes" INTEGER NOT NULL DEFAULT 0,
    "processedUnits" INTEGER NOT NULL DEFAULT 0,
    "workDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "companyId" TEXT,
    CONSTRAINT "Workforce_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Workforce" ("companyId", "createdAt", "employeeNumber", "id", "name", "processedUnits", "status", "team", "updatedAt", "workDate", "workedMinutes", "zone") SELECT "companyId", "createdAt", "employeeNumber", "id", "name", "processedUnits", "status", "team", "updatedAt", "workDate", "workedMinutes", "zone" FROM "Workforce";
DROP TABLE "Workforce";
ALTER TABLE "new_Workforce" RENAME TO "Workforce";
CREATE UNIQUE INDEX "Workforce_employeeNumber_key" ON "Workforce"("employeeNumber");
CREATE INDEX "Workforce_companyId_idx" ON "Workforce"("companyId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ErpConnection_companyId_idx" ON "ErpConnection"("companyId");

-- CreateIndex
CREATE INDEX "ErpConnection_provider_idx" ON "ErpConnection"("provider");

-- CreateIndex
CREATE INDEX "ErpConnection_status_idx" ON "ErpConnection"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ErpConnection_companyId_name_key" ON "ErpConnection"("companyId", "name");
