/*
  Warnings:

  - You are about to drop the column `mailConnectionId` on the `ReceptionDocument` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReceptionDocument" DROP CONSTRAINT "ReceptionDocument_mailConnectionId_fkey";

-- AlterTable
ALTER TABLE "ReceptionDocument" DROP COLUMN "mailConnectionId";
