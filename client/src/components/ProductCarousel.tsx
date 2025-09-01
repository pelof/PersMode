import { useSimilarProducts } from "@/api/products";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type ProductCarouselProps = {
  currentSlug: string;
};

export function ProductCarousel({ currentSlug }: ProductCarouselProps) {
  const { data: products, isLoading } = useSimilarProducts(currentSlug);

  if (!currentSlug) {
    return null;
  }

  const [index, setIndex] = useState(0); // Orsakade error "Rendered more hooks than during the previous render." när den låg efter "if(isLoading)...".

  if (isLoading) return <p>Laddar...</p>;
  if (!products?.length) return <p>Inga produkter hittades</p>;

  const next = () => {
    setIndex((i) => (i >= products.length - 3 ? 0 : i + 1));
  };

  const prev = () => {
    setIndex((i) => (i <= 0 ? products.length - 3 : i - 1));
  };

  return (
    <div className="hidden md:block relative w-full max-w-4xl mx-auto mt-10">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${index * (100 / 3)}%)` }}
        >
          {products.map((product, i) => (
            <div key={i} className="w-1/3 flex-shrink-0 p-2">
              <Link
                to="/products/$slug"
                params={{ slug: product.product_slug }}
              >
                <img
                  src={product.product_image}
                  className="w-full object-cover rounded-xl shadow"
                  alt={product.product_name}
                />
                <div className="flex justify-between py-2">
                  <h3> {product.product_name}</h3>
                  <p> {product.product_price} kr</p>
                </div>
                <p className="text-sm text-gray-600">{product.product_brand}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={prev}
        className="absolute top-1/2 left-0 -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-gray-100 cursor-pointer"
      >
        <FaChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-0 -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-gray-100 cursor-pointer"
      >
        <FaChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
