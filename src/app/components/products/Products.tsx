// Products.tsx

"use client";

import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import AddProduct from "./AddProduct";
import DeleteProduct from "./DeleteProduct";
import EditProduct from "./EditProduct";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import { Skeleton } from "~/components/ui/skeleton";

const Products: React.FC = () => {
  const localStorageProducts = localStorage.getItem("localProducts");
  const initialProducts = localStorageProducts
    ? (JSON.parse(localStorageProducts) as Product[])
    : [];
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(40);
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);
  const [isDeleteProductOpen, setIsDeleteProductOpen] =
    useState<boolean>(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Partial<Product>>({
    productId: 0,
    productName: "",
    manufacturer: "",
    size: 0,
    sizeUnit: "",
    listPrice: 0,
  });

  const fetchData = async () => {
    try {
      const response = await fetch("/api/product/getProducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page,
          pageSize,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: Product[] = await response.json();
      setProducts(data);
      localStorage.setItem("localProducts", JSON.stringify(data));
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    }
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

  const handleOpenAddProduct = () => {
    setIsAddProductOpen(true);
  };

  const handleCloseAddProduct = () => {
    setIsAddProductOpen(false);
  };

  const handleAddProduct = async (newProduct: Partial<Product>) => {
    try {
      const response = await fetch("/api/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      fetchData(); // Refresh the product list after adding a new product
      handleCloseAddProduct();
    } catch (error: any) {
      console.error("Error adding product:", error.message);
    }
  };

  const handleOpenDeleteProduct = (productId: string) => {
    setSelectedProductId(productId);
    setIsDeleteProductOpen(true);
  };

  const handleCloseDeleteProduct = () => {
    setSelectedProductId("");
    setIsDeleteProductOpen(false);
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch("/api/product/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedProductId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      fetchData(); // Refresh the product list after deleting a product
      handleCloseDeleteProduct();
    } catch (error: any) {
      console.error("Error deleting product:", error.message);
    }
  };

  const handleOpenEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  const handleCloseEditProduct = () => {
    setSelectedProductId("");
    setIsEditProductOpen(false);
  };

  const handleEditProduct = async (updatedProduct: Partial<Product>) => {
    try {
      const response = await fetch("/api/product/modify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedProduct,
          id: updatedProduct.productId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit product");
      }

      fetchData(); // Refresh the product list after editing a product
      handleCloseEditProduct();
    } catch (error: any) {
      console.error("Error editing product:", error.message);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-4xl font-bold">Product List</h1>

      {/* "Add Product" Button */}
      <button
        onClick={handleOpenAddProduct}
        className="mb-4 rounded-md bg-green-500 px-4 py-2 text-white"
      >
        Add Product
      </button>

      {/* Product List */}
      <div className="max-h-96 overflow-y-auto">
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* {products.length === 0 && <ProductCardSkeleton />} */}
          {products.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              handleOpenDeleteProduct={handleOpenDeleteProduct}
              handleOpenEditProduct={handleOpenEditProduct}
            />
          ))}
        </ul>
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          <label className="mr-2">Page Size:</label>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="rounded-md border p-2"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div>
          <span className="mr-2">Page:</span>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="mr-2 rounded-md border px-4 py-2"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            className="rounded-md border px-4 py-2"
          >
            Next
          </button>
        </div>
      </div>

      {/* AddProduct Overlay */}
      {isAddProductOpen && (
        <AddProduct
          onAddProduct={handleAddProduct}
          onClose={handleCloseAddProduct}
        />
      )}

      {/* DeleteProduct Overlay */}
      {isDeleteProductOpen && (
        <DeleteProduct
          onDeleteProduct={handleDeleteProduct}
          onClose={handleCloseDeleteProduct}
          productId={selectedProductId}
        />
      )}

      {/* EditProduct Overlay */}
      {isEditProductOpen && (
        <EditProduct
          onEditProduct={handleEditProduct}
          onClose={handleCloseEditProduct}
          product={selectedProduct as Product}
        />
      )}
    </div>
  );
};

export default Products;
