import Button from "../../../components/ui/button";
import { useSearchParams } from "react-router-dom";
import { useHomePageData } from "../hooks/use-home-page-data";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";

const ProductsPagination = () => {
  const { page, paginateData } = useHomePageData();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="flex text-sm items-center gap-4 justify-end font-medium">
      <p>Total: {paginateData.items}</p>

      <div className="flex items-center gap-2">
        {/* PAGINATE TO FIRST */}
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

        {/* PAGINATE TO PREVIOUS */}
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
        {/* PAGINATE TO NEXT */}
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

        {/* PAGINATE TO LAST */}
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
  );
};

export default ProductsPagination;
