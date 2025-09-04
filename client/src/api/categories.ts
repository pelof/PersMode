import { useQuery } from "@tanstack/react-query";

const API_URL = "http://localhost:5000/api";

export function useCategories() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/categories`);
            if (!res.ok) throw new Error("Failed to fetch categories");
            return res.json();
        },
    });
}