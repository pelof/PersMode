import type { Product } from "../types";
import { ProductCard } from "./ProductCard";

type CardGridProps = {
    products: Product[];
    hideNewsBadge?: boolean;
}

export function CardGrid({ products, hideNewsBadge }: CardGridProps) {
    return (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        {products.map((p) => (
        <ProductCard key={p.id} product={p} hideNewsBadge={hideNewsBadge}/>
        ))}
        </section>
    )
}