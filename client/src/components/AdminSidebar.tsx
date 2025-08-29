import { Link } from "@tanstack/react-router";

export function AdminSidebar() {
  return (
  <aside className="flex flex-col bg-gray-300 w-40 border-r-2 border-black py-3">
    <Link to="/admin/products" className="px-5 py-2 hover:underline">Produkter</Link>
    <Link to="/admin/categories" className="px-5 py-2 hover:underline">Kategorier</Link>
  </aside>
)
}
