import { Product, ProductSize } from "@prisma/client";

export interface offerProduct {
  product: Product | undefined;
  discount: number;
  productQuantities: productQuantity[];
}

export interface productQuantity {
  productSize: ProductSize;
  quantity: number;
}
