/*
  Warnings:

  - You are about to drop the column `offerNumber` on the `OfferProduct` table. All the data in the column will be lost.
  - You are about to drop the `_OfferToOfferProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `offerId` to the `OfferProduct` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_OfferToOfferProduct" DROP CONSTRAINT "_OfferToOfferProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_OfferToOfferProduct" DROP CONSTRAINT "_OfferToOfferProduct_B_fkey";

-- AlterTable
ALTER TABLE "OfferProduct" DROP COLUMN "offerNumber",
ADD COLUMN     "offerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_OfferToOfferProduct";

-- AddForeignKey
ALTER TABLE "OfferProduct" ADD CONSTRAINT "OfferProduct_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("offerId") ON DELETE RESTRICT ON UPDATE CASCADE;
