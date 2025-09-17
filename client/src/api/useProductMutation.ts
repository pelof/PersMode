import { useState } from "react";

export function useProductMutation() {
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLFormElement;
    const formData = new FormData();

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

    // kategori
    formData.append("category_ids", JSON.stringify([selectedCategory]));

    // bilduppladdning
    const imageInput = target.elements.namedItem("image") as HTMLInputElement;
    if (imageInput?.files![0]) {
      formData.append("image", imageInput.files[0]);
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/products", {
        method: "POST",
        body: formData, // OBS! inte JSON.stringify
      });
      const data = await res.json();
      alert("Produkt skapad!");
      target.reset();
      setSelectedCategory("");
      return data;
    } catch (err: any) {
      alert(err.message);
      throw err;
    }
  };
  return {
    selectedCategory,
    setSelectedCategory,
    handleSubmit,
  };
}
