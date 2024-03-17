import { Product } from "@prisma/client";
import { Skeleton } from "~/components/ui/skeleton";

interface ProductCardProps {
  product: Product;
  handleOpenDeleteProduct: (productId: string) => void;
  handleOpenEditProduct: (product: Product) => void;
}

export const ProductCard = ({
  product,
  handleOpenDeleteProduct,
  handleOpenEditProduct,
}: ProductCardProps) => {
  return (
    <li key={product.productId} className="rounded-md border p-4">
      <div className="mb-2 font-semibold">{product.productName}</div>
      <div>Manufacturer: {product.manufacturer}</div>
      <div>
        Size: {product.size} {product.sizeUnit}
      </div>
      <div>List Price: ₹{product.listPrice}</div>
      <div className="mt-2 flex space-x-2">
        {/* Delete Product Button */}
        <button
          onClick={() => handleOpenDeleteProduct(product.productId)}
          className="rounded-md bg-red-500 px-4 py-2 text-white"
        >
          Delete
        </button>
        {/* Edit Product Button */}
        <button
          onClick={() => handleOpenEditProduct(product)}
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          Edit
        </button>
      </div>
    </li>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <li className="rounded-md border p-4">
      <Skeleton className="mb-2 font-semibold" />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <div className="mt-2 flex space-x-2">
        {/* Delete Product Button */}
        <Skeleton className="rounded-md px-4 py-2" />
        {/* Edit Product Button */}
        <Skeleton className="rounded-md px-4 py-2" />
      </div>
    </li>
  );
};
