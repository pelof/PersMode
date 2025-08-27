import { useQuery } from "@tanstack/react-query";
import { CardGrid } from "../components/CardGrid";
import { Hero } from "../components/Hero";
import Spots from "../components/Spots";
import type { Product } from "../types";

export function Index() {

    const { data, isLoading } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5000/api/products`)
            return res.json()
        }
    })

    if (isLoading) return <p>Laddar...</p> 
    return (
        <>
        <Hero/>
        <Spots/>
        <CardGrid products={data ?? []}/>
        </>
    );
}