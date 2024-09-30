// App.tsx
import React, { useState, useEffect } from "react";
import { ProductType } from "../../types/product";
import ProductsList from "./components/products-list";
import { useSearchParams } from "react-router-dom";
import Button from "../../components/ui/button";
import ProductsFilter from "./components/products-filter";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, ShieldAlert } from "lucide-react";

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState("");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const searchValue = searchParams.get("search");
  const minPrice = searchParams.get("minPrice") || 0;
  const maxPrice = searchParams.get("maxPrice") || Infinity;

  const queryPage = searchParams.get("page");
  const page = queryPage && !isNaN(parseInt(queryPage)) ? parseInt(queryPage) : 1;

  // i use 12 instead of 10, because my ui match with 12 product per page!
  const perPage = 12;

  const [paginateData, setPaginateData] = useState({
    items: 0,
    pages: 0,
  });

  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/products`)
      .then((response) => response.json())
      .then((json: ProductType[]) => {
        setError("");
        setCategories([...new Set(json.map((item) => item.category))].sort());
        setBrands(
          [...new Set(json.filter((item) => item.brand).map((item) => item.brand!))].sort()
        );
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const queries = new URLSearchParams();
    if (searchValue) {
      queries.set("q", searchValue);
    }
    queries.set("_page", String(page));
    queries.set("_limit", String(perPage));
    queries.set("price_gte", String(minPrice));
    queries.set("price_lte", String(maxPrice));
    if (selectedCategories.length) {
      queries.set("category", selectedCategories.join(","));
    }
    // if (selectedBrands.length) {
    //   queries.set("brand", selectedBrands.join(","));
    // }

    fetch(`http://localhost:3000/products?${queries.toString()}`)
      .then((response) => {
        const totalItems = +response.headers.get("X-Total-Count")!;
        setPaginateData({ items: totalItems, pages: Math.ceil(totalItems / perPage) });
        return response.json();
      })
      .then((json) => {
        setError("");
        setProducts(json);
      })
      .catch((err) => setError(err.message));
  }, [page, searchValue, minPrice, maxPrice, selectedCategories]);

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

        <div className="flex text-sm items-center gap-4 justify-end font-medium">
          <p>Total: {paginateData.items}</p>
          <div className="flex items-center gap-2">
            <Button
              size={"icon"}
              variant={"secondary"}
              disabled={page <= 1}
              onClick={() => {
                searchParams.set("page", "1");
                setSearchParams(searchParams);
              }}
            >
              <ChevronFirst size={18} />
            </Button>
            <Button
              size={"icon"}
              variant={"secondary"}
              disabled={page <= 1}
              onClick={() => {
                searchParams.set("page", (page - 1).toString());
                setSearchParams(searchParams);
              }}
            >
              <ChevronLeft size={18} />
            </Button>
          </div>

          <span>
            {page} of {paginateData.pages}
          </span>

          <div className="flex items-center gap-2">
            <Button
              size={"icon"}
              variant={"secondary"}
              disabled={page >= paginateData.pages}
              onClick={() => {
                searchParams.set("page", (page + 1).toString());
                setSearchParams(searchParams);
              }}
            >
              <ChevronRight size={18} />
            </Button>
            <Button
              size={"icon"}
              variant={"secondary"}
              disabled={page >= paginateData.pages}
              onClick={() => {
                searchParams.set("page", paginateData.pages.toString());
                setSearchParams(searchParams);
              }}
            >
              <ChevronLast size={18} />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
