import { useFavorites } from "@/api/favorites";
import { CardGrid } from "@/components/CardGrid";

export function Favorites() {
  const { data: favorites, isLoading } = useFavorites();
  if (isLoading) return <p>Laddar...</p>;
  if (!favorites || favorites.length === 0) {
    return (
      <>
        <h1 className="text-2xl text-center my-5">Favoriter</h1>

        <p className="text-center">
          Inga favoriter ännu! <br /> Spara dina favoritprodukter till senare
          genom att klicka på deras hjärt-ikoner.
        </p>
      </>
    );
  }
  return (
    <>
      <h1 className="text-2xl text-center my-5">Favoriter</h1>
      <CardGrid products={favorites ?? []} />
    </>
  );
}
