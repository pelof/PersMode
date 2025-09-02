import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Product } from "../types";

const API_URL = "http://localhost:5000/api";

// fetch helpers

async function fetchProducts(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value); // skippar undefined/null/tomma
  });

  const res = await fetch(`${API_URL}/products?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

async function fetchProductBySlug(slug: string): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

// react query hooks

export function useProducts(params: { category?: string; q?: string; new?: string; random?: string }) {
  return useQuery<Product[]>({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    enabled: !!params,
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
