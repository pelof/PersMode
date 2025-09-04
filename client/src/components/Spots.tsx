import type { Product } from "@/types";
import { Link } from "@tanstack/react-router";

type SpotProps = {
  products: Product[];
};
export default function Spots({ products }: SpotProps) {
  return (
    <section className="hidden lg:flex lg:gap-10 lg:my-10 justify-center">
      {products.map((product) => (
        <Link
         key={product.product_slug}
          to="/products/$slug"
          params={{ slug: product.product_slug }}
          className="relative flex-1"
        >
          <img
            src={`http://localhost:5000/images/products/${product.product_image}`}
            alt={product.product_name}
            className="aspect-3/2 object-cover w-full"
          />
          <h3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full font-bold text-2xl">
            {product.product_name}
          </h3>
        </Link>
      ))}
    </section>
  );
}
