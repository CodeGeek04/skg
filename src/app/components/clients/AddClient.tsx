// AddClient.tsx

import { Client } from "@prisma/client";
import { useState } from "react";

interface AddClientProps {
  onClose: () => void;
  onAddClient: (newClient: Partial<Client>) => void;
}

const AddClient: React.FC<AddClientProps> = ({ onClose, onAddClient }) => {
  const [newClient, setNewClient] = useState<Partial<Client>>({
    mobile: "",
    clientName: "",
    address: "",
    mailId: "",
    alternateNumbers: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient((prevClient) => ({
      ...prevClient,
      [name]: value,
    }));
  };

  const handleAddAlternateNumber = () => {
    setNewClient((prevClient) => ({
      ...prevClient,
      alternateNumbers: [...(prevClient.alternateNumbers ?? []), ""],
    }));
  };

  const handleRemoveAlternateNumber = (index: number) => {
    setNewClient((prevClient) => {
      const updatedAlternateNumbers = [...(prevClient.alternateNumbers ?? [])];
      updatedAlternateNumbers.splice(index, 1);
      return {
        ...prevClient,
        alternateNumbers: updatedAlternateNumbers,
      };
    });
  };

  const handleAlternateNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;
    setNewClient((prevClient) => {
      const updatedAlternateNumbers = [...(prevClient.alternateNumbers ?? [])];
      updatedAlternateNumbers[index] = value;
      return {
        ...prevClient,
        alternateNumbers: updatedAlternateNumbers,
      };
    });
  };

  const handleAddClient = () => {
    // Validate that all required fields are filled
    if (!newClient.mobile || !newClient.clientName) {
      alert("Please enter mobile and client name."); // Replace with a more user-friendly notification
      return;
    }

    onAddClient(newClient);
    onClose();
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="w-96 rounded-md bg-white p-8">
        <h2 className="mb-4 text-2xl font-bold">Add Client</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Mobile
          </label>
          <input
            type="text"
            name="mobile"
            value={newClient.mobile}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Client Name
          </label>
          <input
            type="text"
            name="clientName"
            value={newClient.clientName}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={newClient.address}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="text"
            name="mailId"
            value={newClient.mailId}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Alternate Numbers
          </label>
          {newClient.alternateNumbers?.map((number, index) => (
            <div key={index} className="mt-2 flex items-center">
              <input
                type="text"
                value={number}
                onChange={(e) => handleAlternateNumberChange(e, index)}
                className="w-full rounded-md border p-2"
              />
              <button
                onClick={() => handleRemoveAlternateNumber(index)}
                className="ml-2 rounded-md bg-red-500 px-4 py-2 text-white"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={handleAddAlternateNumber}
            className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Add Alternate Number
          </button>
        </div>
        {/* Include other fields for adding */}
        {/* ... */}
        <div className="flex justify-end">
          <button
            onClick={handleAddClient}
            className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Add
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

export default AddClient;
