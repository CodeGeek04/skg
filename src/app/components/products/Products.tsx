// Products.tsx

"use client";

import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { ProductCard } from "./ProductCard";
import AddProduct from "./AddProduct";
import { getProducts } from "~/app/serverActions";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productNames, setProductNames] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(40);
  const [loading, setLoading] = useState(true);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await getProducts(page, pageSize);
      setProducts(response);
      setProductNames(response.map((product) => product.productName));
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

  const handleCloseAddProductModal = () => {
    fetchData();
    setIsAddProductModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!loading && products.length === 0 && (
        <div className="text-center text-gray-600">No Products Found</div>
      )}
      {loading && <div className="text-center text-gray-600">Loading...</div>}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {products.length > 0 &&
          products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
      </div>
      {isAddProductModalOpen && (
        <AddProduct
          onClose={handleCloseAddProductModal}
          productNames={productNames}
        />
      )}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setIsAddProductModalOpen(true)}
          className="hover:bg-secondary rounded bg-yellow-300 px-4 py-2 text-black"
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default Products;
