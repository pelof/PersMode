import { useProducts } from "@/api/products";
import { CardGrid } from "@/components/CardGrid";
import { useSearch } from "@tanstack/react-router";

export function Search() {
    const { q }= useSearch({ from: "/search" })

    const {data, isLoading} = useProducts({ q })

    if (isLoading) return <p>Laddar produkter...</p>
    if (q == 0) return <h1 className="text-2xl text-center my-5">Din sökning måste vara minst ett tecken långt</h1>
    if (!data || data.length === 0) {
        return (
                <h1 className="text-2xl text-center my-5">Inga produkter hittade</h1>
        )
    }
    
    if (data.length === 1) return(
        <>
                <h1 className="text-2xl text-center my-5">Hittade 1 produkt</h1>
                <CardGrid products={data ?? []}/>
        </>
    )

    return (
                <>
                <h1 className="text-2xl text-center my-5">Hittade {data.length} produkter</h1>
                <CardGrid products={data ?? []}/>
                </>
    )
}