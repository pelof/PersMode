import { CardGrid } from "../components/CardGrid";
import { Hero } from "../components/Hero";
import Spots from "../components/Spots";
import { useProducts } from "../api/products";

export function Index() {
    const { data, isLoading } = useProducts({});

    if (isLoading) return <p>Laddar...</p> 
    return (
        <>
        <Hero/>
        <Spots products={data?.slice(8,11) ?? []}/>
        <CardGrid products={data?.slice(0,8) ?? []}/>
        </>
    );
}