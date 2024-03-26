/*
  Warnings:

  - The primary key for the `Offer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updatedDate` on the `Offer` table. All the data in the column will be lost.
  - The required column `offerId` was added to the `Offer` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "_OfferToOfferProduct" DROP CONSTRAINT "_OfferToOfferProduct_A_fkey";

-- AlterTable
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_pkey",
DROP COLUMN "updatedDate",
ADD COLUMN     "isCurrent" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "offerId" TEXT NOT NULL,
ALTER COLUMN "offerNumber" DROP DEFAULT,
ALTER COLUMN "offerNumber" SET DATA TYPE TEXT,
ADD CONSTRAINT "Offer_pkey" PRIMARY KEY ("offerId");
DROP SEQUENCE "Offer_offerNumber_seq";

-- AlterTable
ALTER TABLE "_OfferToOfferProduct" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "_OfferToOfferProduct" ADD CONSTRAINT "_OfferToOfferProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Offer"("offerId") ON DELETE CASCADE ON UPDATE CASCADE;
