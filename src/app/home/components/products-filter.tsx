import { useSearchParams } from "react-router-dom";
import Input from "../../../components/ui/input";
import SelectBox from "../../../components/ui/select-box";
import { useEffect, useState } from "react";

const ProductsFilter = ({ brands, categories }: { brands: string[]; categories: string[] }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    searchParams.set("categories", selectedCategories.join(","));
    setSearchParams(searchParams);
  }, [selectedCategories]);

  return (
    <div className="p-4 rounded-lg bg-white shadow w-full lg:max-w-xs h-fit lg:sticky top-4 gap-3 flex flex-col">
      <Input
        type="search"
        value={searchParams.get("search") || ""}
        placeholder="Search Product..."
        onChange={(e) => {
          const value = e.target.value;
          searchParams.set("search", value);
          searchParams.set("page", "1");
          setSearchParams(searchParams);
        }}
      />

      <hr />

      <div className="flex items-center gap-2 flex-col sm:flex-row lg:flex-col">
        <SelectBox
          values={selectedCategories}
          setValues={setSelectedCategories}
          options={categories.map((category) => ({ value: category }))}
          label="Category"
          placeholder="Filter categories ..."
        />

        <select
          onChange={(e) => console.log(e.target.value)}
          name="category"
          className="border p-2 rounded w-full"
        >
          <option value="">All Categories</option>
        </select>
        <select name="brand" className="border p-2 rounded w-full">
          <option value="">All Brands</option>
          {/* Add more brands as needed */}
        </select>
      </div>

      <hr />

      <div className="flex sm:flex-row flex-col items-center gap-2">
        <Input
          min={0}
          type="number"
          name="minPrice"
          placeholder="Min Price"
          className="w-full"
          value={searchParams.get("minPrice") || ""}
          onChange={(e) => {
            const value = e.target.value;
            searchParams.set("minPrice", value);
            searchParams.set("page", "1");
            setSearchParams(searchParams);
          }}
        />
        <Input
          min={0}
          type="number"
          name="maxPrice"
          className="w-full"
          placeholder="Max Price"
          value={searchParams.get("maxPrice") || ""}
          onChange={(e) => {
            const value = e.target.value;
            searchParams.set("maxPrice", value);
            searchParams.set("page", "1");
            setSearchParams(searchParams);
          }}
        />
      </div>

      <hr />

      <div>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Reset Filters</button>
      </div>
    </div>
  );
};

export default ProductsFilter;
