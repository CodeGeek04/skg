/*
  Warnings:

  - You are about to drop the `Enquiry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EnquiryToOfferProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Enquiry" DROP CONSTRAINT "Enquiry_mobile_fkey";

-- DropForeignKey
ALTER TABLE "Enquiry" DROP CONSTRAINT "Enquiry_projectId_fkey";

-- DropForeignKey
ALTER TABLE "_EnquiryToOfferProduct" DROP CONSTRAINT "_EnquiryToOfferProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_EnquiryToOfferProduct" DROP CONSTRAINT "_EnquiryToOfferProduct_B_fkey";

-- AlterTable
ALTER TABLE "OfferProduct" ADD COLUMN     "isEnquired" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Enquiry";

-- DropTable
DROP TABLE "_EnquiryToOfferProduct";
