/*
  Warnings:

  - Added the required column `listPrice` to the `OfferProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OfferProduct" ADD COLUMN     "listPrice" DOUBLE PRECISION NOT NULL;
