-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderDate" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'Ãƒâ‚¬ prÃƒÂ©parer';

-- AlterTable
ALTER TABLE "Shipment" ALTER COLUMN "status" SET DEFAULT 'Ãƒâ‚¬ expÃƒÂ©dier';

-- AlterTable
ALTER TABLE "Workforce" ALTER COLUMN "status" SET DEFAULT 'PrÃƒÂ©sent';
