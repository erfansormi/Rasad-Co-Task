// App.tsx
import React, { useState, useEffect } from "react";
import { ProductType } from "../../types/product";
import ProductsList from "./components/products-list";
import { useSearchParams } from "react-router-dom";
import Button from "../../components/ui/button";
import ProductsFilter from "./components/products-filter";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, ShieldAlert } from "lucide-react";
import { useHomePageData } from "./hooks/use-home-page-data";
import ProductsPagination from "./components/products-pagination";

const HomePage: React.FC = () => {
  const {
    error,
    brands,
    products,
    categories,
    selectedBrands,
    setSelectedBrands,
    selectedCategories,
    setSelectedCategories,
  } = useHomePageData();

  return (
    <main className="bg-neutral-50">
      <div className="container h-full flex flex-col gap-4 min-h-screen">
        <h1 className="text-2xl font-bold">Product List</h1>

        <div className="flex gap-6 lg:flex-row flex-col grow">
          <ProductsFilter
            brands={brands}
            categories={categories}
            selectedBrands={selectedBrands}
            selectedCategories={selectedCategories}
            setSelectedBrands={setSelectedBrands}
            setSelectedCategories={setSelectedCategories}
          />

          {error ? (
            <div className="flex justify-center w-full text-red-500 font-semibold">
              <div className="items-center h-fit flex gap-2">
                <span>{error}</span>
                <span>
                  <ShieldAlert />
                </span>
              </div>
            </div>
          ) : (
            <ProductsList products={products} />
          )}
        </div>

        <hr className="mt-4" />

        <ProductsPagination />
      </div>
    </main>
  );
};

export default HomePage;
