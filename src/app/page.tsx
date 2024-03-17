"use client";

// Import necessary React modules and components
import React, { useState } from "react";
import ProductDisplay from "./components/products/ProductDisplay";

// Define the Home component
export default function Home() {
  // State for tracking the current tab
  return (
    <div>
      <h1>Home</h1>
      <ProductDisplay />
    </div>
  );
}
