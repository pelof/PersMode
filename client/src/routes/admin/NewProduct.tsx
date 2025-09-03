import {  useQuery } from "@tanstack/react-query";
import { useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
};

export function NewProduct() {
  // const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");

  // TODO flytta logik till egen fil
  //Hämta kategorier
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/categories");
      if (!res.ok) throw new Error("Kunde inte hämta kategorier");
      return res.json();
    },
  });

  // Mutation för att skapa produkt
  // const createProduct = useMutation({
  //   mutationFn: async (body: any) => {
  //     const res = await fetch("http://localhost:5000/api/products", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(body),
  //     });
  //     if (!res.ok) {
  //       const err = await res.json();
  //       throw new Error(err.error || "Misslyckades att spara produkt");
  //     }
  //     return res.json();
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["products"] }); // om du har en produktlista
  //     alert("Produkten sparad!");
  //   },
  //   onError: (error: any) => {
  //     alert(error.message);
  //   },
  // });

  // function handleCategoryChange(id: number) {
  //   setSelectedCategories((prev) =>
  //     prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
  //   );
  // }

  // function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);

  //   //Onödig?
  //   if (!selectedCategory) {
  //     alert("Välj en kategori");
  //     return;
  //   }

  //   const body = {
  //     product_name: formData.get("name"),
  //     product_description: formData.get("description"),
  //     product_image: formData.get("image"), // TODO: file upload separat
  //     product_brand: formData.get("brand"),
  //     product_SKU: formData.get("SKU"),
  //     product_price: Number(formData.get("price")),
  //     product_published: formData.get("published"),
  //     category_ids: [selectedCategory],
  //   };

  //   createProduct.mutate(body);
  //   e.currentTarget.reset();
  //   setSelectedCategory("");
  // }

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

    fetch("http://localhost:5000/api/products", {
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
          required
          className="border border-gray-500 rounded px-3 py-1 w-1/3 my-3"
        />
        <label className="font-bold" htmlFor="description">
          Beskrivning
        </label>
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
          className="border border-gray-500 rounded px-3 py-1 w-1/2 my-3"
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
          className="border border-gray-500 rounded px-3 py-1 w-1/6 my-3"
        />
        <label className="font-bold" htmlFor="price">
          Pris
        </label>
        <input
          type="number"
          name="price"
          id="price"
          required
          className="border border-gray-500 rounded px-1 py-1 pl-2 w-1/6 my-3"
        />
        <label className="font-bold" htmlFor="published">
          Publicieringsdatum
        </label>
        <input
          type="date"
          name="published"
          id="published"
          required
          className="border border-gray-500 rounded px-3 py-1 w-1/5 my-3"
        />
        {/* TODO: kategorier från databas. ev mer avancerad lösning som kryssrutor eller multi select */}
        {/* <label className="font-bold" htmlFor="category">
          Kategori
        </label>{" "}
        <select
          name="category"
          id="category"
          className="border border-gray-500 rounded px-3 py-1 w-1/5 my-3"
          required
        >
          {" "}
          <option value="Kategori 1">Kategori 1</option>{" "}
          <option value="Kategori 2">Kategori 2</option>{" "}
          <option value="Kategori 3">Kategori 3</option>{" "}
        </select>{" "}
        <input
          type="submit"
          value="Lägg till"
          className="border border-gray-500 rounded px-3 py-1 w-20 my-3"
        /> */}
        <label className="font-bold" htmlFor="category">
          Kategorier
        </label>
        <select
          id="category"
          name="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
          // multiple
          // value={selectedCategories.map(String)} // value måste vara string[]
          // onChange={(e) =>
          //   setSelectedCategories(
          //     Array.from(e.target.selectedOptions, (opt) => Number(opt.value))
          //   )
          // }
          className="border border-gray-500 rounded px-2 py-1 w-1/5 my-3"
          required
        >
          <option value="">Välj kategori</option>
          {categories.map((cat) => (
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
