-- CreateTable
CREATE TABLE "Reception" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "dock" TEXT NOT NULL,
    "pallets" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "scheduledAt" TEXT NOT NULL,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "carrier" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Normale',
    "status" TEXT NOT NULL DEFAULT 'À préparer',
    "totalLines" INTEGER NOT NULL DEFAULT 0,
    "preparedLines" INTEGER NOT NULL DEFAULT 0,
    "scheduledAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "orderNumber" TEXT,
    "customer" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "dock" TEXT,
    "status" TEXT NOT NULL DEFAULT 'À expédier',
    "pallets" INTEGER NOT NULL DEFAULT 0,
    "packages" INTEGER NOT NULL DEFAULT 0,
    "scheduledAt" DATETIME,
    "shippedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sku" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "location" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "minimum" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Workforce" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "team" TEXT,
    "zone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Présent',
    "workedMinutes" INTEGER NOT NULL DEFAULT 0,
    "processedUnits" INTEGER NOT NULL DEFAULT 0,
    "workDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Reception_number_key" ON "Reception"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Order_number_key" ON "Order"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_number_key" ON "Shipment"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_sku_key" ON "Inventory"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Workforce_employeeNumber_key" ON "Workforce"("employeeNumber");
