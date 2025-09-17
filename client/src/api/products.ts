// useQuery: hook från react query. används för att hämta och cacha data asynkront
// UseQueryResult: typdefinition som beskriver vad hooken returnerar
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Product } from "../types";

const API_URL = "http://localhost:5000/api";

// fetch helpers
//asynkron funktion. i params är nycklar string och värden string eller undefined
async function fetchProducts(params: Record<string, string | undefined>) {
  //Skapar URLSearchParams-instans som bygger en querysträng
  const query = new URLSearchParams();

  // Loopa igenom alla [key, value] i params. Om value inte är tomt, lägg till i queryn
  // ex 
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value); // skippar undefined/null/tomma
  });

  const res = await fetch(`${API_URL}/products?${query.toString()}`); //query.toString() gör om URLSearchParams till querystring
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

async function fetchProductBySlug(slug: string): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

// react query hooks
// tar emot ett objekt med valfria filterparametrar. Default tomt objekt om inget kommer in
export function useProducts(params: { category?: string; q?: string; new?: string; random?: string } = {}) {
  return useQuery<Product[]>({
    queryKey: ["products", params], // react querys nyckel för caching. params är tomt objekt eller med parametrarna ovan
    queryFn: () => fetchProducts(params), // själva funktionen som hämtar data, kallar på fetch helper fetchProducts
    enabled: !!params, // enabled styr om queryn ska köras automatiskt eller inte. !!params gör params till boolean, här alltid true pga params alltid objekt
  });
}

export function useProduct(slug: string): UseQueryResult<Product, Error> {
  return useQuery<Product, Error>({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useSimilarProducts(excludeSlug: string){
  return useQuery<Product[]>({
    queryKey: ["similarProducts", excludeSlug],
    queryFn: () => fetchProducts({ exclude: excludeSlug, limit: "8", random: "true"}),
    enabled: Boolean(!!excludeSlug),
  });
}
