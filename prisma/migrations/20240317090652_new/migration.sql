/*
  Warnings:

  - The `mailId` column on the `Client` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `clientName` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `projectName` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `listPrice` on the `OfferProduct` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `OfferProduct` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `OfferProduct` table. All the data in the column will be lost.
  - You are about to drop the column `listPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `clientName` on the `Project` table. All the data in the column will be lost.
  - Added the required column `productSizeId` to the `OfferProduct` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OfferProduct" DROP CONSTRAINT "OfferProduct_productId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "mailId",
ADD COLUMN     "mailId" TEXT[];

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "clientName",
DROP COLUMN "discount",
DROP COLUMN "projectName";

-- AlterTable
ALTER TABLE "OfferProduct" DROP COLUMN "listPrice",
DROP COLUMN "productId",
DROP COLUMN "productName",
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "productSizeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "listPrice",
DROP COLUMN "size";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "clientName";

-- CreateTable
CREATE TABLE "ProductSize" (
    "productSizeId" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "listPrice" DOUBLE PRECISION NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductSize_pkey" PRIMARY KEY ("productSizeId")
);

-- AddForeignKey
ALTER TABLE "ProductSize" ADD CONSTRAINT "ProductSize_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferProduct" ADD CONSTRAINT "OfferProduct_productSizeId_fkey" FOREIGN KEY ("productSizeId") REFERENCES "ProductSize"("productSizeId") ON DELETE RESTRICT ON UPDATE CASCADE;
