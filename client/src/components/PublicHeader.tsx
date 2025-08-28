import { Link } from "@tanstack/react-router";
import { FaHeart, FaSearch } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { IoLogIn } from "react-icons/io5";


export function PublicHeader() {
  return (
    <header className="m-2">
      <div className="header-top flex flex-col w-full md:flex-row">
        <Link to="/" className="w-full max-w-2xl">
          <img src="https://placehold.co/450x110" alt="Logo" className="w-full"/>
        </Link>

        <div className="search-container flex flex-row my-2 w-full items-center justify-between md:justify-between">
          <form action="/search" className="search-form relative flex flex-row border-1 rounded-full h-9 w-full md:max-w-sm md:ml-3">
              <button type="submit">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 hover:cursor-pointer"/>
              </button>
            <input
              type="search"
              id="search"
              name="q"
              placeholder="Sök produkter..."
              aria-label="Sök produkter"
              className="w-full rounded-full pl-10 pr-3 text-sm focus:outline-none"
            />
          </form>
          <div className="header-icons flex flex-row gap-2 ml-3 md:gap-3">
            <Link to="" className="text-3xl md:text-2xl"><FaHeart /></Link>
            <Link to="/cart" className="text-3xl md:text-2xl"><FaBasketShopping /></Link>
            <Link to="" className="text-4xl md:text-3xl"><IoLogIn /></Link>
          </div>
        </div>
      </div>

      <nav>
        <ul className="nav-links text-xl md:text-lg md:flex md:gap-4 md:my-4">
            <li>
                <Link className="hover:underline" to="/news">Nyheter</Link>
            </li>
            <li>
                <Link className="hover:underline" to="/categories/$category" params={{ category: "clothing" }}>Kläder</Link>
            </li>
            <li>
                <Link className="hover:underline" to="/categories/$category" params={{ category: "accessories" }}>Accessoarer</Link>
            </li>
            <li>
                <Link className="hover:underline" to="/categories/$category" params={{ category: "shoes" }}>Skor</Link>
            </li>
        </ul>
      </nav>
    </header>
  );
}
