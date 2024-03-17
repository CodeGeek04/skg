/*
  Warnings:

  - The primary key for the `OfferProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `OfferProduct` table. All the data in the column will be lost.
  - You are about to drop the column `offerNumber` on the `OfferProduct` table. All the data in the column will be lost.
  - The required column `offerProductId` was added to the `OfferProduct` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "OfferProduct" DROP CONSTRAINT "OfferProduct_offerNumber_fkey";

-- AlterTable
ALTER TABLE "OfferProduct" DROP CONSTRAINT "OfferProduct_pkey",
DROP COLUMN "id",
DROP COLUMN "offerNumber",
ADD COLUMN     "offerProductId" TEXT NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 0,
ADD CONSTRAINT "OfferProduct_pkey" PRIMARY KEY ("offerProductId");

-- CreateTable
CREATE TABLE "_OfferToOfferProduct" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OfferToOfferProduct_AB_unique" ON "_OfferToOfferProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_OfferToOfferProduct_B_index" ON "_OfferToOfferProduct"("B");

-- AddForeignKey
ALTER TABLE "_OfferToOfferProduct" ADD CONSTRAINT "_OfferToOfferProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Offer"("offerNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfferToOfferProduct" ADD CONSTRAINT "_OfferToOfferProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "OfferProduct"("offerProductId") ON DELETE CASCADE ON UPDATE CASCADE;
