// App.tsx
import React, { useState, useEffect } from "react";
import { ProductType } from "../../types/product";
import ProductsList from "./components/products-list";
import { useSearchParams } from "react-router-dom";
import Button from "../../components/ui/button";
import ProductsFilter from "./components/products-filter";

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchValue = searchParams.get("search");

  const minPrice = searchParams.get("minPrice") || 0;
  const maxPrice = searchParams.get("maxPrice") || Infinity;

  const queryCategories = searchParams.get("categories") || "";
  const queryBrands = searchParams.get("brands") || "";

  const queryPage = searchParams.get("page");
  const page = queryPage && !isNaN(parseInt(queryPage)) ? parseInt(queryPage) : 1;

  // i use 12 instead of 10, because my ui match with 12 product per page!
  const perPage = 12;

  const [paginateData, setPaginateData] = useState({
    items: 0,
    pages: 0,
  });

  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  // const [searchTerm, setSearchTerm] = useState<string>("");
  // const [filters, setFilters] = useState<{
  //   category: string;
  //   brand: string;
  //   minPrice: number;
  //   maxPrice: number;
  // }>({
  //   category: "",
  //   brand: "",
  //   minPrice: 0,
  //   maxPrice: Infinity,
  // });
  // const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/products`)
      .then((response) => response.json())
      .then((json: ProductType[]) => {
        setCategories([...new Set(json.map((item) => item.category))]);
        setBrands([...new Set(json.filter((item) => item.brand).map((item) => item.brand!))]);
      });
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:3000/products?_page=${page}&_limit=${perPage}&q=${searchValue}&price_gte=${minPrice}&price_lte=${maxPrice}&category=${queryCategories}&brnad=${queryBrands}`
    )
      .then((response) => {
        const totalItems = +response.headers.get("X-Total-Count")!;
        setPaginateData({ items: totalItems, pages: Math.ceil(totalItems / perPage) });
        return response.json();
      })
      .then((json) => {
        setProducts(json);
      });
  }, [page, searchValue, minPrice, maxPrice]);

  return (
    <main className="bg-neutral-50 min-h-screen">
      <div className="container">
        <h1 className="text-2xl font-bold mb-4">Product List</h1>

        <div className="flex gap-6 lg:flex-row flex-col">
          <ProductsFilter categories={categories} brands={brands} />

          <ProductsList products={products} />
        </div>

        <div className="flex justify-between items-center mt-4 gap-4">
          {/* <p className="text-sm">Total Products: {filteredProducts.length}</p> */}
          <div className="flex items-center gap-4">
            <Button
              disabled={page <= 1}
              onClick={() => {
                searchParams.set("page", (page - 1).toString());
                setSearchParams(searchParams);
              }}
            >
              Previous
            </Button>
            <span>
              {" "}
              Page {page} of {paginateData.pages}
            </span>
            <Button
              disabled={page >= paginateData.pages}
              onClick={() => {
                searchParams.set("page", (page + 1).toString());
                setSearchParams(searchParams);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
