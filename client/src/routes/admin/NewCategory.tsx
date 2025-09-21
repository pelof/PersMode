import { useCategoryMutation } from "@/api/useCategoryMutation";

export function NewCategory() {
  const handleSubmit = useCategoryMutation();

  return (
    <>
      <h1 className="text-xl font-bold mb-5">Ny kategori</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="name" className="font-bold">
          Namn
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Ange namn"
          required
          className="border border-gray-500 rounded px-3 py-1 w-80 my-3"
          maxLength={25}
        />
        {/* TODO får error utan bra varning om filen är för stor */}
        <label className="font-bold">Bild</label>
        <label
          htmlFor="image"
          className="border border-gray-500 rounded text-center px-3 py-1 w-30 my-3 inline-block cursor-pointer hover:bg-gray-100"
        >
          Välj bild
        </label>
        <input
          type="file"
          accept=".jpeg, .png, .jpg"
          id="image"
          name="image"
          className="hidden"
          required
        />
        <button
          type="submit"
          // TODO bättre lösning på position
          className="border border-gray-500 rounded px-3 py-1 w-25 my-3 fixed bottom-10"
        >
          Lägg till
        </button>
      </form>
    </>
  );
}
