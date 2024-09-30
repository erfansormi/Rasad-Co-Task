import { ProductType } from "../../../types/product";

const ProductsList = ({ products }: { products: ProductType[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 flex-1">
    {products.map((product) => (
      <section
        key={product.id}
        className="p-4 rounded-lg shadow flex flex-col gap-3 bg-white group"
      >
        <div className="flex items-center justify-center overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="size-40 group-hover:scale-125 transition-transform duration-700 object-contain"
          />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-sm line-clamp-1 font-semibold">{product.title}</h2>
          <p className="line-clamp-1 text-neutral-600 text-xs">{product.description}</p>

          <div className="mt-1">
            <strong className="font-semibold">${product.price.toLocaleString()}</strong>
          </div>
        </div>
      </section>
    ))}
  </div>
);

export default ProductsList;
