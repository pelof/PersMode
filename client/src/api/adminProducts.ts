import type { Product } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



const API_URL = "http://localhost:5000/api/admin";


async function fetchAdminProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error("Failed to fetch admin products");
    return res.json();
}

async function deleteAdminProduct(sku: string) {
    const res = await fetch(`${API_URL}/products/${sku}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete product");
    return sku;
}

export function useAdminProducts() {
    return useQuery<Product[]>({
        queryKey: ["adminProducts"],
        queryFn: fetchAdminProducts,
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation<string, Error, string>({
        mutationFn: deleteAdminProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
        }
    })
}