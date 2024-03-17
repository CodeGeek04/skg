// AddProject.tsx
"use client";

import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { Project } from "@prisma/client";

interface AddProjectProps {
  onAddProject: (newProject: Partial<Project>) => void;
  onClose: () => void;
}

// ... (imports and other code)

const AddProject: React.FC<AddProjectProps> = ({ onAddProject, onClose }) => {
  const [newProject, setNewProject] = useState<Partial<Project>>({
    projectName: "",
    mobile: "",
    clientName: "", // Add clientName to state
  });

  const [clientNumbers, setClientNumbers] = useState<string[]>([]);
  const [address, setAddress] = useState<string>("");
  const [fuse, setFuse] = useState<Fuse<string> | null>(null);

  useEffect(() => {
    // Fetch client numbers from the server when the component mounts
    const fetchClientNumbers = async () => {
      try {
        const response = await fetch("/api/client/getNumbers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch client numbers");
        }
        const data: string[] = await response.json();
        setClientNumbers(data);
        setFuse(new Fuse(data));
      } catch (error: any) {
        console.error("Error fetching client numbers:", error.message);
      }
    };

    fetchClientNumbers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProject((prevProject) => ({ ...prevProject, [name]: value }));
  };

  const handleClientSelect = async (selectedClient: string) => {
    setNewProject((prevProject) => ({
      ...prevProject,
      mobile: selectedClient,
    }));

    try {
      const response = await fetch(`/api/client/getClient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: selectedClient }),
      });

      if (!response.ok) {
        alert("Client not found!!");
        throw new Error("Failed to fetch client details");
      }

      const data: { clientName: string; address: string } =
        await response.json();

      setAddress(data.address);

      setNewProject((prevProject) => ({
        ...prevProject,
        clientName: data.clientName,
      }));
    } catch (error: any) {
      alert("Client not found!!");
      console.error("Error fetching client details:", error.message);
    }
  };

  const handleAddProject = () => {
    // Validate that all required fields are filled
    if (
      !newProject.projectName ||
      !newProject.mobile ||
      !newProject.clientName
    ) {
      // Use a more user-friendly notification library or component
      alert("Please enter all required information.");
      return;
    }

    onAddProject(newProject);
    onClose();
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="w-96 rounded-md bg-white p-8">
        <h2 className="mb-4 text-2xl font-bold">Add Project</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Client Number
          </label>
          <input
            type="text"
            name="mobile"
            value={newProject.mobile}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border p-2"
            list="clientNumbers"
          />
          <datalist id="clientNumbers">
            {fuse &&
              fuse
                .search(newProject.mobile ?? "")
                .map(({ item }) => (
                  <option
                    key={item}
                    value={item}
                    onClick={() => handleClientSelect(item)}
                  />
                ))}
          </datalist>
          <button
            onClick={() => handleClientSelect(newProject.mobile || "")}
            className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Fetch Client
          </button>
        </div>
        {/* Display client information */}
        {newProject.clientName && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Client Name
            </label>
            <div>{newProject.clientName}</div>
          </div>
        )}
        {address && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Client Address
            </label>
            <div>{address}</div>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Project Name
          </label>
          <input
            type="text"
            name="projectName"
            value={newProject.projectName}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAddProject}
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

export default AddProject;
