import { useAdminProducts, useDeleteProduct } from "@/api/adminProducts";
import { Link } from "@tanstack/react-router";
import { FaTrashAlt } from "react-icons/fa";

export function ProductList() {
  const { data, isLoading, error } = useAdminProducts();
  const deleteMutation = useDeleteProduct();

  if (isLoading) return <p>Laddar...</p>;
  if (error) return <p>Kunde inte ladda produkter</p>;

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">Produkter</h1>
        <Link
          to="/admin/products/new"
          className="border rounded border-black p-1 px-2 cursor-pointer"
        >
          Ny produkt
        </Link>
      </div>
      <table className="w-full table-fixed">
        <thead className="bg-gray-300 border border-black">
          <tr className="divide-x divide-black">
            <th className="w-1/3 px-4 py-1 text-left">Namn</th>
            <th className="w-1/6 px-4 py-1 text-left">SKU</th>
            <th className="w-1/6 px-4 py-1 text-left">Pris</th>
            <th className="w-1/20 px-4 py-1 text-left"></th>
          </tr>
        </thead>
        <tbody className="border border-black">
          {data?.map((product) => (
            <tr className="divide-x divide-black odd:bg-gray-200" key={product.product_SKU}>
              <td className="px-4 py-1">{product.product_name}</td>
              <td className="px-4 py-1">{product.product_SKU}</td>
              <td className="px-4 py-1">{product.product_price}</td>
              <td className="px-4 py-1 text-center">
                <button
                className="cursor-pointer"
                  onClick={() => { const confirmed = window.confirm(
                    `Är du säker på att du vill ta bort produkten "${product.product_name}"?`
                  );
                if (confirmed) {
                    deleteMutation.mutate(product.product_SKU);
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
