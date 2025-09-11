import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_URL = "http://localhost:5000/api/admin/categories";

async function deleteCategory(slug: string) {
    const res = await fetch(`${API_URL}/${slug}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete category");
    return slug;
}


export function useCategories() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}`);
            if (!res.ok) throw new Error("Failed to fetch categories");
            return res.json();
        },
    });
}

//TODO bilden tas inte bort när kategorin tas bort
export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    })
}