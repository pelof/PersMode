import { CartContents } from "@/components/CartContents";
import { Link } from "@tanstack/react-router";

export function Cart() {
  return (
    <>
      <h1 className="text-2xl text-center my-5">Varukorgen</h1>
      <CartContents />
      <div className="flex justify-center">
        <Link to="/checkout" className="text-center text-xl border border-gray-500 rounded px-3 py-2 m-4 hover:bg-blue-200 duration-300 ease-in-out">
          Till kassan
        </Link>
      </div>
    </>
  );
}

// TODO dynamisk och itererande
