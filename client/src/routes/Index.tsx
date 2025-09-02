import { CardGrid } from "../components/CardGrid";
import { Hero } from "../components/Hero";
import Spots from "../components/Spots";
import { useProducts } from "../api/products";

export function Index() {
    const { data, isLoading } = useProducts({random: "true"});

    
    if (isLoading) return <p>Laddar...</p> 
    if (!data || data.length === 0) return <p>Inga produkter hittades</p>;
    
    return (
        <>
        <Hero product={data[12] ?? []}/>
        <Spots products={data?.slice(8,11) ?? []}/>
        <CardGrid products={data?.slice(0,8) ?? []}/>
        </>
    );
}