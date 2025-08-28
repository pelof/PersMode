
import type { Product } from "@/types";
import { Link } from "@tanstack/react-router";

type HeroProps = {
product: Product
}

export function Hero({product}: HeroProps) {
  return (
    <section className="border-1 flex items-center justify-center flex-col lg:flex-row-reverse lg:items-start">
      <Link to="/products/$slug" params={{ slug: product.product_slug }} className="flex-2 w-full p-5">
        <img
          src={product.product_image}
          alt={product.product_name}
          className="aspect-3/2 object-cover w-full"
        />
      </Link>
      <div className="text-center flex-1 p-10">
        <h2 className="text-2xl font-bold mt-4">{product.product_name}</h2>
        <p className="max-w-lg mt-4">
          {product.product_description}
        </p>
      </div>
    </section>
  );
}