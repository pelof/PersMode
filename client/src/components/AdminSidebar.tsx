
import { Link, useMatchRoute } from "@tanstack/react-router";

export function AdminSidebar() {

  // Kolla om vi är på products eller categories
  const matchProducts =
    useMatchRoute()({ to: "/admin/products" }) ||
    useMatchRoute()({ to: "/admin/products/*" });
  const matchCategories =
    useMatchRoute()({ to: "/admin/categories" }) ||
    useMatchRoute()({ to: "/admin/categories/*" });

  return (
    <aside className="flex flex-col bg-gray-300 w-40 border-r-2 border-black py-3">
      <Link
        to="/admin/products"
        className={`px-5 py-2 hover:underline ${
          matchProducts ? "font-bold" : ""
        }`}
      >
        Produkter
      </Link>
      <Link
        to="/admin/categories"
        className={`px-5 py-2 hover:underline ${
          matchCategories ? "font-bold" : ""
        }`}
      >
        Kategorier
      </Link>
    </aside>
  );
}
