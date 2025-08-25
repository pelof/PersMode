import { ProductCard } from "./ProductCard";

export function CardGrid() {
    return (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        <ProductCard/>
        <ProductCard/>
        <ProductCard/>
        <ProductCard/>
        <ProductCard/>
        <ProductCard/>
        <ProductCard/>
        <ProductCard/>
        </section>
    )
}
//TODO dynamisk med lista från mappad array