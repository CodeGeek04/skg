/*
  Warnings:

  - Added the required column `offerNumber` to the `OfferProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OfferProduct" ADD COLUMN     "offerNumber" INTEGER NOT NULL;
