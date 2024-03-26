// AddProject.tsx
"use client";

import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { Client, Project } from "@prisma/client";
import { AddProjectServer, fetchClientByName } from "~/app/serverActions";

interface AddProjectProps {
  onClose: () => void;
  mobiles: string[];
}

const AddProject: React.FC<AddProjectProps> = ({ mobiles, onClose }) => {
  const [newProject, setNewProject] = useState<Partial<Project>>({});
  const [client, setClient] = useState<Partial<Client>>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fuse = new Fuse(mobiles, {
    keys: ["clientName"],
    threshold: 0.3,
  });

  const fetchClient = async () => {
    try {
      const client = await fetchClientByName(newProject.clientName || "");
      if (!client) {
        alert("Client not found");
        return;
      }
      setClient(client);
    } catch (error: any) {
      console.error("Error fetching client:", error.message);
    }
  };

  const handleAddProject = async () => {
    try {
      await AddProjectServer(newProject);
      onClose();
    } catch (error: any) {
      console.error("Error adding project:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
      <div className="rounded-md bg-white p-6 shadow-md">
        <label htmlFor="clientName" className="mb-1 block font-semibold">
          Client Name
        </label>
        <input
          id="clientName"
          type="text"
          value={newProject.clientName || ""}
          onChange={(e) => {
            setNewProject({ ...newProject, clientName: e.target.value });
            const result = fuse.search(e.target.value);
            setSuggestions(result.map((item) => item.item));
          }}
          list="clientNameSuggestions" // Referencing the datalist
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <datalist id="clientNameSuggestions">
          {suggestions.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>
        <button
          onClick={fetchClient}
          className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Fetch Client
        </button>

        <h2 className="mb-2 mt-4 text-2xl font-bold">Client Details</h2>
        <div className="mb-2">
          Name: {client.clientName ? client.clientName : ""}
        </div>
        <div className="mb-4">
          Address: {client.address ? client.address : ""}
        </div>

        <label htmlFor="projectName" className="mb-1 block font-semibold">
          Project Name
        </label>
        <input
          id="projectName"
          type="text"
          value={newProject.projectName || ""}
          onChange={(e) =>
            setNewProject({ ...newProject, projectName: e.target.value })
          }
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddProject}
          className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Project
        </button>
      </div>
    </div>
  );
};

export default AddProject;
