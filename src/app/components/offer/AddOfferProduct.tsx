// AddOfferProduct.tsx
import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { Product, OfferProduct } from "@prisma/client";

interface AddOfferProductProps {
  onClose: () => void;
  onAddProduct: (product: Partial<OfferProduct>, totalPrice: number) => void;
  manufacturers: string[];
}

const AddOfferProduct: React.FC<AddOfferProductProps> = ({
  onClose,
  onAddProduct,
  manufacturers,
}) => {
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [products, setProducts] = useState<Product[]>([]);
  const fuseManufacturers = new Fuse(manufacturers, { keys: ["manufacturer"] });

  const [fuseProducts, setFuseProducts] = useState<Fuse<Product> | null>(null);

  const handleManufacturerSelect = async (manufacturer: string) => {
    console.log("Selecting Manufacturer: ", manufacturer);
    setSelectedManufacturer(manufacturer);

    try {
      const response = await fetch(`/api/product/getForManufacturer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ manufacturer }),
      });
      console.log("Response: ", response);

      if (!response.ok) {
        alert("Manufacturer not found!!");
        throw new Error("Failed to fetch products");
      }

      const data = (await response.json()) as Product[];

      if (data.length === 0) {
        alert("No products found for manufacturer");
      }

      setProducts(data);
      setFuseProducts(new Fuse(data, { keys: ["productId"] }));
    } catch (error: any) {
      alert("Manufacturer not found!!");
      console.error("Error fetching products:", error.message);
    }
  };

  const handleSetQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
    setTotalPrice(
      (selectedProduct?.listPrice ?? 0) * Number(e.target.value) || 0,
    );
  };

  const handleProductSelect = (productId: string) => {
    const productIdInt = parseInt(productId);
    console.log("Selected Product ID: ", productIdInt);
    const product = products.find(
      (product) => product.productId === productIdInt,
    );
    setSelectedProduct(product ?? null);
    setQuantity(0); // Reset quantity when a new product is selected
  };

  const handleAddProduct = () => {
    if (!selectedManufacturer || !selectedProduct || quantity <= 0) {
      alert("Please select a valid product and quantity");
      return;
    }

    const offerProduct: Partial<OfferProduct> = {
      productId: selectedProduct.productId,
      productName: selectedProduct.productName,
      listPrice: selectedProduct.listPrice,
      quantity: quantity,
    };

    onAddProduct(offerProduct, totalPrice);
    onClose();
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="w-96 rounded-md bg-white p-8">
        <h2 className="mb-4 text-2xl font-bold">Add Offer Product</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Manufacturer
          </label>
          <input
            type="text"
            value={selectedManufacturer}
            onChange={(e) => setSelectedManufacturer(e.target.value)}
            className="mt-1 w-full rounded-md border p-2"
            list="manufacturers"
          />
          <datalist id="manufacturers">
            {fuseManufacturers &&
              fuseManufacturers
                .search(selectedManufacturer)
                .map(({ item }) => (
                  <option
                    key={item}
                    value={item}
                    onClick={() => handleManufacturerSelect(item)}
                  />
                ))}
          </datalist>
          <button
            onClick={() => handleManufacturerSelect(selectedManufacturer)}
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Get Products
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Product
          </label>
          <select
            value={selectedProduct?.productId || ""}
            onChange={(e) => handleProductSelect(e.target.value)}
            className="mt-1 w-full rounded-md border p-2"
          >
            <option value="" disabled>
              {selectedProduct?.productName || "Select a product"}
            </option>
            {products.map((product) => (
              <option key={product.productId} value={product.productId}>
                {product.productName} - {product.size}
                {product.sizeUnit}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            List Price
          </label>
          <p>{selectedProduct?.listPrice}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => handleSetQuantity(e)}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Total Price
          </label>
          <p>{totalPrice}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAddProduct}
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Add Product
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

export default AddOfferProduct;
