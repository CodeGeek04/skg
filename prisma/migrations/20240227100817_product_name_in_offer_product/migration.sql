/*
  Warnings:

  - Added the required column `productName` to the `OfferProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OfferProduct" ADD COLUMN     "productName" TEXT NOT NULL;
