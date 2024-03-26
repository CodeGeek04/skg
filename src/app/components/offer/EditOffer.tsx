import { Offer } from "@prisma/client";
import { useEffect, useState } from "react";
import { offerProduct } from "~/app/types";
import { fetchOfferProducts, addOffer } from "~/app/serverActions";
import { AddOfferProduct } from "./AddOfferProduct";

interface EditOfferProps {
  onClose: () => void;
  offer: Offer;
}

const EditOffer: React.FC<EditOfferProps> = ({ onClose, offer }) => {
  const [newOffer, setNewOffer] = useState<Offer>(offer);
  const [offerProducts, setOfferProducts] = useState<offerProduct[]>([]);
  const [isAddOfferProductModalOpen, setIsAddOfferProductModalOpen] =
    useState(false);

  const FetchOfferProducts = async () => {
    const result = await fetchOfferProducts(offer.offerId);
    console.log("result", result);
    setOfferProducts(result);
  };

  useEffect(() => {
    FetchOfferProducts();
  }, []);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    offerProducts.forEach((offerProduct) => {
      let productPrice = 0;
      offerProduct.productQuantities.forEach((productQuantity) => {
        productPrice +=
          productQuantity.productSize.listPrice * productQuantity.quantity;
      });
      totalPrice += productPrice * (1 - offerProduct.discount / 100);
    });
    setNewOffer({ ...offer, totalPrice });
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [offerProducts]);

  return (
    <div className="px-4 py-6">
      <h2 className="mb-4 text-xl font-semibold">Edit Offer</h2>
      <h3 className="text-lg font-semibold">
        Offer Number: {offer.offerNumber}
      </h3>
      <h3 className="text-lg font-semibold">Client Name: {offer.clientName}</h3>
      <h3 className="text-lg font-semibold">
        Total Price: {newOffer.totalPrice}
      </h3>
      <h3 className="text-lg font-semibold">Offer Products</h3>
      <ul className="mt-2">
        {offerProducts.map((offerProduct, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold">
              {offerProduct.product?.productName}
            </h3>
            <p className="text-base">Discount: {offerProduct.discount}</p>
            <p className="text-base">Product Sizes:</p>
            <ul className="ml-4 mt-2">
              {offerProduct.productQuantities.map((productQuantity, index) => (
                <div key={index} className="mb-2">
                  <li className="text-base">
                    Size: {productQuantity.productSize.size}{" "}
                    {offerProduct.product?.sizeUnit}
                    <br />
                    List Price: {productQuantity.productSize.listPrice}
                    <br />
                    Quantity: {productQuantity.quantity}
                  </li>
                </div>
              ))}
            </ul>
            <button
              onClick={() => {
                setOfferProducts(
                  offerProducts.filter(
                    (product) =>
                      product.product?.productName !==
                      offerProduct.product?.productName,
                  ),
                );
              }}
              className="mt-2 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Remove Product
            </button>
          </div>
        ))}
      </ul>
      <button
        onClick={() => setIsAddOfferProductModalOpen(true)}
        className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Add Product
      </button>
      {isAddOfferProductModalOpen && (
        <AddOfferProduct
          onClose={() => setIsAddOfferProductModalOpen(false)}
          offerProducts={offerProducts}
          setOfferProducts={setOfferProducts}
        />
      )}
      <button
        onClick={async () => {
          await addOffer(newOffer, offerProducts, newOffer.offerId);
          onClose();
        }}
        className="mt-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Save Offer
      </button>
      <button
        onClick={onClose}
        className="mt-4 rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
      >
        Close
      </button>
    </div>
  );
};

export default EditOffer;
