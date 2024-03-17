-- CreateTable
CREATE TABLE "Product" (
    "productId" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "sizeUnit" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "listPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);
