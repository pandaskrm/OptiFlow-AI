-- AlterTable
ALTER TABLE "Reception" ADD COLUMN     "qualityComment" TEXT,
ADD COLUMN     "qualityResult" TEXT,
ADD COLUMN     "qualityValidatedAt" TIMESTAMP(3),
ADD COLUMN     "qualityValidatedBy" TEXT;
