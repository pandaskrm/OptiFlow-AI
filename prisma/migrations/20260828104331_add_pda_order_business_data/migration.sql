-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "country" TEXT,
ADD COLUMN     "customerCode" TEXT,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "totalQuantity" INTEGER;
