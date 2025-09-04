import { Link } from "@tanstack/react-router";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import type { Product } from "../types";
import { useFavorites, useToggleFavorite } from "@/api/favorites";

type ProductCardProps = {
  product: Product;
  hideNewsBadge?: boolean;
};

export function ProductCard({ product, hideNewsBadge }: ProductCardProps) {
  const { data: favorites } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  const isFavorite = favorites?.some(
    (fav) => fav.product_SKU === product.product_SKU
  );

  const today = new Date();
  const publishedDate = new Date(product.product_published);
  const diffDays =
    (today.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);
  const isNew = diffDays >= 0 && diffDays < 7;

  return (
    <article className="flex flex-col justify-center relative">
      <Link to="/products/$slug" params={{ slug: product.product_slug }}>
        <div className="relative">
          <img
            src={`http://localhost:5000/images/products/${product.product_image}`}
            alt={product.product_name}
            className="w-full aspect-3/4"
          />
          {!hideNewsBadge && isNew && (
            <div className="absolute left-4 top-4 bg-black text-white px-2 py-1 rounded">
              Nyhet
            </div>
          )}
        </div>
        <div className="flex justify-between py-2">
          <h3> {product.product_name}</h3>
          <p> {product.product_price} kr</p>
        </div>
        <p className="text-sm text-gray-600">{product.product_brand}</p>
      </Link>
      <button
        type="button"
        onClick={() => {
          toggleFavorite.mutate(product.product_SKU);
        }}
        className="absolute right-3 bottom-17 text-4xl cursor-pointer hover:animate-[heartbeat_0.9s_ease-in-out_infinite_]"
      >
        {isFavorite ? <FaHeart /> : <FaRegHeart />}
      </button>
    </article>
  );
}
