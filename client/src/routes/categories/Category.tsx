import { useQuery } from "@tanstack/react-query";
import { CardGrid } from "../../components/CardGrid";



export function Category({category}) {

    const { data, isLoading } = useQuery({
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
        <h1 className="text-2xl text-center my-5">Kläder</h1>
        <CardGrid products={data}/>
        </>
    )
}

//TODO: info från databas behöver matas in i cardgrid för att sedan generera x antal kort.