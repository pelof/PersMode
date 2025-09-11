import { useCategories } from "@/api/categories";
import type { Category } from "@/types";
import { useState } from "react";

export function NewProduct() {
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const { data, isLoading } = useCategories();
  const categories = data;

  // TODO flytta logik till egen fil
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();

    const target = e.currentTarget as HTMLFormElement;

    formData.append(
      "product_name",
      (target.elements.namedItem("name") as HTMLInputElement).value
    );
    formData.append(
      "product_description",
      (target.elements.namedItem("description") as HTMLTextAreaElement).value
    );
    formData.append(
      "product_brand",
      (target.elements.namedItem("brand") as HTMLInputElement).value
    );
    formData.append(
      "product_SKU",
      (target.elements.namedItem("SKU") as HTMLInputElement).value
    );
    formData.append(
      "product_price",
      (target.elements.namedItem("price") as HTMLInputElement).value
    );
    formData.append(
      "product_published",
      (target.elements.namedItem("published") as HTMLInputElement).value
    );
    formData.append("category_ids", JSON.stringify([selectedCategory]));

    const imageInput = target.elements.namedItem("image") as HTMLInputElement;
    if (imageInput.files && imageInput.files[0]) {
      formData.append("image", imageInput.files[0]);
    }

    fetch("http://localhost:5000/api/admin/products", {
      method: "POST",
      body: formData, // OBS! inte JSON.stringify
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("Produkt skapad!");
        target.reset();
        setSelectedCategory("");
      })
      .catch((err) => alert(err.message));
  }

  if (isLoading) return <p>Laddar kategorier...</p>;

  return (
    <>
      <h1 className="text-xl font-bold mb-5">Ny produkt</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label className="font-bold" htmlFor="name">
          Namn
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Ange namn"
          maxLength={25}
          required
          className="border border-gray-500 rounded px-3 py-1 w-75 my-3"
        />
        <label className="font-bold" htmlFor="description">
          Beskrivning
        </label>
        <textarea
          name="description"
          id="description"
          placeholder="Ange beskrivning"
          required
          className="border border-gray-500 rounded px-3 py-1 w-100 h-50 my-3"
        ></textarea>
        <label className="font-bold">Bild</label>
        <label
          htmlFor="image"
          className="border border-gray-500 rounded text-center px-3 py-1 w-25 my-3 inline-block cursor-pointer hover:bg-gray-100"
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
        <label className="font-bold" htmlFor="brand">
          Märke
        </label>
        <input
          type="text"
          name="brand"
          id="brand"
          required
          className="border border-gray-500 rounded px-3 py-1 w-75 my-3"
        />
        <label className="font-bold" htmlFor="SKU">
          SKU
        </label>
        <input
          type="text"
          name="SKU"
          id="SKU"
          placeholder="Ange SKU"
          pattern="[A-Z]{3}[0-9]{3}"
          title="Exempel: AAA123"
          required
          className="border border-gray-500 rounded px-3 py-1 w-30 my-3"
        />
        <label className="font-bold" htmlFor="price">
          Pris
        </label>
        <input
          type="number"
          name="price"
          id="price"
          required
          className="border border-gray-500 rounded px-1 py-1 pl-2 w-30 my-3"
        />
        <label className="font-bold" htmlFor="published">
          Publicieringsdatum
        </label>
        <input
          type="date"
          name="published"
          id="published"
          required
          className="border border-gray-500 rounded px-3 py-1 w-40 my-3"
        />
        {/* TODO: ev mer avancerad lösning som kryssrutor eller multi select */}
        <label className="font-bold" htmlFor="category">
          Kategorier
        </label>
        <select
          id="category"
          name="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
          className="border border-gray-500 rounded px-2 py-1 w-40 my-3"
          required
        >
          <option value="">Välj kategori</option>
          {categories.map((cat: Category) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="border border-gray-500 rounded px-3 py-1 w-25 my-3"
        >
          Lägg till
        </button>
      </form>
    </>
  );
}
