import { useCategories, useDeleteCategory } from "@/api/categories";
import type { Category } from "@/types";
import { Link } from "@tanstack/react-router";
import { FaTrashAlt } from "react-icons/fa";

export function CategoryList() {
  const { data, isLoading, error } = useCategories();
  const deleteMutation = useDeleteCategory();

  if (isLoading) return <p>Laddar...</p>;
  if (error) return <p>Kunde inte ladda kategorier</p>;

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">Kategorier</h1>
        <Link
          to="/admin/categories/new"
          className="border rounded border-black p-1 px-2 cursor-pointer"
        >
          Ny kategori
        </Link>
      </div>
      <table className="w-full table-fixed">
        <thead className="bg-gray-300 border border-black">
          <tr className="divide-x divide-black">
            <th className="w-1/3 px-4 py-1 text-left">Namn</th>
          </tr>
        </thead>
        <tbody className="border border-black">
          {data?.map((category: Category) => (
            <tr
              className="divide-x divide-black odd:bg-gray-200"
              key={category.slug}
            >
              <td className="px-4 py-1 flex justify-between items-center">
                {category.name}
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    const confirmed = window.confirm(
                      `Är du säker på att du vill ta bort produkten "${category.name}"?`
                    );
                    if (confirmed) {
                      deleteMutation.mutate(category.slug);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "..." : <FaTrashAlt />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
