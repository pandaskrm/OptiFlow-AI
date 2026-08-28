/*
  Warnings:

  - A unique constraint covering the columns `[pdaReservationToken]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "pdaReservationToken" TEXT,
ADD COLUMN     "pdaReservedAt" TIMESTAMP(3),
ADD COLUMN     "pdaReservedBy" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_pdaReservationToken_key" ON "Order"("pdaReservationToken");
