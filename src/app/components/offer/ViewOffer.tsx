import { Client, Offer, OfferProduct, Product } from "@prisma/client";
import React, { useState, useEffect } from "react";

interface OfferDetailsProps {
  offer: Offer;
  setIsOverlayOpen: (value: boolean) => void;
}

const OfferDetails = ({ offer, setIsOverlayOpen }: OfferDetailsProps) => {
  const [offerProducts, setOfferProducts] = useState<OfferProduct[]>([]);
  const [selectedOfferProduct, setSelectedOfferProduct] =
    useState<OfferProduct | null>(null);

  useEffect(() => {
    // Fetch offer products for the specific offer
    const fetchOfferProducts = async () => {
      try {
        const response = await fetch("/api/offerProduct/getForOffer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            offerNumber: offer.offerNumber,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch offer products");
        }

        const data = await response.json();
        setOfferProducts(data);
      } catch (error) {
        console.error("Error fetching offer products", error);
      }
    };

    fetchOfferProducts();
  }, [offer.offerNumber]);

  const handleDeleteOfferProduct = async (offerProductId: string) => {
    // Ask for confirmation before deleting
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this offer product?",
    );

    if (!isConfirmed) {
      return;
    }

    try {
      // Call the API to delete the offer product
      const response = await fetch("/api/offerProduct/deleteOfferProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerProductId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete offer product");
      }

      // Update the local state after successful deletion
      setOfferProducts((prevOfferProducts) =>
        prevOfferProducts.filter(
          (product) => product.offerProductId !== offerProductId,
        ),
      );
    } catch (error) {
      console.error("Error deleting offer product", error);
    }
  };

  const exportToCSV = async () => {
    const clientResponse = await fetch("/api/client/getClient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile: offer.mobile,
      }),
    });

    if (!clientResponse.ok) {
      throw new Error("Failed to fetch client");
    }

    const client: Client = await clientResponse.json();

    const products: Product[] = [];
    for (const offerProduct of offerProducts) {
      const productResponse = await fetch("/api/product/getProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: offerProduct.productId,
        }),
      });

      if (!productResponse.ok) {
        throw new Error("Failed to fetch product");
      }

      const product: Product = await productResponse.json();
      products.push(product);
    }

    const csvContent = [
      // Client details
      `Client Name: ${offer.clientName}`,
      `Address: ${client.address}`,
      `Mail Id: ${client.mailId}`,
      `Alternate Numbers: ${client.alternateNumbers.join(", ")}`,
      "",
      // General offer details
      `Offer Number: ${offer.offerNumber}`,
      `Project: ${offer.projectName}`,
      `Discount: ${offer.discount}`,
      `Total Price: ${offer.totalPrice}`,
      "",
      // Offer products
      "Products:",
      "Product Manufacturer, Name, Size, List Price, Quantity",
      ...products.map((product, index) => {
        const offerProduct = offerProducts[index];
        return `${product.manufacturer}, ${product.productName}, ${product.size}${product.sizeUnit}, ${product.listPrice}, ${offerProduct?.quantity}`;
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `${offer.clientName}-${offer.projectName}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold">Offer Details</h2>
          <p>Offer Number: {offer.offerNumber}</p>
          <p>Client: {offer.clientName}</p>
          <p>Project: {offer.projectName}</p>
          <p>Discount: {offer.discount}</p>
          <p>Total Price: {offer.totalPrice}</p>

          <h3 className="mt-4 text-lg font-semibold">Offer Products</h3>
          <ul>
            {offerProducts.map((product) => (
              <li key={product.offerProductId} className="mb-2">
                {product.productName} - List Price: {product.listPrice} -
                Quantity: {product.quantity}
                <button
                  className="ml-2 rounded bg-red-500 px-2 py-1 text-white"
                  onClick={() => setSelectedOfferProduct(product)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          {/* Export to CSV button */}
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
            onClick={exportToCSV}
          >
            Export to CSV
          </button>

          {/* Confirmation modal for deleting offer product */}
          {selectedOfferProduct && (
            <div className="mt-4">
              <p>
                Are you sure you want to delete{" "}
                {selectedOfferProduct.productName}?
              </p>
              <button
                className="mr-2 rounded bg-green-500 px-2 py-1 text-white"
                onClick={() =>
                  handleDeleteOfferProduct(selectedOfferProduct.offerProductId)
                }
              >
                Yes
              </button>
              <button
                className="rounded bg-gray-500 px-2 py-1 text-white"
                onClick={() => setSelectedOfferProduct(null)}
              >
                No
              </button>
            </div>
          )}

          <button
            className="mt-4 rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
            onClick={() => setIsOverlayOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;
