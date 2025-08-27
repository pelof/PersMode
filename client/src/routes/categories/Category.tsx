import { useQuery } from "@tanstack/react-query";
import { CardGrid } from "../../components/CardGrid";
import type { Product } from "../../types";
import { useParams } from "@tanstack/react-router";



export function Category() {
    const { category } = useParams({ from: "/categories/$category" });

    //TODO till types-fil
    const categoryNames: Record<string, string> ={
        clothing: "Kläder",
        electronics: "Elektronik",
        home: "Till hemmet",
        mobile: "Mobiltelefoni",
        vehicles: "Fordon",
        shoes: "Skor",
        accessories: "Accessoarer",
    }
    const displayName = categoryNames[category] ?? category;

    const { data, isLoading } = useQuery<Product[]>({
        queryKey: ["products", category],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5000/api/products?category=${category}`)
            return res.json()
        },
        enabled: !!category,
    })

    if (isLoading) return <p> Laddar... </p>

    return (
        <>
        <h1 className="text-2xl text-center my-5">{displayName}</h1>
        <CardGrid products={data ?? []}/>
        </>
    )
}

//TODO: info från databas behöver matas in i cardgrid för att sedan generera x antal kort.