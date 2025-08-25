import { Link } from "@tanstack/react-router";
import { FaRegHeart } from "react-icons/fa";

export function ProductCard() {
    return (
        <article className="flex flex-col justify-center">
        <Link to="/" className="">
        <div className="relative">
            <img src="https://placehold.co/300x400" alt="produkt" className="w-full"/>
            <FaRegHeart className="absolute right-3 bottom-3 text-4xl"/>
            <div className="absolute left-4 top-4 bg-black text-white px-2 py-1 rounded">Nyhet</div>
        </div>
        <div className="flex justify-between py-2">
            <h3> Produktens namn</h3>
            <p> 300 kr</p>
        </div>
        <p className="text-sm text-gray-600">Märke</p>
        </Link>
        </article>
    )
}