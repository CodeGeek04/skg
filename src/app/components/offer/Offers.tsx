// OfferManagement.tsx
import React, { use, useEffect, useState } from "react";
import AddOffer from "./AddOffer";
import { Offer } from "@prisma/client";
import { OfferCard } from "./OfferCard";
import { fetchClients, fetchOffers } from "../../serverActions";

const OfferManagement: React.FC = () => {
  const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);
  const [clientNames, setClientNames] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [offers, setOffers] = useState<Offer[]>([]);

  const fetchData = async () => {
    const response = await fetchOffers();
    setOffers(response);
  };

  const fetchClientNames = async () => {
    try {
      const clients = await fetchClients();
      setClientNames(clients.map((client) => client.clientName));
    } catch (error: any) {
      console.error("Error fetching client names:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchClientNames();
  }, [page, pageSize]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleCloseModal = () => {
    fetchData();
    setIsAddOfferModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {offers.length === 0 && <p className="text-lg">No Offers Found</p>}
      {offers.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <OfferCard key={offer.offerId} offer={offer} refetch={fetchData} />
          ))}
        </div>
      )}
      {isAddOfferModalOpen && (
        <AddOffer onClose={handleCloseModal} clientNames={clientNames} />
      )}
      {!isAddOfferModalOpen && (
        <button
          onClick={() => setIsAddOfferModalOpen(true)}
          className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Offer
        </button>
      )}
    </div>
  );
};

export default OfferManagement;
