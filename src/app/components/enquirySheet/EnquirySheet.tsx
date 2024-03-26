import { getEnquiryOffers } from "~/app/serverActions";
import { useEffect, useState } from "react";
import { Offer } from "@prisma/client";
import { ViewOffer } from "../offer/ViewOffer";

const EnquirySheet = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  const fetchEnquiryOffers = async () => {
    setLoading(true);
    const offers = await getEnquiryOffers(startDate, endDate);
    setOffers(offers);
    setLoading(false);
  };

  return (
    <div className="px-4 py-6">
      <h1 className="mb-6 text-center text-3xl font-bold text-white">
        Enquiry Sheet
      </h1>
      <div className="mb-4 flex justify-center">
        <input
          type="date"
          value={startDate.toISOString().split("T")[0]}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          className="mr-2 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={endDate.toISOString().split("T")[0]}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          className="mr-2 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchEnquiryOffers}
          className="rounded-md bg-blue-500 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Fetch Offers
        </button>
      </div>
      {loading && <p className="text-center">Loading...</p>}
      <div>
        {offers.map((offer) => (
          <div className="flex w-fit flex-col rounded-lg border border-gray-300 bg-blue-200 p-4">
            <div key={offer.offerId} className="mb-4">
              <h2 className="mb-4 text-xl font-semibold">
                Offer Number: {offer.offerNumber}
              </h2>
              <p className="mb-4 text-lg">Client Name: {offer.clientName}</p>
              <p className="mb-4 text-lg">
                {" "}
                Offer Date: {offer.createdDate.toDateString()}
              </p>
              <button
                onClick={() => setSelectedOffer(offer)}
                className="mb-2 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                View Offer
              </button>
            </div>
            {selectedOffer && (
              <ViewOffer
                offer={selectedOffer}
                onClose={() => setSelectedOffer(null)}
                showAddToEnquiry={false}
              />
            )}
          </div>
        ))}
        {offers.length === 0 && !loading && (
          <p className="text-center">
            No offers found for the selected date range
          </p>
        )}
      </div>
    </div>
  );
};

export default EnquirySheet;
