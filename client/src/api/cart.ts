import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


// --- GET CART ---
export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () =>
      fetch("http://localhost:5000/api/cart", {
        credentials: "include",
      }).then((res) => res.json()),
  });
}

// --- ADD TO CART ---
export function useAddToCart() {
  const queryClient = useQueryClient(); //useQueryClient är react query (tanstack querys) cache-hanterare.
  return useMutation({ // returnerar useMutation-instans. ger tillgång till metoder som .mutate och statusfält(isLoading, isError osv)
    mutationFn: ({ product_SKU, quantity }: { product_SKU: string; quantity: number }) => //mutationFn definerar logiken. Tar in objekt med sku och quantity
      fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", //Skickar med cookies/session
        body: JSON.stringify({ product_SKU, quantity }),
      }).then((res) => res.json()), //svaret res.json() blir tillgängligt i mutationens "data"
      //TODO den här raden kan flyttas till en helper, alla mutationer använder den.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }), 
    //När mutationens anrop lyckas: invalidera alla queries med ["cart"]. Så react query automatiskt 
    // hämtar om varukorgen från servern, så UI visar ny data
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
        credentials: "include",
        body: JSON.stringify({ product_SKU }),
      }).then((res) => res.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

// --- UPDATE CART ---
export function useUpdateCart() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ product_SKU, quantity}: { product_SKU: string; quantity: number }) =>
        fetch("http://localhost:5000/api/cart/update",{
        method: "POST",
        headers: { "Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({ product_SKU, quantity}),
        }).then((res) => res.json()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });
}

//TODO: i products använde jag API_URL, men funkade inte förut. testa igen