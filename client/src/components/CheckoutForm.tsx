import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
// import { useState } from "react";


export function CheckoutForm() {
const navigate = useNavigate();
// const [loading, setLoading] = useState(false);

  const orderMutation = useMutation({
    mutationFn: async (data: Record<string, string | FormDataEntryValue>) => {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Kunde inte skapa order");
      return res.json();
    },
    onSuccess: (result) => {
      alert(`Tack för din order! Ordernummer: ${result.orderId}`);
      navigate({ to: "/order/confirmation" }); // redirect till confirmation
    },
    onError: (err: any) => {
      alert(err.message || "Något gick fel");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    orderMutation.mutate(data, {
      // onSettled: () => setLoading(false),
    })
  }

  return (
    <>
      <h2 className="text-2xl text-center m-4">Kunduppgifter</h2>
      <form onSubmit={handleSubmit} className="mb-4 md:mx-10">
        <div className="grid grid-cols-1 mb-4 gap-3 max-w-5xl md:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="firstName">Förnamn</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              required
              className="border border-gray-500 rounded px-3 py-1 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastName">Efternamn</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              required
              className="border border-gray-500 rounded px-3 py-1 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">E-Post</label>
            <input
              id="email"
              type="text"
              name="email"
              required
              className="border border-gray-500 rounded px-3 py-1 w-full"
            />
          </div>
        </div>

        <fieldset className="flex flex-col space-y-4 border border-gray-400 p-5 pb-8 rounded">
          <legend>Adress</legend>
          <div className="flex flex-col">
            <label htmlFor="street">Gata</label>
            <input
              type="text"
              name="street"
              id="street"
              required
              className="border border-gray-500 rounded px-3 py-1 max-w-xl"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="postalCode">Postnummer</label>
            <input
              type="text"
              name="postalCode"
              id="postalCode"
              pattern="[0-9]{5}"
              title="Postnummer ska vara 5 siffror"
              maxLength={5}
              required
              className="border border-gray-500 rounded px-3 py-1 max-w-3xs"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="city">Stad</label>
            <input
              type="text"
              name="city"
              id="city"
              required
              className="border border-gray-500 rounded px-3 py-1 max-w-sm"
            />
          </div>
        </fieldset>
        <label className="flex items-center gap-2 py-2">
          <input type="checkbox" name="newsletter" value="1" id="newsletter" />
          Jag vill ta emot nyhetsbrev
        </label>
        <div className="flex justify-center py-3">
        <button type="submit" aria-label="Genomför köp" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 hover:cursor-pointer w-50">
          Köp
        </button>
        </div>
      </form>
    </>
  );
}
//funktionell checkout