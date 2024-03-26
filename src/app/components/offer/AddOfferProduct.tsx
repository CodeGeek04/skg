// AddOfferProduct.tsx
import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { Product, OfferProduct, ProductSize } from "@prisma/client";
import {
  fetchProducts,
  fetchProductSizes,
  fetchProduct,
} from "~/app/serverActions";
import { offerProduct } from "~/app/types";

interface AddOfferProductProps {
  onClose: () => void;
  offerProducts: offerProduct[];
  setOfferProducts: React.Dispatch<React.SetStateAction<offerProduct[]>>;
}

export const AddOfferProduct: React.FC<AddOfferProductProps> = ({
  onClose,
  offerProducts,
  setOfferProducts,
}) => {
  const [product, setProduct] = useState<Partial<Product>>({});
  const [newProduct, setNewProduct] = useState<Product | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [productQuantities, setProductQuantities] = useState<
    {
      productSize: ProductSize;
      quantity: number;
    }[]
  >([]);
  const [selectedProductQuantity, setSelectedProductQuantity] = useState<
    Partial<{
      productSize: ProductSize; // Allow null for productSize
      quantity: number;
    }>
  >({
    quantity: 0,
  });
  const [productSizes, setProductSizes] = useState<ProductSize[]>([]);
  const [productNames, setProductNames] = useState<string[]>([]);
  const [productNameSuggestions, setProductNameSuggestions] = useState<
    string[]
  >([]);

  const fetchProductNames = async () => {
    const products = await fetchProducts();
    setProductNames(products.map((product) => product.productName));
  };

  useEffect(() => {
    fetchProductNames();
  }, []);

  const fuse = new Fuse(productNames, {
    keys: ["productName"],
    threshold: 0.3,
  });

  const handleFetchProductSizes = async () => {
    const selectedProduct = await fetchProduct(product?.productName || "");
    if (selectedProduct) {
      const productSizes = await fetchProductSizes(selectedProduct.productId);
      setProductSizes(productSizes);
      setProduct(selectedProduct);
      setNewProduct(selectedProduct);
    } else {
      alert("Product not found");
    }
  };

  const handleAddProductQuantity = () => {
    if (
      selectedProductQuantity.productSize &&
      selectedProductQuantity.quantity &&
      selectedProductQuantity.quantity > 0
    ) {
      const productSize = productSizes.find(
        (size) => size.size === selectedProductQuantity.productSize?.size,
      );
      if (productSize) {
        setProductQuantities([
          ...productQuantities,
          {
            productSize,
            quantity: selectedProductQuantity.quantity,
          },
        ]);
        setSelectedProductQuantity({
          quantity: 0,
        });
      } else {
        alert("Product size not found");
      }
    }
  };

  const handleAddProduct = () => {
    if (newProduct && productQuantities.length > 0) {
      const newOfferProduct: offerProduct = {
        product: newProduct,
        discount,
        productQuantities,
      };
      setOfferProducts([...offerProducts, newOfferProduct]);
      onClose();
    }
  };

  return (
    <div className="z-51 max-h-5/6 fixed inset-0 flex items-center justify-center overflow-y-auto bg-gray-900 bg-opacity-70">
      <div className="w-full max-w-md rounded-lg bg-white p-8">
        <h2 className="mb-4 text-lg font-semibold">Add Offer Product</h2>
        <div>
          <label htmlFor="product" className="mb-2 block">
            Product
          </label>
          <input
            type="text"
            list="productNames"
            name="product"
            id="product"
            onChange={(e) => {
              const results = fuse.search(e.target.value);
              setProductNameSuggestions(results.map((result) => result.item));
              setProduct({ productName: e.target.value });
            }}
            className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <datalist id="productNames">
            {productNameSuggestions.map((productName) => (
              <option key={productName} value={productName} />
            ))}
          </datalist>
        </div>
        <button
          onClick={handleFetchProductSizes}
          className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Fetch Product Sizes
        </button>
        {product && (
          <div className="mt-4">
            <div>
              Manufacturer: {product.manufacturer ? product.manufacturer : ""}
            </div>
            <div>Product: {product.productName ? product.productName : ""}</div>
          </div>
        )}
        <div className="mt-4">
          <label htmlFor="discount" className="mb-2 block">
            Discount
          </label>
          <input
            type="number"
            name="discount"
            id="discount"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {productQuantities?.map((productQuantity, index) => (
          <div key={index} className="mt-4">
            <div>
              {productQuantity.productSize.size}{" "}
              {product.sizeUnit ? product.sizeUnit : ""}
            </div>
            <div>{productQuantity.productSize.listPrice}</div>
            <div>{productQuantity.quantity}</div>
            <button
              onClick={() =>
                setProductQuantities(
                  productQuantities.filter((productQuantity, i) => i !== index),
                )
              }
              className="mt-2 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <div className="mt-4">
          <label htmlFor="productSize" className="mb-2 block">
            Product Size
          </label>
          <input
            type="text"
            list="productSizes"
            name="productSize"
            id="productSize"
            onChange={(e) => {
              const selectedProductSize = productSizes.find(
                (size) => size.size === parseFloat(e.target.value),
              );

              setSelectedProductQuantity({
                ...selectedProductQuantity,
                productSize: selectedProductSize || undefined, // Handle the case where selectedProductSize might be null
              });
            }}
            className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <datalist id="productSizes">
            {productSizes.map((size) => (
              <option key={size.size} value={size.size} />
            ))}
          </datalist>
        </div>
        <div className="mt-4">
          <label htmlFor="quantity" className="mb-2 block">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            value={selectedProductQuantity.quantity}
            onChange={(e) =>
              setSelectedProductQuantity({
                ...selectedProductQuantity,
                quantity: Number(e.target.value),
              })
            }
            className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleAddProductQuantity}
          className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Product Quantity
        </button>
        <button
          onClick={handleAddProduct}
          className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Product to Offer
        </button>
        <button
          onClick={onClose}
          className="mt-4 rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};
