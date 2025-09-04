import { CardGrid } from "../components/CardGrid";
import { useParams } from "@tanstack/react-router";
import { useProducts } from "../api/products";
import { useCategories } from "@/api/categories";

export function Category() {
  //     // const { category } = useParams({ from: "/categories/$category" });
  //         const { category } = useParams({ strict: false });

  // //TODO kategorier från databasen
  //     //TODO till types-fil
  //     const categoryNames: Record<string, string> ={
  //         clothing: "Kläder",
  //         electronics: "Elektronik",
  //         home: "Till hemmet",
  //         mobile: "Mobiltelefoni",
  //         vehicles: "Fordon",
  //         shoes: "Skor",
  //         accessories: "Accessoarer",
  //     }
  //     const displayName = categoryNames[category] ?? category;

  //     const { data, isLoading } = useProducts({ category })
  //     if (isLoading) return <p> Laddar... </p>
const { category: categorySlug } = useParams({ strict: false });

const { data: categories, isLoading: catsLoading } = useCategories();


// hitta kategorin som matchar slugen i URL:en
const category = categories?.find((c: any) => c.slug === categorySlug);

const { data: products, isLoading } = useProducts({
    category: category ? String(category.id) : undefined,
});
if (catsLoading) return <p>Laddar kategorier...</p>;

if (!category) {
    return <p>Kategorin hittades inte</p>;
}

  if (isLoading) return <p>Laddar produkter...</p>;

  return (
    <>
      <h1 className="text-2xl text-center my-5">{category.name}</h1>
      <CardGrid products={products ?? []} />
    </>
  );
}