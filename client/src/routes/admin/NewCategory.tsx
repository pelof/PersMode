export function NewCategory() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();

    const target = e.currentTarget as HTMLFormElement;

    formData.append(
      "name",
      (target.elements.namedItem("name") as HTMLInputElement).value
    );

    const imageInput = target.elements.namedItem("image") as HTMLInputElement;
    if (imageInput.files && imageInput.files[0]) {
      formData.append("image", imageInput.files[0]);
    }

    fetch("http://localhost:5000/api/categories", {
      method: "POST",
      body: formData, // OBS! inte JSON.stringify
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("Kategori skapad!");
        target.reset();
      })
      .catch((err) => alert(err.message));
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-5">Ny produkt</h1>
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
            className="border border-gray-500 rounded px-3 py-1 w-1/3 my-3"
            maxLength={25}
          />
{/* TODO får error utan bra varning om filen är för stor */}
          <label className="font-bold">Bild</label>
          <label
            htmlFor="image"
            className="border border-gray-500 rounded text-center px-3 py-1 w-1/8 my-3 inline-block cursor-pointer hover:bg-gray-100"
          >
            Välj bild
          </label>
          <input
            type="file"
            accept=".jpeg, .png, .jpg"
            id="image"
            name="image"
            className="hidden"
          />
        <button
          type="submit"
          // TODO bättre lösning på position
          className="border border-gray-500 rounded px-3 py-1 w-25 my-3 mt-200"
        >
          Lägg till
        </button>
      </form>
    </>
  );
}
