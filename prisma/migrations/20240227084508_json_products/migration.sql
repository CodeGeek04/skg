/*
  Warnings:

  - You are about to drop the `OfferProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EnquiryToOfferProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OfferToOfferProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OfferProduct" DROP CONSTRAINT "OfferProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "_EnquiryToOfferProduct" DROP CONSTRAINT "_EnquiryToOfferProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_EnquiryToOfferProduct" DROP CONSTRAINT "_EnquiryToOfferProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "_OfferToOfferProduct" DROP CONSTRAINT "_OfferToOfferProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_OfferToOfferProduct" DROP CONSTRAINT "_OfferToOfferProduct_B_fkey";

-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN     "offerProducts" JSONB[];

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "offerProducts" JSONB[];

-- DropTable
DROP TABLE "OfferProduct";

-- DropTable
DROP TABLE "_EnquiryToOfferProduct";

-- DropTable
DROP TABLE "_OfferToOfferProduct";
