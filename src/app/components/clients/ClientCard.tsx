import React from "react";
import { Client } from "@prisma/client";

interface ClientCardProps {
  client: Partial<Client>;
}

export const ClientCard = ({ client }: ClientCardProps) => {
  return (
    <div className="mb-4 rounded-md border bg-blue-200 p-4 shadow-md">
      <div className="mb-2 text-xl font-semibold">{client.clientName}</div>
      <div className="mb-2 text-gray-700">Address: {client.address}</div>
      {client.alternateNumbers && (
        <div className="mb-2 text-gray-700">
          Alternate Numbers:
          {client.alternateNumbers.map((number, index) => (
            <div key={index}>{number}</div>
          ))}
        </div>
      )}
      {client.mailId && (
        <div className="text-gray-700">
          Email IDs:
          {client.mailId.map((mail, index) => (
            <div key={index}>{mail}</div>
          ))}
        </div>
      )}
    </div>
  );
};
