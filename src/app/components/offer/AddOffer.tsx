// AddOffer.tsx
"use client";

import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import {
  Project,
  Product,
  Client,
  Offer,
  Prisma,
  OfferProduct,
} from "@prisma/client";
import AddOfferProduct from "./AddOfferProduct";
import { off } from "process";
import { set } from "zod";

interface AddOfferProps {
  onClose: () => void;
  manufacturers: string[];
}

const AddOffer: React.FC<AddOfferProps> = ({ onClose, manufacturers }) => {
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({
    mobile: "",
    clientName: "",
    projectId: "",
    projectName: "",
    discount: 0,
    totalPrice: 0,
  });

  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [offerProducts, setOfferProducts] = useState<Partial<OfferProduct>[]>(
    [],
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedOfferProduct, setSelectedOfferProduct] =
    useState<Partial<OfferProduct> | null>(null);
  const [isDeleteOfferProductModalOpen, setIsDeleteOfferProductModalOpen] =
    useState(false);
  const [fuseClients, setFuseClients] = useState<Fuse<Client> | null>(null);
  const [fuseMobiles, setFuseMobiles] = useState<Fuse<string> | null>(null);
  const [isAddOfferProductModalOpen, setIsAddOfferProductModalOpen] =
    useState(false);

  useEffect(() => {
    // Fetch client numbers from the server when the component mounts
    const fetchClientNumbers = async () => {
      try {
        const response = await fetch("/api/client/getClients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch client numbers");
        }
        const data: Client[] = await response.json();
        setFuseClients(new Fuse(data));
        setFuseMobiles(new Fuse(data.map((client) => client.mobile)));
      } catch (error: any) {
        console.error("Error fetching client numbers:", error.message);
      }
    };

    fetchClientNumbers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOffer((prevOffer: Partial<Offer>) => ({
      ...prevOffer,
      [name]: value,
    }));
  };

  const handleClientSelect = async (selectedClient: string) => {
    setNewOffer((prevOffer: any) => ({
      ...prevOffer,
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
        throw new Error("Failed to fetch client");
      }

      const data = (await response.json()) as Client;
      setNewOffer((prevOffer: any) => ({
        ...prevOffer,
        clientName: data.clientName,
      }));
      setSelectedClient(data);
    } catch (error: any) {
      alert("Error, Client not found!!");
      console.error("Error fetching client:", error.message);
    }

    try {
      const response = await fetch(`/api/project/getForClient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientMobile: selectedClient }),
      });

      if (!response.ok) {
        alert("Client not found!!");
        throw new Error("Failed to fetch projects");
      }

      const data = (await response.json()) as Project[];
      setProjects(data);
    } catch (error: any) {
      alert("Error, Client not found!!");
      console.error("Error fetching projects:", error.message);
    }
  };

  const handleProjectSelect = (selectedProjectId: string) => {
    setNewOffer((prevOffer: any) => ({
      ...prevOffer,
      projectId: selectedProjectId,
      projectName: projects.find(
        (project) => project.projectId === selectedProjectId,
      )?.projectName,
    }));
  };

  const handleAddOffer = async () => {
    // Validate that all required fields are filled
    if (!newOffer.mobile || !newOffer.projectId) {
      // Use a more user-friendly notification library or component
      alert("Please enter all required information.");
      return;
    }

    try {
      const response = await fetch("/api/offer/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOffer),
      });

      if (!response.ok) {
        alert("Failed to add offer to the database");
        throw new Error("Failed to add offer to the database");
      }

      const data: { offerNumber: string } = await response.json();

      offerProducts.forEach(async (product) => {
        const response = await fetch("/api/offerProduct/addForOffer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            offerNumber: data.offerNumber,
            productName: product.productName,
            productId: product.productId,
            listPrice: product.listPrice,
            quantity: product.quantity,
          }),
        });

        console.log("Response: ", response);

        if (!response.ok) {
          alert("Failed to add product to the offer");
          throw new Error("Failed to add product to the offer");
        }
      });

      alert(`Offer successfully added with ID: ${data.offerNumber}`);
      onClose();
    } catch (error: any) {
      console.error("Error adding offer:", error.message);
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discount = parseFloat(e.target.value) || 0;
    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - (totalPrice * (newOffer.discount ?? 0)) / 100,
    );
    setNewOffer((prevOffer) => ({
      ...prevOffer,
      discount,
      totalPrice: totalPrice * (1 - discount / 100),
    }));
  };

  const handleAddProduct = (product: Partial<OfferProduct>, price: number) => {
    setOfferProducts((prevProducts) => [...prevProducts, product]);
    setTotalPrice((prevTotalPrice) => prevTotalPrice + price);
    setNewOffer((prevOffer) => ({
      ...prevOffer,
      totalPrice: (prevOffer.totalPrice ?? 0) + price,
    }));
  };

  const handleRemoveOfferProduct = (productId: number) => {
    setOfferProducts((prevProducts) =>
      prevProducts.filter((product) => product.productId !== productId),
    );
    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice -
        (selectedOfferProduct?.listPrice ?? 0) *
          (selectedOfferProduct?.quantity ?? 0),
    );
    setNewOffer((prevOffer) => ({
      ...prevOffer,
      totalPrice:
        (prevOffer.totalPrice ?? 0) -
        (selectedOfferProduct?.listPrice ?? 0) *
          (selectedOfferProduct?.quantity ?? 0),
    }));
    setIsDeleteOfferProductModalOpen(false);
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="w-96 rounded-md bg-white p-8">
        <h2 className="mb-4 text-2xl font-bold">Add Offer</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Client Number
          </label>
          <input
            type="text"
            name="mobile"
            value={newOffer.mobile}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 w-full rounded-md border p-2"
            list="mobiles"
          />
          <datalist id="mobiles">
            {fuseMobiles &&
              fuseMobiles
                .search(newOffer.mobile ?? "")
                .map(({ item }) => (
                  <option
                    key={item}
                    value={item}
                    onClick={() => handleClientSelect(item)}
                  />
                ))}
          </datalist>
          <button
            onClick={() => handleClientSelect(newOffer.mobile || "")}
            className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Fetch Client
          </button>
        </div>
        {/* Display client information */}
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">Client Information</h3>
          <p>Name: {selectedClient?.clientName}</p>
          <p>Email: {selectedClient?.mailId}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Selected Project
          </label>
          <select
            value={newOffer.projectId}
            onChange={(e) => handleProjectSelect(e.target.value)}
            className="mt-1 w-full rounded-md border p-2"
          >
            <option value="" disabled>
              Select Project
            </option>
            {projects.map((project) => (
              <option key={project.projectId} value={project.projectId}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Discount
          </label>
          <input
            type="number"
            name="discount"
            value={newOffer.discount}
            onChange={(e) => handleDiscountChange(e)}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        {/* AddOfferProduct component */}
        {newOffer.projectId && isAddOfferProductModalOpen && (
          <AddOfferProduct
            onClose={() => setIsAddOfferProductModalOpen(false)}
            onAddProduct={handleAddProduct}
            manufacturers={manufacturers}
          />
        )}
        <button
          onClick={() => setIsAddOfferProductModalOpen(true)}
          className="mb-4 rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          Add New Product
        </button>
        {/* Display offer summary */}
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">Offer Summary</h3>
          <ul>
            <ul>
              {offerProducts?.map((offerProduct: Partial<OfferProduct>) => (
                <li key={offerProduct.offerProductId}>
                  {offerProduct.productName} - {offerProduct.listPrice} -{" "}
                  {offerProduct.quantity}
                  <button
                    onClick={() => {
                      setSelectedOfferProduct(offerProduct);
                      setIsDeleteOfferProductModalOpen(true);
                    }}
                    className="ml-2 rounded-md bg-red-500 px-2 py-1 text-white"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </ul>
          <p className="mt-2 font-semibold">
            Total Price: ${newOffer.totalPrice?.toFixed(2)}
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAddOffer}
            className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Add Offer
          </button>
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-gray-500"
          >
            Cancel
          </button>
        </div>
        {isDeleteOfferProductModalOpen && (
          <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="w-96 rounded-md bg-white p-8">
              <h2 className="mb-4 text-2xl font-bold">
                Confirm Product Removal
              </h2>
              <p className="mb-4">
                Are you sure you want to remove this product?
              </p>
              <div className="flex justify-end">
                <button
                  className="mr-2 rounded-md bg-gray-500 px-4 py-2 text-white"
                  onClick={() => setIsDeleteOfferProductModalOpen(false)}
                >
                  No
                </button>
                <button
                  className="rounded-md bg-red-500 px-4 py-2 text-white"
                  onClick={() =>
                    handleRemoveOfferProduct(
                      selectedOfferProduct?.productId || 0,
                    )
                  }
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddOffer;
