export function NewProduct() {
    
  return (
    <>
      <h1 className="text-xl font-bold mb-5">Ny produkt</h1>
      <form className="flex flex-col">
        <label className="font-bold" htmlFor="name">Namn</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Ange namn"
          required
          className="border border-gray-500 rounded px-3 py-1 w-1/3 my-3"
        />
        <label className="font-bold" htmlFor="description">Beskrivning</label>
        <textarea
          name="description"
          id="description"
          placeholder="Ange beskrivning"
          required
          className="border border-gray-500 rounded px-3 py-1 w-1/2 h-50 my-3"
        ></textarea>

        <label className="font-bold">Bild</label>
        <label
          htmlFor="image"
          className="border border-gray-500 rounded text-center px-3 py-1 w-1/8 my-3 inline-block cursor-pointer hover:bg-gray-100"
        >
          Välj bild
        </label>
        <input type="file" accept=".jpeg, .png, .jpg" id="image" name="image" className="hidden" />
   

        <label className="font-bold" htmlFor="brand">Märke</label>
        <input
          type="text"
          name="brand"
          id="brand"
          required
          className="border border-gray-500 rounded px-3 py-1 w-1/2 my-3"
        />
        <label className="font-bold" htmlFor="SKU">SKU</label>
        <input
          type="text"
          name="SKU"
          id="SKU"
          placeholder="Ange SKU"
          pattern="[A-Z]{3}[0-9]{3}"
          title="Exempel: AAA123"
          required
          className="border border-gray-500 rounded px-3 py-1 w-1/6 my-3"
        />
        <label className="font-bold" htmlFor="price">Pris</label>
        <input
          type="number"
          name="price"
          id="price"
          required
          className="border border-gray-500 rounded px-1 py-1 pl-2 w-1/6 my-3"
        />
        <label className="font-bold" htmlFor="published">Publicieringsdatum</label>
        <input
          type="date"
          name="published"
          id="published"
          required
          className="border border-gray-500 rounded px-3 py-1 w-1/5 my-3"
        />
        {/* TODO: kategorier från databas. ev mer avancerad lösning som kryssrutor eller multi select */}
        <label className="font-bold" htmlFor="category">Kategori</label>
        <select name="category" id="category" className="border border-gray-500 rounded px-3 py-1 w-1/5 my-3" required>
          <option value="Kategori 1">Kategori 1</option>
          <option value="Kategori 2">Kategori 2</option>
          <option value="Kategori 3">Kategori 3</option>
        </select>
        <input
          type="submit"
          value="Lägg till"
          className="border border-gray-500 rounded px-3 py-1 w-20 my-3"
        />
      </form>
    </>
  );
}
