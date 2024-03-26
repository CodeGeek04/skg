"use client";

// Import necessary React modules and components
import React, { useState } from "react";
import Products from "./components/products/Products";
import Clients from "./components/clients/Clients";
import Projects from "./components/projects/Projects";
import OfferManagement from "./components/offer/Offers";
import EnquirySheet from "./components/enquirySheet/EnquirySheet";

// Define the Home component
export default function Home() {
  const [currentTab, setCurrentTab] = useState("products");
  return (
    <div className="from-primary to-secondary min-h-screen bg-gradient-to-r p-8">
      <h1 className="mb-8 text-center text-4xl font-bold text-white">Home</h1>
      <div className="mb-8 flex flex-wrap justify-center">
        <button
          className="hover:bg-secondary m-2 rounded-lg bg-yellow-300 px-4 py-2 text-black shadow-lg transition duration-300"
          onClick={() => setCurrentTab("products")}
        >
          Products
        </button>
        <button
          className="hover:bg-secondary m-2 rounded-lg bg-yellow-300 px-4 py-2 text-black shadow-lg transition duration-300"
          onClick={() => setCurrentTab("clients")}
        >
          Clients
        </button>
        <button
          className="hover:bg-secondary m-2 rounded-lg bg-yellow-300 px-4 py-2 text-black shadow-lg transition duration-300"
          onClick={() => setCurrentTab("projects")}
        >
          Projects
        </button>
        <button
          className="hover:bg-secondary m-2 rounded-lg bg-yellow-300 px-4 py-2 text-black shadow-lg transition duration-300"
          onClick={() => setCurrentTab("offers")}
        >
          Offers
        </button>
        <button
          className="hover:bg-secondary m-2 rounded-lg bg-yellow-300 px-4 py-2 text-black shadow-lg transition duration-300"
          onClick={() => setCurrentTab("enquiry")}
        >
          Enquiry Sheet
        </button>
      </div>
      {currentTab === "products" && <Products />}
      {currentTab === "clients" && <Clients />}
      {currentTab === "projects" && <Projects />}
      {currentTab === "offers" && <OfferManagement />}
      {currentTab === "enquiry" && <EnquirySheet />}
    </div>
  );
}
