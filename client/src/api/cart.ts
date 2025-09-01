import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


// --- GET CART ---
export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () =>
      fetch("http://localhost:5000/api/cart", {
        credentials: "include", // <- måste vara med
      }).then((res) => res.json()),
  });
}

// --- ADD TO CART ---
export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ product_SKU, quantity }: { product_SKU: string; quantity: number }) =>
      fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <- måste vara med
        body: JSON.stringify({ product_SKU, quantity }),
      }).then((res) => res.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

// --- REMOVE FROM CART ---
export function useRemoveFromCart() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ product_SKU }: { product_SKU: string}) =>
            fetch("http://localhost:5000/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <- måste vara med
        body: JSON.stringify({ product_SKU }),
      }).then((res) => res.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

// --- UPDATE CART ---
export function useUpdateCart() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ product_SKU, quantity}: { product_SKU: String; quantity: number }) =>
            axios.post("http://localhost:5000/api/cart/update", { product_SKU, quantity}, {withCredentials: true}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"]});
        },
    });
}

//TODO: i products använde jag API_URL, men funkade inte förut. testa igen