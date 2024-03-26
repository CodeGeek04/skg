import { Offer } from "@prisma/client";
import { useEffect, useState } from "react";
import { addToEnquiry, fetchOfferProducts } from "~/app/serverActions";
import { offerProduct } from "~/app/types";

interface ViewOfferProps {
  onClose: () => void;
  offer: Offer;
  showAddToEnquiry?: boolean;
}

export const ViewOffer: React.FC<ViewOfferProps> = ({
  onClose,
  offer,
  showAddToEnquiry = true,
}) => {
  const [offerProducts, setOfferProducts] = useState<offerProduct[]>();
  const [addedToEnquiry, setAddedToEnquiry] = useState<boolean>(
    offer.isEnquired,
  );

  const FetchOfferProducts = async () => {
    const result = await fetchOfferProducts(offer.offerId);
    console.log("result", result);
    setOfferProducts(result);
  };

  useEffect(() => {
    FetchOfferProducts();
  }, []);

  return (
    <div className="px-4 py-6">
      <h2 className="mb-4 text-xl font-semibold">View Offer</h2>
      <h3 className="text-lg font-semibold">
        Offer Number: {offer.offerNumber}
      </h3>
      <h3 className="text-lg font-semibold">
        Create Date: {offer.createdDate.toDateString()}
      </h3>
      <h3 className="text-lg font-semibold">Client Name: {offer.clientName}</h3>
      <h3 className="text-lg font-semibold">Total Price: {offer.totalPrice}</h3>
      <h3 className="text-lg font-semibold">Offer Products</h3>
      <ul className="mt-2">
        {offerProducts?.map((offerProduct, index) => (
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
                    {productQuantity.productSize?.size} -{" "}
                    {productQuantity.quantity}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        ))}
      </ul>
      {showAddToEnquiry && (
        <div className="mt-4">
          {addedToEnquiry ? (
            <p className="text-base">Offer added to Enquiry Sheet</p>
          ) : (
            <button
              onClick={async () => {
                await addToEnquiry(offer.offerId);

                setAddedToEnquiry(true);
              }}
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add to Enquiry Sheet
            </button>
          )}
        </div>
      )}
      <button
        onClick={onClose}
        className="mt-4 rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
      >
        Close
      </button>
    </div>
  );
};
