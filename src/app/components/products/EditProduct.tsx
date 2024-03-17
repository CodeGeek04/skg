// EditProduct.tsx

"use client";

import { useState } from "react";
import { Product } from "@prisma/client";

interface EditProductProps {
  onEditProduct: (updatedProduct: Partial<Product>) => void;
  onClose: () => void;
  product: Product;
}

const EditProduct: React.FC<EditProductProps> = ({
  onEditProduct,
  onClose,
  product,
}) => {
  const [updatedProduct, setUpdatedProduct] = useState<Partial<Product>>({
    productId: product.productId,
    manufacturer: product.manufacturer,
    productName: product.productName,
    size: product.size,
    sizeUnit: product.sizeUnit,
    listPrice: product.listPrice,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]:
        name === "size" || name === "listPrice" ? parseInt(value, 10) : value,
    }));
  };

  const handleEditProduct = () => {
    onEditProduct(updatedProduct);
    onClose();
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="w-96 rounded-md bg-white p-8">
        <h2 className="mb-4 text-2xl font-bold">Edit Product</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Product ID
          </label>
          <input
            type="text"
            name="productId"
            value={updatedProduct.productId}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border p-2"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Product Manufacturer
          </label>
          <input
            type="text"
            name="manufacturer"
            value={updatedProduct.manufacturer}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Product Name
          </label>
          <input
            type="text"
            name="productName"
            value={updatedProduct.productName}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Size
          </label>
          <input
            type="number"
            name="size"
            value={updatedProduct.size}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Size Unit
          </label>
          <input
            type="text"
            name="sizeUnit"
            value={updatedProduct.sizeUnit}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            List Price
          </label>
          <input
            type="number"
            name="listPrice"
            value={updatedProduct.listPrice}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleEditProduct}
            className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
