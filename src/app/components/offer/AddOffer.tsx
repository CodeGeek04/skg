// AddOffer.tsx
"use client";

import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { Client, Offer, Product, ProductSize, Project } from "@prisma/client";
import { AddOfferProduct } from "./AddOfferProduct";
import {
  fetchClientByName,
  fetchProjects,
  addOffer,
} from "~/app/serverActions";
import { offerProduct } from "~/app/types";

interface AddOfferProps {
  onClose: () => void;
  clientNames: string[];
}

const AddOffer: React.FC<AddOfferProps> = ({ onClose, clientNames }) => {
  const [offer, setOffer] = useState<Partial<Offer>>({
    totalPrice: 0,
  });
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [offerProducts, setOfferProducts] = useState<offerProduct[]>([]);
  const [isAddOfferProductModalOpen, setIsAddOfferProductModalOpen] =
    useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  console.log("clientNames", clientNames);

  const fuse = new Fuse(clientNames, {
    keys: ["clientName"],
    threshold: 0.3,
  });

  const handleCloseAddOfferProductModal = () => {
    setIsAddOfferProductModalOpen(false);
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    offerProducts.forEach((offerProduct) => {
      let productPrice = 0;
      offerProduct.productQuantities.forEach((productQuantity) => {
        productPrice +=
          productQuantity.productSize.listPrice * productQuantity.quantity;
      });
      totalPrice += productPrice * (1 - offerProduct.discount / 100);
    });
    setOffer({ ...offer, totalPrice });
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [offerProducts]);

  const handleFetchProjects = async () => {
    const selectedClient = await fetchClientByName(
      offer.clientName ? offer.clientName : "",
    );
    if (selectedClient) {
      setClient(selectedClient);
      const projects = await fetchProjects(selectedClient);
      setProjects(projects);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900 bg-opacity-70">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Add Offer</h2>
            <div className="mb-4">
              <label htmlFor="offerNumber" className="mb-2 block">
                Offer Number
              </label>
              <input
                type="text"
                id="offerNumber"
                onChange={(e) =>
                  setOffer({ ...offer, offerNumber: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="client" className="mb-2 block">
                Client
              </label>
              <input
                type="text"
                list="clientNames"
                id="client"
                onChange={(e) => {
                  setOffer({ ...offer, clientName: e.target.value });
                  const results = fuse.search(e.target.value);
                  setSuggestions(results.map((result) => result.item));
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="clientNames">
                {suggestions.map((suggestion, index) => (
                  <option key={index} value={suggestion} />
                ))}
              </datalist>
            </div>
            <button onClick={handleFetchProjects}>Fetch Projects</button>
            <div className="mb-4">
              <label htmlFor="project" className="mb-2 block">
                Project
              </label>
              <select
                id="project"
                value={selectedProject?.projectId || ""}
                onChange={(e) => {
                  const projectId = e.target.value;
                  const selectedProject = projects.find(
                    (project) => project.projectId === projectId,
                  );
                  setSelectedProject(selectedProject || null);
                  setOffer({ ...offer, projectId });
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.projectId} value={project.projectId}>
                    {project.projectName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <p className="text-lg font-semibold">Client Details:</p>
              <p>{client?.clientName}</p>
              <p>{client?.address}</p>
            </div>
            <div className="mb-4">
              <p className="text-lg font-semibold">Project:</p>
              <p>{selectedProject?.projectName}</p>
            </div>
            <div className="mb-4">
              <p className="text-lg font-semibold">Total Price:</p>
              <p>{offer.totalPrice}</p>
            </div>
            <div className="mb-4">
              <button
                onClick={() => setIsAddOfferProductModalOpen(true)}
                className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Product
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="mr-2 rounded bg-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await addOffer(offer, offerProducts);
                  onClose();
                }}
                className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Offer
              </button>
            </div>
          </div>
          {isAddOfferProductModalOpen && (
            <AddOfferProduct
              onClose={handleCloseAddOfferProductModal}
              offerProducts={offerProducts}
              setOfferProducts={setOfferProducts}
            />
          )}
          <div>
            {offerProducts.map((offerProduct, index) => (
              <div
                key={index}
                className="mt-4 rounded-md border border-gray-300 p-4"
              >
                <h3 className="text-lg font-semibold">
                  {offerProduct.product?.productName}
                </h3>
                <p>Discount: {offerProduct.discount}</p>
                <p className="font-semibold">Product Sizes:</p>
                <ul>
                  {offerProduct.productQuantities.map(
                    (productQuantity, index) => (
                      <li key={index}>
                        {productQuantity.productSize.size} -{" "}
                        {productQuantity.quantity}
                      </li>
                    ),
                  )}
                </ul>
                <button
                  onClick={() => {
                    setOfferProducts(
                      offerProducts.filter((product, idx) => idx !== index),
                    );
                  }}
                  className="mt-2 rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Remove Product
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddOffer;
