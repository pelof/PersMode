import { useCart, useRemoveFromCart } from "@/api/cart";
import type { Product } from "@/types";
import { Link } from "@tanstack/react-router";
import { FaRegTrashAlt } from "react-icons/fa";

export function CartContents() {
  const { data, isLoading } = useCart();
  const removeFromCart = useRemoveFromCart();

  if (isLoading) return <p>Laddar...</p>;

  // Om data är ett objekt med 'cart', använd den; annars använd data direkt.
  const cartItems: Product[] = Array.isArray(data) ? data : data?.cart ?? [];

  if (cartItems.length === 0) return <p>Inga produkter hittades</p>;

  const total = cartItems.reduce(
    (sum, product) => sum + product.product_price * product.quantity, 0
  );


  return (
    <>
      <ul className="md:hidden">
        {cartItems.map((product: Product) => 
            <li className="border border-border border-b-0 p-2 flex justify-between items-center first:rounded-t last:rounded-b last:border-b" key={product.product_SKU}>
              <div>
                <Link to="/products/$slug" params={{ slug: product.product_slug }} className="hover:underline m-1">
                  {product.product_name}
                </Link>
                <p className="m-1">{product.product_price} SEK</p>
              </div>
              <div>
                <h2 className="m-1">{product.product_price * product.quantity} kr</h2>
                <div className="m-1 flex justify-center">
                  <input
                    type="number"
                    min="1"
                    className="border-2 rounded max-w-15 px-1"
                    defaultValue={product.quantity}
                  />
                  <button className="p-1 text-2xl cursor-pointer" onClick={() => removeFromCart.mutate({ product_SKU: product.product_SKU })}>
                    <FaRegTrashAlt />
                  </button>
                </div>
              </div>
            </li>
        )}
      </ul>

      {/* TODO: automatiskt varannan mörkgrå */}
      <div className="mx-10 overflow-x-auto ">
        <table className="hidden md:table table-fixed border w-full border-collapse">
          <thead className="border-1 text-left bg-gray-400">
            <tr>
              <th className="w-1/2 lg:w-2/3 px-2 py-1">Produkt</th>
              <th className="px-2 py-1">Pris</th>
              <th className="px-2 py-1">Totalt</th>
              <th className="px-2 py-1">Antal</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {cartItems.map((product: Product) => 
            <tr className="divide-x odd:bg-gray-200 divide-gray-300" key={product.product_SKU}>
              <td className="px-2 py-1">
                <Link to="/products/$slug" params={{ slug: product.product_slug }}>{product.product_name}</Link>
              </td>
              <td className="px-2 py-1">{product.product_price} kr</td>
              <td className="px-2 py-1">{product.product_price * product.quantity} kr</td>
              <td className="px-2 py-1">
                <div className="flex">
                  <input
                    type="number"
                    min="1"
                    defaultValue={product.quantity}
                    className="border-2 rounded max-w-15 px-1 border-gray-300 bg-gray-100"
                  />

                  <button className="p-1 text-2xl cursor-pointer" onClick={() => removeFromCart.mutate({ product_SKU: product.product_SKU })}>
                    <FaRegTrashAlt />
                  </button>
                </div>
              </td>
            </tr>
            )}
          </tbody>
        </table>
      </div>
      <h3 className="my-2 mx-5 text-right md:mx-10">Totalt: {total} kr</h3>
    </>
  );
}
