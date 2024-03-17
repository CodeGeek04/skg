// AddProduct.tsx
"use client";

import { useState } from "react";
import { Product } from "@prisma/client";

interface AddProductProps {
  onAddProduct: (newProduct: Partial<Product>) => void;
  onClose: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ onAddProduct, onClose }) => {
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    productName: "",
    manufacturer: "",
    size: 0,
    sizeUnit: "",
    listPrice: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]:
        name === "size" || name === "listPrice" ? parseInt(value, 10) : value,
    }));
  };

  const handleAddProduct = () => {
    // Validate that all required fields are filled
    if (
      !newProduct.productName ||
      !newProduct.manufacturer ||
      newProduct.size === 0 ||
      newProduct.listPrice === 0
    ) {
      // Use a more user-friendly notification library or component
      alert("Please enter all required information.");
      return;
    }

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="w-96 rounded-md bg-white p-8">
        <h2 className="mb-4 text-2xl font-bold">Add Product</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Product Name
          </label>
          <input
            type="text"
            name="productName"
            value={newProduct.productName}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Manufacturer
          </label>
          <input
            type="text"
            name="manufacturer"
            value={newProduct.manufacturer}
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
            value={newProduct.size}
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
            value={newProduct.sizeUnit}
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
            value={newProduct.listPrice}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAddProduct}
            className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Add
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

export default AddProduct;
