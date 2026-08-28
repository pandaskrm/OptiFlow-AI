-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'À préparer';

-- AlterTable
ALTER TABLE "Shipment" ALTER COLUMN "status" SET DEFAULT 'À expédier';

-- AlterTable
ALTER TABLE "Workforce" ALTER COLUMN "status" SET DEFAULT 'Présent';
