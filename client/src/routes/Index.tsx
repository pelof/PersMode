import { CardGrid } from "../components/CardGrid";
import { Hero } from "../components/Hero";
import Spots from "../components/Spots";
import { useProducts } from "../api/products";

export function Index() {
    const { data, isLoading } = useProducts({});

    
    if (isLoading) return <p>Laddar...</p> 
    if (!data || data.length === 0) return <p>Inga produkter hittades</p>;
    
    //För random Hero från db
    const randomIndex = Math.floor(Math.random() * data.length)
    const heroProduct = data[randomIndex];
    return (
        <>
        <Hero product={heroProduct}/>
        <Spots products={data?.slice(8,11) ?? []}/>
        <CardGrid products={data?.slice(0,8) ?? []}/>
        </>
    );
}