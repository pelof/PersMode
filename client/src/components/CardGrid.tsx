import type { Product } from "../types";
import { ProductCard } from "./ProductCard";

type CardGridProps = {
    products: Product[];
}

export function CardGrid({ products }: CardGridProps) {
    return (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        {products.map((p) => (
        <ProductCard key={p.id} product={p}/>
        ))}
        </section>
    )
}
//TODO dynamisk med lista från mappad array