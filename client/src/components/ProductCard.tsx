import { Link } from "@tanstack/react-router";
import { FaRegHeart } from "react-icons/fa";
import type { Product } from "../types";

type ProductCardProps = {
    product: Product;
    hideNewsBadge?: boolean;
}

export function ProductCard({ product, hideNewsBadge }: ProductCardProps) {
    const today = new Date();
    const publishedDate = new Date(product.product_published);
 
    const diffTime = today.getTime() - publishedDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    const isNew = diffDays >= 0 && diffDays < 7;


    return (
        <article className="flex flex-col justify-center">
        <Link to="/products/$slug" params={{ slug: product.product_slug }}>
        <div className="relative">
            <img src={product.product_image} alt={product.product_name} className="w-full"/>
            {/* TODO fixa funktionellt */}
            <FaRegHeart className="absolute right-3 bottom-3 text-4xl hover:animate-[heartbeat_0.9s_ease-in-out_infinite_]"/>
            {!hideNewsBadge && isNew && (
            <div className="absolute left-4 top-4 bg-black text-white px-2 py-1 rounded">Nyhet</div>
            )}
        </div>
        <div className="flex justify-between py-2">
            <h3> {product.product_name}</h3>
            <p> {product.product_price} kr</p>
        </div>
        <p className="text-sm text-gray-600">{product.product_brand}</p>
        </Link>
        </article>
    )
}
