import { useProducts } from "@/api/products";
import { CardGrid } from "@/components/CardGrid";

export function News() {
  const { data, isLoading } = useProducts({ new: "true" });

  if (isLoading) return <p>Laddar produkter...</p>;

  if (!data || data.length === 0) {
    return (
      <h1 className="text-2xl text-center my-5">Inga nya produkter just nu</h1>
    );
  }

  return (
    <>
      <h1 className="text-2xl text-center my-5">
        {data.length} nya produkter
      </h1>
      <CardGrid products={data ?? []} hideNewsBadge/>
    </>
  );
}
