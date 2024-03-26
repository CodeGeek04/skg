// Clients.tsx
"use client";

import { useEffect, useState } from "react";
import { Client } from "@prisma/client";
import AddClient from "./AddClient";
import { ClientCard } from "./ClientCard";
import { getClients } from "~/app/serverActions";

// Add necessary imports for AddClient, DeleteClient, and EditClient components

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isAddClientModalOpen, setIsAddClientModalOpen] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getClients();
      setClients(response);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleCloseAddClientModal = () => {
    fetchData();
    setIsAddClientModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {!loading && clients.length === 0 && (
        <div className="text-2xl text-white">No clients found</div>
      )}
      {!loading &&
        clients.length > 0 &&
        clients.map((client) => (
          <ClientCard key={client.clientName} client={client} />
        ))}
      {loading && <div className="text-2xl text-white">Loading...</div>}
      {isAddClientModalOpen ? (
        <AddClient onClose={handleCloseAddClientModal} />
      ) : (
        <button
          onClick={() => setIsAddClientModalOpen(true)}
          className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Client
        </button>
      )}
    </div>
  );
};

export default Clients;
