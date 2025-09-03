export function NewCategory() {
    return (
            <>
      <h1 className="text-xl font-bold mb-5">Ny produkt</h1>
      <form className="flex flex-col">
        <label htmlFor="name" className="font-bold">Namn</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Ange namn"
          required
          className="border border-gray-500 rounded px-3 py-1 w-1/3 my-3"
        />


        <label className="font-bold">Bild</label>
        <label
          htmlFor="image"
          className="border border-gray-500 rounded text-center px-3 py-1 w-1/8 my-3 inline-block cursor-pointer hover:bg-gray-100"
        >
          Välj bild
        </label>
        <input type="file" accept=".jpeg, .png, .jpg" id="image" name="image" className="hidden" />

      </form>
    </>

    )
}