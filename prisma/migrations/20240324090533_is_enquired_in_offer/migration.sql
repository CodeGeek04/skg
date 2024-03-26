/*
  Warnings:

  - You are about to drop the column `isEnquired` on the `OfferProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "isEnquired" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "OfferProduct" DROP COLUMN "isEnquired";
