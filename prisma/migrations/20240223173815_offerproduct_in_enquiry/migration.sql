/*
  Warnings:

  - You are about to drop the `_EnquiryToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EnquiryToProduct" DROP CONSTRAINT "_EnquiryToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_EnquiryToProduct" DROP CONSTRAINT "_EnquiryToProduct_B_fkey";

-- DropTable
DROP TABLE "_EnquiryToProduct";

-- CreateTable
CREATE TABLE "_EnquiryToOfferProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EnquiryToOfferProduct_AB_unique" ON "_EnquiryToOfferProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_EnquiryToOfferProduct_B_index" ON "_EnquiryToOfferProduct"("B");

-- AddForeignKey
ALTER TABLE "_EnquiryToOfferProduct" ADD CONSTRAINT "_EnquiryToOfferProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Enquiry"("enquiryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnquiryToOfferProduct" ADD CONSTRAINT "_EnquiryToOfferProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "OfferProduct"("offerProductId") ON DELETE CASCADE ON UPDATE CASCADE;
