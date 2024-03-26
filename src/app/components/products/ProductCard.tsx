import { Product } from "@prisma/client";
import { Skeleton } from "~/components/ui/skeleton";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="rounded-md border bg-blue-200 p-4">
      <div className="text-lg font-semibold text-black">
        {product.productName}
      </div>
      <div className="text-gray-700">Manufacturer: {product.manufacturer}</div>
      <div className="mt-2 flex space-x-2">{/* Add your content here */}</div>
    </div>
  );
};
