import { FaRegHeart } from "react-icons/fa";
import { ProductCarousel } from "../components/ProductCarousel";
import { useParams } from "@tanstack/react-router";
import { useProduct } from "../api/products";

export function ProductDetails() {
  // inte säkraste sättet, men funkar
  const { slug } = useParams({ strict: false });


  const { data: product, isLoading, error } = useProduct(slug);

  if (isLoading) return <p>Laddar...</p>
  if (error) return <p>Ett fel uppstod: {error.message}</p>
  if (!product) return <p>Produkten kunde inte hittas</p>

  

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
          <FaRegHeart className="absolute right-3 bottom-3 text-4xl" />
          <div className="absolute left-4 top-4 bg-black text-white px-2 py-1 rounded">
            Nyhet
          </div>
        </div>
        <div className="md:mx-3 lg:mx-5 max-w-2xl">
          <h1 className="text-2xl font-bold">{product.product_name}</h1>
          <p className="mt-2 text-sm text-gray-600">{product.product_brand}</p>
          <p className="mt-2">
            {product.product_description}
          </p>
          <p className="text-xl font-semibold mt-2 md:mt-5">{product.product_price} kr</p>
          <div>
            {/* TODO: kopplat till ett POST anrop och varukorg */}
            <button type="button" className="border-1 rounded py-1 mt-2 w-full md:w-40">
              Lägg i varukorg
            </button>
          </div>
        </div>
      </div>
      {/* TODO - liknande produkter dynamisk */}
  <ProductCarousel currentSlug={slug} />

    </section>
  );
}

