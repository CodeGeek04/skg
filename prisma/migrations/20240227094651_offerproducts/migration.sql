/*
  Warnings:

  - You are about to drop the column `offerProducts` on the `Enquiry` table. All the data in the column will be lost.
  - You are about to drop the column `offerProducts` on the `Offer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Enquiry" DROP COLUMN "offerProducts";

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "offerProducts";

-- CreateTable
CREATE TABLE "OfferProduct" (
    "offerProductId" TEXT NOT NULL,
    "offerNumber" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfferProduct_pkey" PRIMARY KEY ("offerProductId")
);

-- CreateTable
CREATE TABLE "_OfferToOfferProduct" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EnquiryToOfferProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OfferToOfferProduct_AB_unique" ON "_OfferToOfferProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_OfferToOfferProduct_B_index" ON "_OfferToOfferProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EnquiryToOfferProduct_AB_unique" ON "_EnquiryToOfferProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_EnquiryToOfferProduct_B_index" ON "_EnquiryToOfferProduct"("B");

-- AddForeignKey
ALTER TABLE "OfferProduct" ADD CONSTRAINT "OfferProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfferToOfferProduct" ADD CONSTRAINT "_OfferToOfferProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Offer"("offerNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfferToOfferProduct" ADD CONSTRAINT "_OfferToOfferProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "OfferProduct"("offerProductId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnquiryToOfferProduct" ADD CONSTRAINT "_EnquiryToOfferProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Enquiry"("enquiryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnquiryToOfferProduct" ADD CONSTRAINT "_EnquiryToOfferProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "OfferProduct"("offerProductId") ON DELETE CASCADE ON UPDATE CASCADE;
