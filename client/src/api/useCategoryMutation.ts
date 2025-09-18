export function useCategoryMutation() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLFormElement;
    const formData = new FormData();

    formData.append(
      "name",
      (target.elements.namedItem("name") as HTMLInputElement).value
    );

    const imageInput = target.elements.namedItem("image") as HTMLInputElement;
    if (imageInput?.files?.[0]) {
      formData.append("image", imageInput.files[0]);
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/categories", {
        method: "POST",
        body: formData, // OBS! inte JSON.stringify
      });
      const data = await res.json();
      alert("Kategori skapad!");
      target.reset();
      return data;
    } catch (err: any) {
      alert(err.message);
      throw err;
    }
  };
  return handleSubmit;
}
