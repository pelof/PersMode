import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";

async function orderMutation(
  data: Record<string, string | FormDataEntryValue>
) {
  const res = await fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Kunde inte skapa order");
  return res.json();
}

export function useOrderMutation() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: Record<string, string | FormDataEntryValue>) =>
      orderMutation(data),
    onSuccess: (result) => {
      alert(`Tack för din order! Ordernummer: ${result.orderId}`);
      navigate({ to: "/order/confirmation" }); // redirect till confirmation
    },
    onError: (err: any) => {
      alert(err.message || "Något gick fel");
    },
  });
}
