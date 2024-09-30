import { useSearchParams } from "react-router-dom";
import Input from "../../../components/ui/input";
import SelectBox from "../../../components/ui/select-box";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import Button from "../../../components/ui/button";

const ProductsFilter = ({
  brands,
  categories,
  selectedBrands,
  selectedCategories,
  setSelectedBrands,
  setSelectedCategories,
}: {
  brands: string[];
  categories: string[];
  selectedBrands: string[];
  selectedCategories: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="p-4 rounded-lg bg-white shadow w-full lg:max-w-xs h-fit lg:sticky top-4 gap-3 flex flex-col">
      <div className="relative">
        <Input
          className="w-full ps-7"
          type="search"
          variant={"muted"}
          value={searchParams.get("search") || ""}
          placeholder="Search Product..."
          onChange={(e) => {
            const value = e.target.value;
            searchParams.set("search", value);
            searchParams.set("page", "1");
            setSearchParams(searchParams);
          }}
        />

        <Search size={15} className="absolute left-2 top-[13px] text-neutral-500" />
      </div>

      <hr />

      <div className="flex gap-2.5 flex-col">
        <SelectBox
          multiple
          label="Category"
          values={selectedCategories}
          setValues={setSelectedCategories}
          placeholder="Filter categories ..."
          options={categories.map((category) => ({ value: category }))}
        />

        <SelectBox
          multiple
          label="Brand"
          values={selectedBrands}
          setValues={setSelectedBrands}
          placeholder="Filter brands ..."
          options={brands.map((brand) => ({ value: brand }))}
        />
      </div>

      <hr />

      <div className="flex sm:flex-row flex-col items-center gap-2">
        <Input
          min={0}
          type="number"
          name="minPrice"
          variant={"muted"}
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
          variant={"muted"}
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
        <Button
          size={"sm"}
          variant={"error"}
          className="flex items-center gap-1"
          onClick={() => {
            setSelectedBrands([]);
            setSelectedCategories([]);
            searchParams.delete("page");
            searchParams.delete("search");
            searchParams.delete("price_gte");
            searchParams.delete("price_lte");
            searchParams.delete("brands");
            searchParams.delete("categories");
            setSearchParams(searchParams);
          }}
        >
          <X size={18} />
          <span>Reset Filters</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductsFilter;
