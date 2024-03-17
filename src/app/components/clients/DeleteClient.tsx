// DeleteClient.tsx

"use client";

import { useState } from "react";
import { Client } from "@prisma/client";

interface DeleteClientProps {
  onDeleteClient: (ClientId: string) => void;
  onClose: () => void;
  clientId: string;
}

const DeleteClient: React.FC<DeleteClientProps> = ({
  onDeleteClient,
  onClose,
  clientId,
}) => {
  const handleDeleteClient = () => {
    onDeleteClient(clientId);
    onClose();
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="w-96 rounded-md bg-white p-8">
        <h2 className="mb-4 text-2xl font-bold">Delete This Client?</h2>
        <div className="flex justify-end">
          <button
            onClick={handleDeleteClient}
            className="mr-2 rounded-md bg-red-500 px-4 py-2 text-white"
          >
            Delete
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

export default DeleteClient;