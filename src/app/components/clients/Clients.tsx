// Clients.tsx
"use client";

import { useEffect, useState } from "react";
import { Client } from "@prisma/client";
import AddClient from "./AddClient";
import DeleteClient from "./DeleteClient";
import EditClient from "./EditClient";

// Add necessary imports for AddClient, DeleteClient, and EditClient components

const Clients: React.FC = () => {
  const localStorageClients = localStorage.getItem("localClients");
  const initialClients = localStorageClients
    ? (JSON.parse(localStorageClients) as Client[])
    : [];
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isAddClientOpen, setIsAddClientOpen] = useState<boolean>(false);
  const [isDeleteClientOpen, setIsDeleteClientOpen] = useState<boolean>(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState<boolean>(false);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<Partial<Client>>({
    mobile: "",
    clientName: "",
    address: "",
    mailId: "",
    alternateNumbers: [],
  });

  const fetchData = async () => {
    try {
      // Fetch data from your API endpoint for clients
      const response = await fetch("/api/client/getClients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page,
          pageSize,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: Client[] = await response.json();
      setClients(data);
      localStorage.setItem("localClients", JSON.stringify(data));
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  const handleAddClient = (newClient: Partial<Client>) => {
    // Send a POST request to your API endpoint to add the new client
    fetch("/api/client/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newClient),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add client");
        }
        return response.json();
      })
      .then((data) => {
        // Update the client list with the new client
        setClients((prevClients) => [...prevClients, data]);
      })
      .catch((error) => {
        console.error("Error adding client:", error.message);
      });
  };

  const handleDeleteClient = async () => {
    try {
      const response = await fetch("/api/client/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: selectedClientId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      fetchData(); // Refresh the product list after deleting a product
      handleCloseDeleteClient();
    } catch (error: any) {
      console.error("Error deleting product:", error.message);
    }
  };

  const handleEditClient = async (updatedClient: Partial<Client>) => {
    // Send a POST request to your API endpoint to update the client
    try {
      const response = await fetch("/api/client/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedClient),
      });

      if (!response.ok) {
        throw new Error("Failed to update client");
      }

      fetchData(); // Refresh the client list after updating a client
      handleCloseEditClient();
    } catch (error: any) {
      console.error("Error updating client:", error.message);
    }
  };

  const handleOpenDeleteClient = (client: Client) => {
    setSelectedClientId(client.mobile);
    setIsDeleteClientOpen(true);
  };

  const handleOpenEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditClientOpen(true);
  };

  const handleCloseDeleteClient = () => {
    setIsDeleteClientOpen(false);
  };

  const handleCloseEditClient = () => {
    setIsEditClientOpen(false);
  };

  // Similar to the Products component, implement functions for adding, deleting, and editing clients

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-4xl font-bold">Client List</h1>

      {/* "Add Client" Button */}
      <button
        onClick={() => setIsAddClientOpen(true)}
        className="mb-4 rounded-md bg-green-500 px-4 py-2 text-white"
      >
        Add Client
      </button>

      {/* Client List */}
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <li key={client.mobile} className="rounded-md border p-4">
            <div className="mb-2 font-semibold">{client.clientName}</div>
            <div>Mobile: {client.mobile}</div>
            <div>Address: {client.address}</div>
            <div>Email: {client.mailId}</div>
            {client.alternateNumbers?.length > 0 && (
              <div>
                Alternate Numbers:
                {client.alternateNumbers.map((number, index) => (
                  <div key={index}>{number}</div>
                ))}
              </div>
            )}
            {/* Include other client details */}
            <div className="mt-2 flex space-x-2">
              {/* Delete Client Button */}
              <button
                onClick={() => handleOpenDeleteClient(client)}
                className="rounded-md bg-red-500 px-4 py-2 text-white"
              >
                Delete
              </button>
              {/* Edit Client Button */}
              <button
                onClick={() => handleOpenEditClient(client)}
                className="rounded-md bg-blue-500 px-4 py-2 text-white"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          <label className="mr-2">Page Size:</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="rounded-md border p-2"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div>
          <span className="mr-2">Page:</span>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="mr-2 rounded-md border px-4 py-2"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="rounded-md border px-4 py-2"
          >
            Next
          </button>
        </div>
      </div>

      {/* AddClient Overlay */}
      {isAddClientOpen && (
        <AddClient
          onClose={() => setIsAddClientOpen(false)}
          onAddClient={handleAddClient}
        />
      )}

      {/* DeleteClient Overlay */}
      {isDeleteClientOpen && (
        <DeleteClient
          onDeleteClient={handleDeleteClient}
          onClose={handleCloseDeleteClient}
          clientId={selectedClientId}
        />
      )}

      {/* EditClient Overlay */}
      {isEditClientOpen && (
        <EditClient
          onEditClient={handleEditClient}
          onClose={handleCloseEditClient}
          client={selectedClient as Client}
        />
      )}
    </div>
  );
};

export default Clients;
