-- CreateTable
CREATE TABLE "OrderLine" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "location" TEXT,
    "barcode" TEXT,
    "requestedQuantity" INTEGER NOT NULL,
    "preparedQuantity" INTEGER NOT NULL DEFAULT 0,
    "missingQuantity" INTEGER NOT NULL DEFAULT 0,
    "lineNumber" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "OrderLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderLine_orderId_idx" ON "OrderLine"("orderId");

-- CreateIndex
CREATE INDEX "OrderLine_sku_idx" ON "OrderLine"("sku");

-- CreateIndex
CREATE INDEX "OrderLine_barcode_idx" ON "OrderLine"("barcode");

-- CreateIndex
CREATE INDEX "OrderLine_location_idx" ON "OrderLine"("location");

-- AddForeignKey
ALTER TABLE "OrderLine" ADD CONSTRAINT "OrderLine_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
