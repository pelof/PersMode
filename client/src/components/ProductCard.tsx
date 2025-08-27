import { Link } from "@tanstack/react-router";
import { FaRegHeart } from "react-icons/fa";
import type { Product } from "../types";

type ProductCardProps = {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <article className="flex flex-col justify-center">
        <Link to="/details" params={{ id: product.id }}>
        <div className="relative">
            <img src={product.product_image} alt={product.product_name} className="w-full"/>
            <FaRegHeart className="absolute right-3 bottom-3 text-4xl"/>
            <div className="absolute left-4 top-4 bg-black text-white px-2 py-1 rounded">Nyhet</div>
        </div>
        <div className="flex justify-between py-2">
            <h3> {product.product_name}</h3>
            <p> {product.product_price}</p>
        </div>
        <p className="text-sm text-gray-600">{product.product_brand}</p>
        </Link>
        </article>
    )
}


//TODO dynamisk