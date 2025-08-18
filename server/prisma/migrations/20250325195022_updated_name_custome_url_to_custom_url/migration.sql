/*
  Warnings:

  - You are about to drop the column `customeUrl` on the `Urls` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Urls" DROP COLUMN "customeUrl",
ADD COLUMN     "customUrl" TEXT,
ADD COLUMN     "qr_link" TEXT;
