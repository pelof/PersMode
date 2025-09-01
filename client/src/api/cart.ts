import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//Hämta cart
export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => fetch("/api/cart").then((res) => res.json()),
  });
}

//Lägg till produkt
export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) =>
      fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      }).then((res) => res.json()),

    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}
