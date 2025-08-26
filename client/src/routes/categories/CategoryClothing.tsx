import { CardGrid } from "../../components/CardGrid";

export function CategoryClothing() {
    return (
        <>
        <h1 className="text-2xl text-center my-5">Kläder</h1>
        <CardGrid/>
        </>
    )
}

//TODO: info från databas behöver matas in i cardgrid för att sedan generera x antal kort.