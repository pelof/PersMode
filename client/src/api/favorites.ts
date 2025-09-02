import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



const API_URL = "http://localhost:5000/api";

async function fetchFavorites(): Promise<string[]> {
    const res = await fetch(`${API_URL}/favorites`, { credentials: "include"});
    if (!res.ok) throw new Error("Failed to fetch favorites");
    return res.json();
}

async function toggleFavorite(product_SKU: string) {
    const res = await fetch(`${API_URL}/favorites/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({ product_SKU }),
    });
    if (!res.ok) throw new Error("Failed to toggle favorite");
    return res.json(); // { isFavorite: boolean, favorites: string[] }
}

// Hook för att hämta alla favoriter
export function useFavorites() {
    return useQuery({
        queryKey: ["favorites"],
        queryFn: fetchFavorites,
    });
}

// Hook för att toggla favorit
export function useToggleFavorite() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product_SKU: string) => toggleFavorite(product_SKU),
        onSuccess: () => {
            //uppdatera favorites-listan automatiskt
            queryClient.invalidateQueries({ queryKey: ["favorites"]});
        },
    });
}