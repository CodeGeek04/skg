"use client";

import { Client } from "@prisma/client";
import { useState } from "react";
import { AddClientServer } from "~/app/serverActions";

interface AddClientProps {
  onClose: () => void;
}

const AddClient: React.FC<AddClientProps> = ({ onClose }) => {
  const [newClient, setNewClient] = useState<Partial<Client>>({});
  const [newAlternateNumber, setNewAlternateNumber] = useState<string>("");
  const [newMailId, setNewMailId] = useState<string>("");

  const handleAddClient = async () => {
    try {
      await AddClientServer(newClient);
      onClose();
    } catch (error: any) {
      console.error("Error adding client:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
      <div className="rounded-md bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Add Client</h2>
        <div className="mb-4">
          <label htmlFor="clientName" className="mb-1 block font-semibold">
            Client Name
          </label>
          <input
            id="clientName"
            type="text"
            value={newClient.clientName || ""}
            onChange={(e) =>
              setNewClient({ ...newClient, clientName: e.target.value })
            }
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="mb-1 block font-semibold">
            Address
          </label>
          <input
            id="address"
            type="text"
            value={newClient.address || ""}
            onChange={(e) =>
              setNewClient({ ...newClient, address: e.target.value })
            }
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="alternateNumbers"
            className="mb-1 block font-semibold"
          >
            Alternate Numbers
          </label>
          {newClient.alternateNumbers &&
            newClient.alternateNumbers.map((number, index) => (
              <div key={index}>{number}</div>
            ))}
          <input
            id="alternateNumbers"
            type="text"
            value={newAlternateNumber}
            onChange={(e) => setNewAlternateNumber(e.target.value)}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              setNewClient({
                ...newClient,
                alternateNumbers: [
                  ...(newClient.alternateNumbers || []),
                  newAlternateNumber,
                ],
              });
              setNewAlternateNumber("");
            }}
            className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Alternate Number
          </button>
        </div>
        <div className="mb-4">
          {newClient.mailId &&
            newClient.mailId.map((mail, index) => (
              <div key={index}>{mail}</div>
            ))}
          <input
            id="mailId"
            type="text"
            value={newMailId}
            onChange={(e) => setNewMailId(e.target.value)}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              setNewClient({
                ...newClient,
                mailId: [...(newClient.mailId || []), newMailId],
              });
              setNewMailId("");
            }}
            className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Mail Id
          </button>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleAddClient}
            className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddClient;
