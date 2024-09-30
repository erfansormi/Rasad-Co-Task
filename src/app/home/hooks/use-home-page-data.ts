import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductType } from "../../../types/product";

// In-memory cache
const cache: any = {
  products: null,
  filters: null,
};

export const useHomePageData = () => {
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const searchValue = searchParams.get("search");
  const minPrice = searchParams.get("minPrice") || 0;
  const maxPrice = searchParams.get("maxPrice") || Infinity;

  const perPage = 12;
  const queryPage = searchParams.get("page");
  const page = queryPage && !isNaN(parseInt(queryPage)) ? parseInt(queryPage) : 1;
  const [paginateData, setPaginateData] = useState({
    items: 0,
    pages: 0,
  });

  // DATA
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  // FETCH PRODUCTS FILTERS
  useEffect(() => {
    if (cache.filters) {
      setCategories(cache.filters?.categories);
      setBrands(cache.filters?.brands);
      return;
    }

    fetch(`http://localhost:3000/prductsFilters`)
      .then((response) => response.json())
      .then(({ brands, categories }: { brands: string[]; categories: string[] }) => {
        setError("");
        setCategories(categories);
        setBrands(brands);
        cache.filters = { brands, categories }; // Cache the filters
      })
      .catch((err) => setError(err.message));
  }, []);

  // HANDLE FILTERS AND FETCH PRODUCTS DATA
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
      queries.set("category", selectedCategories[0]);
    }
    if (selectedBrands.length) {
      queries.set("brand", selectedBrands[0]);
    }

    const cacheKey = queries.toString();

    if (cache.products && cache.products?.[cacheKey]) {
      setProducts(cache.products[cacheKey].data);
      setPaginateData(cache.products[cacheKey].paginateData);
      return;
    }

    fetch(`http://localhost:3000/products?${cacheKey}`)
      .then((response) => {
        const totalItems = +response.headers.get("X-Total-Count")!;
        const paginateData = { items: totalItems, pages: Math.ceil(totalItems / perPage) };
        setPaginateData(paginateData);
        return response.json().then((json) => {
          setError("");
          setProducts(json);
          if (!cache.products) {
            cache.products = {};
          }
          cache.products[cacheKey] = { data: json, paginateData }; // Cache the products
        });
      })
      .catch((err) => setError(err.message));
  }, [page, searchValue, minPrice, maxPrice, selectedCategories, selectedBrands]);

  return {
    page,
    error,
    brands,
    products,
    categories,
    paginateData,
    selectedBrands,
    selectedCategories,
    setSelectedBrands,
    setSelectedCategories,
  };
};
