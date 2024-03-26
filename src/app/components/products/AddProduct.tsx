"use client";

import { useState } from "react";
import Fuse from "fuse.js"; // Import Fuse

import { Product, ProductSize } from "@prisma/client";
import { AddProductServer } from "~/app/serverActions";

interface AddProductProps {
  onClose: () => void;
  productNames: string[];
}

const AddProduct: React.FC<AddProductProps> = ({ onClose, productNames }) => {
  const [product, setProduct] = useState<Partial<Product>>({});
  const [productSizes, setProductSizes] = useState<Partial<ProductSize>[]>([]);
  const [newProductSize, setNewProductSize] = useState<Partial<ProductSize>>(
    {},
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fuse = new Fuse(productNames, {
    keys: ["productName"],
    threshold: 0.3,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProduct({ ...product, productName: value });

    // Perform fuzzy search on product names
    const result = fuse.search(value);
    setSuggestions(result.map((item) => item.item));
  };

  const handleAddProduct = async () => {
    try {
      await AddProductServer(product, productSizes);
      onClose();
    } catch (error: any) {
      console.error("Error adding product:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70">
      <div
        className="w-full max-w-2xl rounded-md bg-white p-8"
        style={{ height: "500px", maxHeight: "80vh" }}
      >
        <h2 className="mb-4 text-2xl font-bold">Add Product</h2>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="manufacturer"
              className="block text-sm font-semibold"
            >
              Manufacturer
            </label>
            <input
              id="manufacturer"
              type="text"
              value={product.manufacturer || ""}
              onChange={(e) =>
                setProduct({ ...product, manufacturer: e.target.value })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mb-4">
              <label
                htmlFor="productName"
                className="block text-sm font-semibold"
              >
                Product Name
              </label>
              <input
                id="productName"
                type="text"
                value={product.productName || ""}
                onChange={handleInputChange}
                list="productNameSuggestions"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="productNameSuggestions">
                {suggestions.map((item, index) => (
                  <option key={index} value={item} />
                ))}
              </datalist>
            </div>
            <div className="mb-4">
              <label htmlFor="sizeUnit" className="block text-sm font-semibold">
                Size Unit
              </label>
              <input
                id="sizeUnit"
                type="text"
                value={product.sizeUnit || ""}
                onChange={(e) =>
                  setProduct({ ...product, sizeUnit: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="newSize"
                  className="block text-sm font-semibold"
                >
                  Size
                </label>
                <input
                  id="newSize"
                  type="text"
                  value={newProductSize.size || ""}
                  onChange={(e) =>
                    setNewProductSize({
                      ...newProductSize,
                      size: parseFloat(e.target.value),
                    })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="listPrice"
                  className="block text-sm font-semibold"
                >
                  List Price
                </label>
                <input
                  id="listPrice"
                  type="text"
                  value={newProductSize.listPrice || ""}
                  onChange={(e) =>
                    setNewProductSize({
                      ...newProductSize,
                      listPrice: parseFloat(e.target.value),
                    })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => {
                  setProductSizes([...productSizes, newProductSize]);
                  setNewProductSize({});
                }}
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Add Size
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddProduct}
                className="ml-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Add
              </button>
              <button
                onClick={onClose}
                className="ml-2 rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="mb-4 ml-4 h-5/6 overflow-y-auto">
            Product Sizes:
            {productSizes.map((productSize, index) => (
              <div key={index} className="mb-2">
                <div>
                  {productSize.size} {product.sizeUnit} -{" "}
                  {productSize.listPrice}
                </div>
                <button
                  onClick={() => {
                    const newProductSizes = productSizes.slice();
                    newProductSizes.splice(index, 1);
                    setProductSizes(newProductSizes);
                  }}
                  className="text-sm text-blue-500 hover:text-red-500 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
