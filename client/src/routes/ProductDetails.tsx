import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ProductCarousel } from "../components/ProductCarousel";
import { useParams } from "@tanstack/react-router";
import { useProduct } from "../api/products";
import { useAddToCart } from "@/api/cart";
import { useState } from "react";
import { useFavorites, useToggleFavorite } from "@/api/favorites";

export function ProductDetails() {

  
    
    // inte säkraste sättet, men funkar
    const { slug } = useParams({ strict: false });
    const { data: product, isLoading, error } = useProduct(slug);
    const addToCart = useAddToCart();
    const [quantity, setQuantity] = useState(1);

     const { data: favorites } = useFavorites();
    const toggleFavorite = useToggleFavorite();
    
    if (isLoading) return <p>Laddar...</p>;
    if (error) return <p>Ett fel uppstod: {error.message}</p>;
    if (!product) return <p>Produkten kunde inte hittas</p>;
    
    const handleAddToCart = () => {
      if (!product) return;
      addToCart.mutate({ product_SKU: product.product_SKU, quantity });
    };
    
    const today = new Date();
    const publishedDate = new Date(product.product_published);
    
    const diffTime = today.getTime() - publishedDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    const isNew = diffDays >= 0 && diffDays < 7;
    
    //Letar om produkten finns i favoriter. some returnerar true om minst ett objekt matchar.
    const isFavorite = favorites?.some(fav => fav.product_SKU === product.product_SKU);

  return (
    <section>
      <div className="flex flex-col md:flex-row">
        <div className="relative">
          <img
            src={product.product_image}
            alt={product.product_name}
            className="w-full min-w-md"
          />
          {/* TODO fixa funktionellt */}
          <button
                      type="button"
                      onClick={() => {
                        toggleFavorite.mutate(product.product_SKU);
                      }}
                      className="absolute right-3 bottom-3 text-4xl cursor-pointer hover:animate-[heartbeat_0.9s_ease-in-out_infinite_]"
                    >
                      {isFavorite ? <FaHeart /> : <FaRegHeart/>}
                    </button>
          {isNew && (
            <div className="absolute left-4 top-4 bg-black text-white px-2 py-1 rounded">
              Nyhet
            </div>
          )}
        </div>
        <div className="md:mx-3 lg:mx-5 max-w-2xl">
          <h1 className="text-2xl font-bold pt-3 md:pt-0">
            {product.product_name}
          </h1>
          <p className="mt-2 text-sm text-gray-600">{product.product_brand}</p>
          <p className="mt-2">{product.product_description}</p>
          <p className="text-xl font-semibold mt-2 md:mt-5">
            {product.product_price} kr
          </p>
          <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border-2 rounded w-20 pl-2 py-1. max-w-12"
            />
            <button
              type="button"
              className="border-1 rounded py-1 w-full md:w-40 cursor-pointer hover:shadow"
              onClick={handleAddToCart}
            >
              Lägg i varukorg
            </button>
          </div>
        </div>
      </div>
      <ProductCarousel currentSlug={slug} />
    </section>
  );
}
