-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Reception" DROP CONSTRAINT "Reception_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Workforce" DROP CONSTRAINT "Workforce_companyId_fkey";

-- DropIndex
DROP INDEX "Inventory_sku_key";

-- DropIndex
DROP INDEX "Order_number_key";

-- DropIndex
DROP INDEX "Reception_number_key";

-- DropIndex
DROP INDEX "Shipment_number_key";

-- DropIndex
DROP INDEX "Workforce_employeeNumber_key";

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Reception" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Shipment" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Workforce" ALTER COLUMN "companyId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_companyId_sku_key" ON "Inventory"("companyId", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "Order_companyId_number_key" ON "Order"("companyId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Reception_companyId_number_key" ON "Reception"("companyId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_companyId_number_key" ON "Shipment"("companyId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Workforce_companyId_employeeNumber_key" ON "Workforce"("companyId", "employeeNumber");

-- AddForeignKey
ALTER TABLE "Reception" ADD CONSTRAINT "Reception_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workforce" ADD CONSTRAINT "Workforce_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
