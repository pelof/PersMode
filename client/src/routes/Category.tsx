import { CardGrid } from "../components/CardGrid";
import { useParams } from "@tanstack/react-router";
import { useProducts } from "../api/products";



export function Category() {
    // const { category } = useParams({ from: "/categories/$category" });
        const { category } = useParams({ strict: false });
    

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

    const { data, isLoading } = useProducts({ category })
//TODO lägg till "inget svar från databasen" eller liknande när sökningen tar för lång tid.
    if (isLoading) return <p> Laddar... </p>

    return (
        <>
        <h1 className="text-2xl text-center my-5">{displayName}</h1>
        <CardGrid products={data ?? []}/>
        </>
    )
}