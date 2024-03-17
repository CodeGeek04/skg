// OfferManagement.tsx
import React, { use, useEffect, useState } from "react";
import AddOffer from "./AddOffer";
import { Offer } from "@prisma/client";
import OfferDetails from "./ViewOffer";

const OfferManagement: React.FC = () => {
  const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isDeleteOfferModalOpen, setIsDeleteOfferModalOpen] = useState(false);
  const [isViewOfferModalOpen, setIsViewOfferModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/offer/getOffers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page, pageSize }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch offers");
      }
      const data = (await response.json()) as Offer[];
      setOffers(data);
    } catch (error: any) {
      console.error("Error fetching offers:", error.message);
    }
  };

  const fetchManufacturers = async () => {
    try {
      const response = await fetch("/api/product/getManufacturers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch manufacturers");
      }
      const data = (await response.json()) as string[];
      setManufacturers(data);
    } catch (error: any) {
      console.error("Error fetching manufacturers:", error.message);
    }
  };

  const handleDeleteOffer = async (offerNumber: number) => {
    try {
      const response = await fetch("/api/offer/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ offerNumber }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete offer");
      }
      fetchData();
    } catch (error: any) {
      console.error("Error deleting offer:", error.message);
    }
    setIsDeleteOfferModalOpen(false);
  };

  useEffect(() => {
    fetchData();
    fetchManufacturers();
  }, [page, pageSize, isAddOfferModalOpen]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Offers</h1>

      {offers.length > 0 ? (
        <table className="w-full">
          {/* <thead>
            <tr>
              <th>Number</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Project</th>
              <th>Discount</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead> */}
          <tbody>
            {offers.map((offer) => (
              <div>
                <tr key={offer.offerNumber}>
                  <td>{offer.offerNumber}</td>
                  <td>{offer.clientName}</td>
                  <td>{offer.mobile}</td>
                  <td>{offer.projectName}</td>
                  <td>{offer.discount}% </td>
                  <td>{offer.totalPrice}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteOffer(offer.offerNumber)}
                      className="rounded-md bg-blue-500 px-4 py-2 text-white"
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedOffer(offer);
                        setIsViewOfferModalOpen(true);
                      }}
                      className="rounded-md bg-blue-500 px-4 py-2 text-white"
                    >
                      View
                    </button>
                  </td>
                </tr>
              </div>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No offers available</p>
      )}

      <button
        onClick={() => setIsAddOfferModalOpen(true)}
        className="mb-4 rounded-md bg-blue-500 px-4 py-2 text-white"
      >
        Add Offer
      </button>

      {/* AddOffer Modal */}
      {isAddOfferModalOpen && (
        <AddOffer
          onClose={() => setIsAddOfferModalOpen(false)}
          manufacturers={manufacturers}
        />
      )}

      {/* ViewOffer Modal */}
      {isViewOfferModalOpen && selectedOffer && (
        <OfferDetails
          offer={selectedOffer}
          setIsOverlayOpen={setIsViewOfferModalOpen}
        />
      )}
    </div>
  );
};

export default OfferManagement;
