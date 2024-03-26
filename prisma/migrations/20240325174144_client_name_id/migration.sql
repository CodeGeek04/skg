/*
  Warnings:

  - The primary key for the `Client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `mobile` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `mobile` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `mobile` on the `Project` table. All the data in the column will be lost.
  - Added the required column `clientName` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientName` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_mobile_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_projectId_fkey";

-- DropForeignKey
ALTER TABLE "OfferProduct" DROP CONSTRAINT "OfferProduct_offerId_fkey";

-- DropForeignKey
ALTER TABLE "OfferProduct" DROP CONSTRAINT "OfferProduct_productSizeId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSize" DROP CONSTRAINT "ProductSize_productId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_mobile_fkey";

-- AlterTable
ALTER TABLE "Client" DROP CONSTRAINT "Client_pkey",
DROP COLUMN "mobile",
ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("clientName");

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "mobile",
ADD COLUMN     "clientName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "mobile",
ADD COLUMN     "clientName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductSize" ADD CONSTRAINT "ProductSize_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientName_fkey" FOREIGN KEY ("clientName") REFERENCES "Client"("clientName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_clientName_fkey" FOREIGN KEY ("clientName") REFERENCES "Client"("clientName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferProduct" ADD CONSTRAINT "OfferProduct_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("offerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferProduct" ADD CONSTRAINT "OfferProduct_productSizeId_fkey" FOREIGN KEY ("productSizeId") REFERENCES "ProductSize"("productSizeId") ON DELETE CASCADE ON UPDATE CASCADE;
