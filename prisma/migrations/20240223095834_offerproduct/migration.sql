/*
  Warnings:

  - You are about to drop the `_OfferToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OfferToProduct" DROP CONSTRAINT "_OfferToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_OfferToProduct" DROP CONSTRAINT "_OfferToProduct_B_fkey";

-- DropTable
DROP TABLE "_OfferToProduct";

-- CreateTable
CREATE TABLE "OfferProduct" (
    "id" SERIAL NOT NULL,
    "offerNumber" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfferProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OfferProduct" ADD CONSTRAINT "OfferProduct_offerNumber_fkey" FOREIGN KEY ("offerNumber") REFERENCES "Offer"("offerNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferProduct" ADD CONSTRAINT "OfferProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
