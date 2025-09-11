
import { Link, useMatchRoute } from "@tanstack/react-router";

export function AdminSidebar() {

// Kolla om vi är på products eller categories
const matchProductsFn = useMatchRoute();
const matchCategoriesFn = useMatchRoute();

const matchProducts = matchProductsFn({ to: "/admin/products/new" }) || matchProductsFn({ to: "/admin/products"});
const matchCategories = matchCategoriesFn({ to: "/admin/categories/new" }) || matchCategoriesFn({ to: "/admin/categories"});


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
