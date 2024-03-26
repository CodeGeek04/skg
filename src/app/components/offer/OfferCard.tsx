import { Offer } from "@prisma/client";
import EditOffer from "./EditOffer";
import { useState } from "react";
import { set } from "zod";
import { ViewOffer } from "./ViewOffer";

export const OfferCard: React.FC<{
  offer: Offer;
  refetch: () => void;
}> = ({ offer, refetch }) => {
  const [isEditOfferModalOpen, setIsEditOfferModalOpen] = useState(false);
  const [isViewOfferModalOpen, setIsViewOfferModalOpen] = useState(false);
  return (
    <div className="flex flex-col rounded-lg border border-gray-300 bg-blue-200 p-4">
      <h2 className="mb-4 text-xl font-semibold">
        Offer Number: {offer.offerNumber}
      </h2>
      <p className="mb-4 text-lg">Client Name: {offer.clientName}</p>
      <button
        onClick={() => setIsEditOfferModalOpen(true)}
        className="mb-2 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Edit Offer
      </button>
      <button
        onClick={() => setIsViewOfferModalOpen(true)}
        className="mb-2 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        View Offer
      </button>
      {isEditOfferModalOpen && (
        <EditOffer
          offer={offer}
          onClose={() => {
            setIsEditOfferModalOpen(false);
            refetch();
          }}
        />
      )}
      {isViewOfferModalOpen && (
        <ViewOffer
          offer={offer}
          onClose={() => {
            setIsViewOfferModalOpen(false);
            refetch();
          }}
        />
      )}
    </div>
  );
};
