import { FaRegHeart } from "react-icons/fa";
import { ProductCarousel } from "../components/ProductCarousel";
import type { Product } from "../types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

export function ProductDetails() {
  const { slug } = useParams({ from: "/products/$slug"});

  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["product", slug],
    queryFn: async () => {
      // const res = await fetch (`http://localhost:5000/api/products/${slug}`)
      const res = await fetch(`http://localhost:5000/api/products?slug=${slug}`)
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json()
    },
    enabled: !!slug, //Kör bara query om slug finns
  })

  if (isLoading) return <p>Laddar...</p>
  if (error) return <p>Ett fel uppstod: {error.message}</p>

  const product = data?.[0] //plockar ut första produkten

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
            <button type="button" className="border-1 rounded py-1 mt-2 w-full md:w-40">
              Lägg i varukorg
            </button>
          </div>
        </div>
      </div>
      {/* TODO - liknande produkter */}
      <ProductCarousel/>
    </section>
  );
}
//TODO dynamisk
